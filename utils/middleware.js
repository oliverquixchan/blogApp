/* eslint-disable no-undef */
const logger = require("../utils/logger")
const jwt = require("jsonwebtoken")
const User = require("../models/user")

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" })
}

const errorHandler = (error, request, response, next) => {
  logger.error(error.message)
  
  if (error.name === "CastError") {
    return response.status(400).send({ error: "malformatted id" })
  } else if (error.name === "ValidationError") {
    return response.status(400).json({ error: error.message })
  }
  
  next(error)
}
 
const getTokenFrom = (request, response, next) => {
  if(request.get("authorization")) {
    const authorization = request.get("authorization")
    request.token = authorization.substring(7)
  }
    

  next()
    
}

const getUserFromToken = async (request, response, next) => {
  if(request.get("authorization")) {
    const decodedToken = jwt.verify(request.token, process.env.SECRET)
    request.user = await User.findById(decodedToken.id)
  }
 
  next()
}

module.exports = {
  errorHandler,
  unknownEndpoint,
  getTokenFrom,
  getUserFromToken
}