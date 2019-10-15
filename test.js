/******************************FUNCTIONALITIES HERE*********************************/
// 1) View all bookable cars, filtered by seating capacity and rent per day
// 2) Show a particular car details and its bookings
// 3) Book a car

const express = require('express');
const router = express.Router();
// middleware to restric the routes to authenticated users
const checkAuth = require("../../middlewares/auth");

// item model
const Car = require("../../models/Car");
const User = require("../../models/User");

/*********************** routes ***********************/
// @ route DELETE req to api/car/collections
// @desc Drop all records for repeating the tests
router.delete('/deluser/:id', checkAuth, (req, res) => {
    User.findById(req.params.id)
    .then(user => {
      user.remove()
      .then(done => res.status(200).json({ message: "User deleted successfully" }))
      .catch(err => res.status(400).json({ err }));
    })
    .catch(err => res.status(400).json({ err }));
});

router.delete('/delcar/:id', checkAuth, (req, res) => {
    Car.findById(req.params.id)
    .then(car => {
      car.remove()
      .then(done => res.status(200).json({ message: "Car deleted successfully" }))
      .catch(err => res.status(400).json({ err }));
    })
    .catch(err => res.status(400).json({ err }));
});

module.exports = router;
