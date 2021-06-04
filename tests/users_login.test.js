/* eslint-disable no-undef */
const mongoose = require("mongoose")
const supertest = require("supertest")
const app = require("../app")
const api = supertest(app)
const helper = require("./test_helper")
const bcrypt = require("bcrypt")
const User = require("../models/user")


describe("creating users", () => {
  beforeEach(async () => {
    await User.deleteMany({})
  
    const passwordHash = await bcrypt.hash("sekret", 10)
    const user = new User({ username: "root", passwordHash })
  
    await user.save()
  })
  
  test("creation succeeds with a fresh username", async () => {
    const usersAtStart = await helper.usersInDb()
  
    const newUser = {
      username: "mluukkai",
      name: "Matti Luukkainen",
      password: "salainen",
    }
  
    await api
      .post("/api/users")
      .send(newUser)
      .expect(200)
      .expect("Content-Type", /application\/json/)
  
    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length + 1)
  
    const usernames = usersAtEnd.map(u => u.username)
    expect(usernames).toContain(newUser.username)
  })
  test("creation fails with proper statuscode and message if username already taken", async () => {
    const usersAtStart = await helper.usersInDb()
    
    const newUser = {
      username: "root",
      name: "Superuser",
      password: "salainen",
    }
    
    const result = await api
      .post("/api/users")
      .send(newUser)
      .expect(400)
      .expect("Content-Type", /application\/json/)
    
    expect(result.body.error).toContain("`username` to be unique")
    
    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length)
  })

  test("creation fails if the username/password is not long enough", async () => {
    const usersAtStart = await helper.usersInDb()

    const newUserWithoutUsernameValidation = {
      username: "ro",
      name: "Superuser",
      password: "salainen",
    }
        
    const newUserWithShortPassword = {
      username: "root122",
      name: "Superuser",
      password: "sa",
    }

    const result1 = await api
      .post("/api/users")
      .send(newUserWithShortPassword)
      .expect(400)
      .expect("Content-Type", /application\/json/)

    console.log(result1.body.error)
    expect(result1.body.error).toContain("3")
          

    const result2 = await api
      .post("/api/users")
      .send(newUserWithoutUsernameValidation)
      .expect(400)
      .expect("Content-Type", /application\/json/)

    console.log(result1.body.error)
    expect(result2.body.error).toContain("3")
          
    const usersAtTheEnd = await helper.usersInDb()
    expect(usersAtTheEnd).toHaveLength(usersAtStart.length)
          

  })
})




afterAll(() => {
  mongoose.connection.close()
})