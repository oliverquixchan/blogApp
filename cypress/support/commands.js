/* eslint-disable linebreak-style */
/* eslint-disable no-undef */
// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

Cypress.Commands.add("login", ({ username, password }) => {
  cy.request("POST", "http://localhost:3003/api/login", {
    username, password
  }).then(({ body }) => {
    localStorage.setItem("loggedUser", JSON.stringify(body))
    cy.visit("http://localhost:3003")
  })
})

Cypress.Commands.add("create", ({ username, password, name }) => {
  cy.request("POST", "http://localhost:3003/api/users" , { username, password, name }
  )})

Cypress.Commands.add("newBlog", ({ title, author, url, likes }) => {
  const user = localStorage.getItem("loggedUser")
  const token = JSON.parse(user)
  cy.request({ method: "POST", url: "http://localhost:3003/api/blogs", headers: { "Authorization": `bearer ${token.token}` }, body: { title, author, url, likes } } )
    .then(response => {
      expect(response.status).to.eq(201)
    })
})
