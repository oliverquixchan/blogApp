/* eslint-disable no-undef */
describe("Blog app", function() {
  beforeEach(function() {
    cy.request("POST", "http://localhost:3003/api/testing/reset")
    cy.create({ username: "olioli", password: "oliver2410", name: "oliver" })
    cy.visit("http://localhost:3003")
  })

  it("Login form is shown", function() {
    cy.contains("Login")
  })

  describe("Login", function() {
    it("fails with incorrect credentials", function() {
      cy.get("#username").type("oliver")
      cy.get("#password").type("haha")
      cy.get("#login-button").click()

      cy.contains("Wrong credentials")
      cy.get(".error").should("have.css", "color", "rgb(255, 0, 0)")
    })

    it("succeeds with correct credentials", function() {
      cy.get("#username").type("olioli")
      cy.get("#password").type("oliver2410")
      cy.get("#login-button").click()

      cy.contains("Logged in")
      cy.contains("logout").click()

    })
  })
})


describe("When logged in", function() {
  beforeEach(function() {
    cy.login({ username: "olioli", password: "oliver2410" })
  })

  it("user can create an entry", function() {
    cy.contains("create entry").click()
    cy.get("#title").type("this is a test")
    cy.get("#author").type("oliver")
    cy.get("#url").type("seventyfour.com")

    cy.get("#submit-new-entry").click()
    cy.get(".blogDisplay")
  })

  it("user can like a blog entry", function() {
    cy.contains("show").click()
    cy.get("#likeButton").click()
    cy.contains("1")
  })
})

describe("when theres an entry", function() {
  beforeEach(function() {
    cy.request("POST", "http://localhost:3003/api/testing/reset")
    cy.create({ username: "olioli", password: "oliver2410", name: "oliver" })
    cy.visit("http://localhost:3003")
    cy.login({ username: "olioli", password: "oliver2410" })
  })

  it("users cant delete somebody elses entry", function() {
    cy.newBlog({ title: "this is a test", author: "oliver", url: "hohocom" })
    cy.create({ username: "oliolioli", password: "oliver2410", name: "oliver" })
    cy.login({ username: "oliolioli", password: "oliver2410" })
    cy.contains("show").click()
    cy.contains("delete").click()
    cy.get(".blogDisplay")
  })

  it("users can delete their own entry", function() {
    cy.newBlog({ title: "this is a test", author: "oliver", url: "hohocom" })
    cy.visit("http://localhost:3003")
    cy.contains("show").click()
    cy.contains("delete").click()
    cy.get(".blogDisplay").should("not.exist")
  })


  describe("when theres multiple entries", function() {
    beforeEach(function() {
      cy.request("POST", "http://localhost:3003/api/testing/reset")
      cy.create({ username: "olioli", password: "oliver2410", name: "oliver" })
      cy.login({ username: "olioli", password: "oliver2410" })
      cy.newBlog({ title: "this is the first test", author: "oliver", url: "hohocom", likes: 40 })
      cy.newBlog({ title: "this is second test", author: "oliver", url: "hohocom", likes: 55 })
      cy.newBlog({ title: "this is the third test", author: "oliver", url: "hohocom", likes: 30 })
      cy.visit("http://localhost:3003")
    })

    it("Entries are sorted by number of likes in descending order", function() {
      cy.get(".blogDisplay").eq(0).should("contain", "this is second test")
      cy.get(".blogDisplay").eq(1).should("contain", "this is the first test")
      cy.get(".blogDisplay").eq(2).should("contain", "this is the third test")
    })
  })
})