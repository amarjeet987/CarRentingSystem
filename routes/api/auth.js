/******************************FUNCTIONALITIES HERE*********************************/
// Authorize a user by generating the JWT token for the user to access restricted routes

const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');

// user model
const userModel = require('../../models/User');

// routes //
// @route POST req to api/auth
// @desc Auth a new user
// @access No authorization req

router.post('/', (req, res) => {
  const { email, password } = req.body;

  // Validation
  if(!email || !password) {
    return res.status(400).json({ msg : "Please fill in all fields." });
  } else {
    User.findOne({ email })
        .then(user => {
          if(!user) {
            return res.status(400).json({ msg : "User doesn't exist." })
          }

          // start auth
          bcrypt.compare(password, user.password)
          .then(loggedIn => {
            if(!loggedIn) {
              return res.status(400).json({ error: "Invalid Creds." });
            }
            // jwt setup
            jwt.sign(
              { id: user._id },
              config.get('jwtSecretKey'),
              { expiresIn : 10800000000 },          // the token won't expire for a long time
              (err, token) => {
                if(err) throw err;
                res.json({
                  token,
                  user: {
                    id: user._id,
                    name: user.name,
                    email: user.email
                  }
                });
              });
          });
        });
  }

});

module.exports = router;
