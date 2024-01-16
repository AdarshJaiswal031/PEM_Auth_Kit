//-------- Imports ---------------
require("dotenv").config()
const express = require('express');
const path = require('path');
const indexRouter = require('./routes/index');
const app = express();
const session = require("express-session")
const MongoStore = require("connect-mongo");
const passport = require('passport');
const connection = require("./setups/config/database")



//--------------- SETUPS -----------------
const sessionStore = MongoStore.create({
  client: connection.getClient(),
  collectionName: "session-storage"
})
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  secret: "your_secret",
  resave: false,
  saveUninitialized: true,
  store: sessionStore,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 //Equals 24 hours
  }
}))
require("./setups/config/passport")
app.use(passport.initialize())
app.use(passport.session())
app.use('/', indexRouter);



module.exports = app;
