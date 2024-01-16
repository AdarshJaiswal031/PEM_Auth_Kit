const express = require('express');
const { genPassword } = require('../setups/lib/passwordUtils');
const router = express.Router();
const connection = require("../setups/config/database");
const passport = require('passport');
const User = connection.models.User
const { isAuthorized } = require("./middlewares")
require("dotenv").config()

//------------- GET ROUTES --------------------
router.get('/', function (req, res, next) {
  res.render('index', { title: 'PEM Auth Kit' });
});
router.get("/signin", (req, res, next) => {
  res.render('signin', { title: `SignIn` })
})
router.get("/signup", (req, res, next) => {
  res.render('signup', { title: `SignUp`, error: "" })
})
router.get("/protected-route", isAuthorized, function (req, res, next) {
  res.render('protected', { title: `Protected` })

})
router.get("/signout", function (req, res, next) {
  req.logout(function (err) {
    if (err) {
      return next(err)
    }
    res.redirect('/protected-route')
  })

})



//--------------POST ROUTES-----------------------
router.post("/signup", async function (req, res, next) {
  const saltHash = genPassword(req.body.password)
  const salt = saltHash.salt
  const hash = saltHash.hash
  try {
    const newUser = new User({
      username: req.body.username,
      hash: hash,
      salt: salt
    })

    await newUser.save()
    res.redirect("/signin")

  }
  catch (err) {
    if (err.code === 11000) {
      const errorMessage = 'Username already taken!!';
      return res.render('error', { title: "Error", error: errorMessage });
    }

    console.error(err);
    return res.status(500).send('Internal Server Error');
  }
})
router.post("/signin", passport.authenticate("local", { failureRedirect: "/signin", successRedirect: "/protected-route" }))

module.exports = router;
