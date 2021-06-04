/* eslint-disable no-undef */
const express = require("express")
require("express-async-errors")
const app = express()
const cors = require("cors")
const config = require("./utils/config")
const blogRouter = require("./controllers/blog")
const loginRouter = require("./controllers/login")
const userRouter = require("./controllers/user")
const logger = require("./utils/logger")
const middleware = require("./utils/middleware")
const mongoose = require("mongoose")


const mongoUrl = config.MONGODB_URI

mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })
  .then(() => {
    logger.info("connected to MongoDB")
  })
  .catch((error) => {
    logger.error("error connecting to MongoDB:", error.message)
  })

app.use(cors())
app.use(express.static("build"))
app.use(express.json())
app.use("/api/blogs", middleware.getTokenFrom, middleware.getUserFromToken, blogRouter)
app.use("/api/users", userRouter)
app.use("/api/login", loginRouter)

if (process.env.NODE_ENV === "test") {
  const testingRouter = require("./controllers/testing")
  app.use("/api/testing", testingRouter)
}

app.use(middleware.errorHandler)
app.use(middleware.unknownEndpoint)
module.exports = app

