const Blog = require("../models/blog")
const supertest = require("supertest")
const app = require("../app")
const api = supertest(app)
const User = require("../models/user")

const testEntries = [
  {
    title: "The bell Jar",
    author: "Sylvia Plath",
    url: "/asdsad/lmao",
    likes: 4
  },   
  {
    title: "The bell Jar",
    author: "Syasd",
    url: "/asdsad/lmao",
    likes: 56
  }   
]

const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map(blog => blog.toJSON())
}

const usersInDb = async () => {
  const users = await User.find({})
  return users.map(u => u.toJSON())
}

const newUser = async () => {
  await User.deleteMany({})

  const newUser = {
    username: "asd",
    name: "Matti Luukkainen",
    password: "salainen",
  }
  
  await api
    .post("/api/users")
    .send(newUser)
    .expect(200)
    .expect("Content-Type", /application\/json/)
}

const tokenFromUser = async() => {
      
  const userLogin = {
    username: "asd",
    password: "salainen"
  }
  const result = await api.post("/api/login").send(userLogin).expect(200)
  console.log(result.body.token)
  const token = result.body.token
  return token
}


module.exports = {
  testEntries,
  blogsInDb,
  usersInDb,
  newUser,
  tokenFromUser
}