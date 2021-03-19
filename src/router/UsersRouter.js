const express = require('express')
const UsersRouter = express.Router()
const bodyParser = express.json()
const UsersService = require('./UsersService')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { JWT_SECRET } = require('../config')
const logger = require('../logger.js')

const checkToken = (req,res,next) => {
    const authHeader = req.headers.authorization
    const token = authHeader && authHeader.split(' ')[1]
    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) return res.sendStatus(403)
        req.user = user
        next()
    })
}

UsersRouter
    .route('/api/test')
    .get(bodyParser, (req,res,next) => {
        res.send("working").status(200)
    })

UsersRouter
    .route('/api/register')
    .post(bodyParser, (req,res,next) => {
        const { email, username, password } = req.body
        const new_user = { email, username, password }
        UsersService.checkUsername(req.app.get('db'), new_user.username )
            .then(username => {
                if (username.length == 0 || username == undefined) {
                    bcrypt.hash(new_user.password, 4, function (err, hash) {
                        if (err) return next(err)
                        new_user.password = hash
                        UsersService.newUser(req.app.get('db'), new_user)
                            .then(user => {
                                logger.info(`${new_user.username} registered`)
                                res.json(user).status(201)
                            })
                        })
                }  else if (username) {
                        return res.status(404).json({
                            error: { message: `Username already exists` }
                    })  
                }
            })
            .catch(next)
        })

UsersRouter
    .route('/api/login')
    .post(bodyParser, (req,res,next) => {
        const { username, password } = req.body
        const login_user = { username, password }
        for (const [key, value] of Object.entries(login_user))
            if (value === null) {
                logger.error('missing username or password')
                return res.status(400).json({error: `Missing '${key}' in request body`})
            }
            UsersService.getUser(req.app.get('db'),login_user.username )
                .then(dbUser => {
                    if (!dbUser) {
                        logger.error('incorrect username or password')
                        return res.status(401).json({error: 'Incorrect username or password'})
                    }
                    return UsersService.comparePasswords(login_user.password, dbUser[0].password)
                        .then(compareMatch => {
                            if (!compareMatch) {
                                logger.error('incorrect username or password')
                                return res.status(401).json({error: 'Incorrect username or password',})
                            }
                            const payload = { username: dbUser[0].username }
                            const token = jwt.sign( payload, JWT_SECRET )
                            res.json({ authToken: token }).status(200)
                            logger.info(`${payload.username} logged in`)
                            console.log( payload, token )
                        })
                        .catch(next)
                        })
                .catch(next)    
    })

UsersRouter
    .route('/api/verifyId')
    .get( checkToken, (req,res,next) => {
        const { username } = req.user
        res.json(username).status(200)
        next()
    })

UsersRouter
    .route('/api/verifyLists')
    .get( checkToken, (req,res,next) => {
        const { username } = req.user
        UsersService.seedUserLists(req.app.get('db'), username)
            .then(data => {
                res.json(data).status(200)
            })
            .catch(next)
    })

UsersRouter
    .route('/api/verifyItems')
    .get( checkToken, (req,res,next) => {
        const { username } = req.user
        UsersService.seedUserItems(req.app.get('db'), username)
            .then(data => {
                res.json(data).status(200)
            })
            .catch(next)
})

UsersRouter
    .route('/api/lists')
    .post(checkToken, bodyParser, (req,res,next) => {
        const { title } = req.body
        const { username } = req.user
        if (!username) {
            logger.error('user not verified')
            res.status(400).res.send('try again')
        }
        if (!title) {
            logger.error(`no title`)
            return res.status(400).res.send('incomplete info')
        }
        const newList = { title, username }
        UsersService.addList(req.app.get('db'), newList)
            .then(data => {
                logger.info(`POST: ${newList.username}  ${newList.title}`)
                return res.json(data).status(201)
            })
            .catch(next)
    })
    .delete(checkToken, bodyParser, (req,res,next) => {
        const { id } = req.body
        const { username } = req.user
        if (!username) {
            logger.error('user not verified')
            res.status(400).res.send('try again')
        }
        if (!id) {
            logger.error('no listId')
            return res.status(400).res.send('incomplete info')
        }
        UsersService.deleteList(req.app.get('db'), id, username)
            .then(numRowsAffected => {
                logger.info(`DELETED: list ${id}`)
                return res.status(204).end()
            })
            .catch(next)
    })

UsersRouter
    .route('/api/items')
    .post(checkToken, bodyParser, (req,res,next) => {
        const { name, list_id } = req.body
        const { username } = req.user
        if (!name || !list_id) {
            logger.error('no name or list_id on items POST')
            return res.status(400).send('incomplete info')
        }
        const newItem = { name, list_id }
        UsersService.addItem(req.app.get('db'), newItem, username)
            .then(data => {
                logger.info(`${username} new item: ${newItem.name} w/ listId: ${newItem.list_id}`)
                return res.json(data).status(201)
            })
            .catch(next)
    })
    .delete(checkToken, bodyParser, (req,res,next) => {
        const { item_id } = req.body
        const { username } = req.user
        if (!item_id) {
            logger.error('no item_id on items DELETE')
            return res.status(400).send('incomplete info')
        }
        UsersService.deleteItemVerify(req.app.get('db'), item_id)
            .then(data => {
                if (data[0].username !== username) {
                    return res.status(404).send('no access')
                }
                UsersService.deleteItemFinish(req.app.get('db'), item_id)
                    .then(numRowsAffected => {
                        logger.info(`DELETED: item ${item_id}`)
                        return res.status(204).end()
                    })
                    .catch(next)
            })
            .catch(next)
    })

module.exports = UsersRouter