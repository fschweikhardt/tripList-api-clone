const { API_TOKEN } = require('./config')
const logger = require('./logger')

function validateBearerToken(req, res, next) {
  const authToken = req.get('Authorization')
  let split = authToken.split(' ')[1]
  
  if (!authToken || Number(split) !== Number(API_TOKEN)) {
    logger.error(`Unauthorized request to path: ${req.path}`)
    return res.status(401).json({ 
      error: 'Unauthorized request' 
    })
  }
  next()
}

module.exports = validateBearerToken