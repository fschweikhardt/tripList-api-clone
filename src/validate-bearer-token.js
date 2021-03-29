const { API_TOKEN } = require('./config')
const logger = require('./logger')

function validateBearerToken(req, res, next) {
  const authToken = req.get('Authorization')
  if (!authToken) {
    logger.error(`No authToken - request to path: ${req.path}`)
    return res.status(401).json({ 
      error: 'Unauthorized request' 
    })
  }

  let split = authToken.split(' ')[1]

  if (Number(split) !== Number(API_TOKEN)) {
    logger.error(`No token match - request to path: ${req.path}`)
    return res.status(401).json({ 
      error: 'Unauthorized request' 
    })
  }

  next()
}

module.exports = validateBearerToken