/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
const mongoose = require("mongoose")
const supertest = require("supertest")
const app = require("../app")
const api = supertest(app)
const helper = require("./test_helper")
const Note = require("../models/blog")
const User = require("../models/user")

beforeEach( async () => {
  await Note.deleteMany({})
  const BlogObjects = helper.testEntries.map(entry => new Note(entry))
  const promiseArray = BlogObjects.map(blog => blog.save())
  await Promise.all(promiseArray)
})

test("notes are returned as json", async () => {
  await api
    .get("/api/blogs")
    .expect(200)
    .expect("Content-Type", /application\/json/)
})

test("there are two notes", async () => {
  const response = await api.get("/api/blogs")
  expect(response.body).toHaveLength(helper.testEntries.length)  
})

test("postingworks", async () => {
  await helper.newUser()
  const token = await helper.tokenFromUser()
  
  const newBlog = {
    title: "The bell Jar",
    author: "Sylvia Plath",
    url: "/asdsad/lmao",
    likes: 4
  }
  
  await api.post("/api/blogs")
    .set("Authorization", `Bearer ${token}`)
    .send(newBlog)
    .expect(201)
    .expect("Content-Type", /application\/json/)

  const blogsNow = await helper.blogsInDb()
  const content = blogsNow.map(blogs => blogs.title)

  expect(content).toHaveLength(helper.testEntries.length + 1)
  expect(content).toContain("The bell Jar")

})


test("postindoesnt work without token and 401 is returned", async () => {
  await helper.newUser()
  const token = await helper.tokenFromUser()
  
  const newBlog = {
    title: "The bell Jar",
    author: "Sylvia Plath",
    url: "/asdsad/lmao",
    likes: 4
  }
  
  await api.post("/api/blogs")
    .send(newBlog)
    .expect(401)
    .expect("Content-Type", /application\/json/)

})

test("test thers an id property", async () => {
  const blogsNow = await helper.blogsInDb()
  expect(blogsNow[0].id).toBeDefined()
})

test("likes default to 0 if property not defined", async () => {
  await helper.newUser()
  const token = await helper.tokenFromUser()

  const newBlog = {
    title: "The bell Jar",
    author: "Sylvia Plath",
    url: "/asdsad/lmao",  
  }

  await api.post("/api/blogs")
    .set("Authorization", `Bearer ${token}`)
    .send(newBlog)
    .expect(201)
    .expect("Content-Type", /application\/json/)

  const blogsNow = await helper.blogsInDb()
  expect(blogsNow[blogsNow.length -1].likes).toEqual(0)
  

})

test("400 status if required properties are not defined in new blog entry", async () => {
  await helper.newUser()
  const token = await helper.tokenFromUser()

  const newBlog = {
    author: "Sylvia Plath",
    url: "/asdsad/lmao"
  }

  const newBlog1 = {
    title: "The bell Jar",
    url: "/asdsad/lmao"
  }

  await api.post("/api/blogs")
    .set("Authorization", `Bearer ${token}`)
    .send(newBlog)
    .expect(400)

  await api.post("/api/blogs")
    .set("Authorization", `Bearer ${token}`)
    .send(newBlog1)
    .expect(400)
})

test("post is deleted", async () => {
  await helper.newUser()
  const token = await helper.tokenFromUser()

  const newBlog = {
    title: "The bell Jar",
    author: "Sylvia Plath",
    url: "/asdsad/lmao",  
  }

  await api.post("/api/blogs")
    .set("Authorization", `Bearer ${token}`)
    .send(newBlog)
    .expect(201)
    .expect("Content-Type", /application\/json/)

  const blogsNow = await helper.blogsInDb()
  const id = blogsNow[2].id
  

  await api.delete(`/api/blogs/${id}`)
    .set("Authorization", `Bearer ${token}`)
    .expect(204)

  const blogsUpdated = await helper.blogsInDb()
  expect(blogsUpdated).toHaveLength(blogsNow.length - 1)

})


afterAll(() => {
  mongoose.connection.close()
})