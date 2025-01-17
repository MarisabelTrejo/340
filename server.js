/* ******************************************
 * This server.js file is the primary file of the 
 * application. It is used to control the project.
 *******************************************/
/* ***********************
 * Require Statements
 *************************/
const express = require("express")
const expressLayouts = require("express-ejs-layouts")
console.log('express-ejs-layouts loaded successfully');
const env = require("dotenv").config()
const app = express()
const static = require("./routes/static")


/* ***********************
 * View Engine and Templates
 *************************/
app.set("view engine", "ejs")
app.set(expressLayouts)
app.set("partials", "./partials")
app.set("layout", "./layouts/layout")
/* ***********************
 * Routes
 *************************/
app.use(static)

// Index Route
app.get("/", function(req, res){
  res.render("index", {title: "Home"})
})

/* ***********************
 * Local Server Information
 * Values from .env (environment) file
 *************************/
const port = process.env.PORT
const host = process.env.HOST

/* ***********************
 * Log statement to confirm server operation
 *************************/
app.listen(port, () => {
  console.log(`app listening on ${host}:${port}`)
})
