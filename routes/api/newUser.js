/******************************FUNCTIONALITIES HERE*********************************/
// Add a new user

const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const config = require('config');

// user model
const userModel = require('../../models/User');

// routes //
// @route POST req to api/users
// @desc Register a new user
// @access No authorization req

router.post('/', (req, res) => {
  const { name, email, password } = req.body;

  // Validation
  if(!name || !email || !password) {
    return res.status(400).json({ msg : "Please fill in all fields." });
  } else {
    User.findOne({ email })
        .then(user => {
          if(user) {
            return res.status(400).json({ msg : "User already exists." })
          }
          // start registration

          bcrypt.genSalt(10, (err, salt) => {
            if(err) {
              res.json({err})
            } else {
              bcrypt.hash(password, salt, (err, hash) => {
                if(err) {
                  res.json({err})
                } else {
                  const newUser = new User({
                    name,
                    email,
                    password: hash
                  });
                  newUser
                  .save()
                  .then(user => {
                    // setting up jwt
                    jwt.sign(
                      { id: user._id },
                      config.get('jwtSecretKey'),
                      { expiresIn : 10800 },
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
                  })
                  .catch(err => res.json({err}));
                }
              })
            }
          });
        });
  }

});

module.exports = router;
