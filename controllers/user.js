const bcrypt = require("bcrypt")
const usersRouter = require("express").Router()
const User = require("../models/user")



usersRouter.post("/", async (request, response) => {
  const body = request.body
  if (body.password === undefined || body.password.length < 3){
    return response.status(400).send({ error: "need password to be longer than 3 digits" })
  }

  const saltRounds = 10
  const passwordHash = await bcrypt.hash(body.password, saltRounds)

  const user = new User({
    username: body.username,
    name: body.name,
    passwordHash,
  })

  const savedUser = await user.save()

  response.json(savedUser)
})

usersRouter.get("/", async (request, response) => {
  const users = await User.find({}).populate("blogs", { url:1, title: 1,author: 1 })
  response.json(users)
})
module.exports = usersRouter