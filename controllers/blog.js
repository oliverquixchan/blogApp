/* eslint-disable no-unused-vars */
const blogRouter = require("express").Router()
const Blog = require("../models/blog")
const User = require("../models/user")
const jwt = require("jsonwebtoken")
const { getTokenFrom, getUserFromToken } = require("../utils/middleware")


blogRouter.get("/", async (request, response) => {
  const blogs = await Blog.find({}).populate("user", { username: 1, name: 1})
  response.json(blogs)
  /*
    Blog
      .find({})
      .then(blogs => {
        response.json(blogs)
      })
  */
})

blogRouter.post("/",  getTokenFrom, getUserFromToken, async (request, response) => {
  const body = request.body
    
  if (!request.token || !request.user) {
    return response.status(401).json({ error: "token missing or invalid" })
  }
  const user = request.user
    
  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes,
    user: user._id
  })

  const newBlog = await blog.save()
  user.blogs = user.blogs.concat(newBlog._id)
  await user.save()
  response.status(201).json(newBlog)
    
  /*
    blog
      .save()
      .then(result => {
        response.status(201).json(result)
      })
    */
})

blogRouter.delete("/:id", getTokenFrom, getUserFromToken, async (request, response) => {

  if (!request.token || !request.user) {
    return response.status(401).json({ error: "token missing or invalid" })
  }

  
  const blog = await Blog.findById(request.params.id)

  if (blog.user.toString() === request.user.id.toString()) {
    await Blog.findByIdAndRemove(request.params.id)
    response.status(204).end()
  } else {
    response.status(400).json({error:"can not delete whats not yours honey"})
  }
  
})

blogRouter.put("/:id", (request, response) => {
  const body = request.body

  const blog = {
    title: body.title,
    author: body.author,
    likes: body.likes,
    url: body.url
  }

  Blog
    .findByIdAndUpdate(request.params.id, blog, {new:true})
    .then(updatedBlog => {
      response.json(updatedBlog)
    }).catch(error => console.log(error))
})

blogRouter.post("/:id/comments", async (request, response) => {
  const blogs = await Blog.find({}).populate("user", { username: 1, name: 1})

  const blog = blogs.find(blog => blog._id.toString() === request.params.id)
  blog.comments.push(request.body.comment)
  const final = await blog.save()

  response.status(201).json(final)
  //Blog.findByIdAndUpdate(request.params.id, )
})

module.exports = blogRouter 