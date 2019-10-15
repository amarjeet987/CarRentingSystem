/******************************FUNCTIONALITIES HERE*********************************/
// 1) READ all cars
// 2) ADD a car
// 3) UPDATE car details, cannot change booking details or status
// 4) Delete a car if no active bookings exist

const express = require('express');
const router = express.Router();
// middleware to restric the routes to authenticated users
const checkAuth = require("../../middlewares/auth");

// item model
const Car = require("../../models/Car");
const User = require("../../models/User");

/*********************** routes ***********************/


// @route POST req to api/car
// @desc ADD a car
// @access Authorization req

router.post('/', checkAuth, (req, res) => {
  const newCar = new Car({
    vehicle_no: req.body.vehicle_no,
    model: req.body.model,
    seating_capacity: req.body.seating_capacity,
    rent_per_day: req.body.rent_per_day
  });
  newCar.save().then(item => res.status(201).json({ message : "Item added successfully" }))
                .catch(err => res.status(500).json({ error: err }));
});

// @route POST req to api/car/id
// @desc UPDATE car details, cannot change booking details or status
// @access Authorization req
router.post('/:id', checkAuth, (req, res) => {
  Car.findById(req.params.id, (err, car)=> {
    if(!car) {
      res.status(404).json({ error: "No such car found to edit." });
    } else {

      var vals = ["vehicle_no", "model", "seating_capacity", "rent_per_day"];

      vals.map(key => {
        if(req.body[key]) car[key] = req.body[key];
      });

      car.save().then(car => res.status(201).json({ message : "Item updated successfully" }))
                 .catch(err => res.status(500).json({ error: "Cannot update item, try again." }));
    }
  });
});

// @route DELETE req to api/car/id
// @desc Delete a car
// @access Authorization req
router.delete('/:id', checkAuth, (req, res) => {
  Car.findById(req.params.id)
      .then(car => {
        if(car["booked_status"].length > 0) {
          return res.status(400).json({ message: "The car is currently booked, cannot delete car." })
        } else {
          car.remove()
          .then(item => res.status(410).json({ message : "Car deleted successfully" }))
          .catch(err => res.status(500).json({ error: "Cannot add item, try again." }));
        }
      })
      .catch(err => res.status(404).json({ success : false, error: "Entry not found" }));
});

/************************************* helper function for testing *************************************/
// @ route GET req to api/car/last
// @desc Get the last record
// gets the last entered entry's id

router.get('/last', (req, res) => {
  Car.find()
     .sort({_id : -1})
     .limit(1)
     .then(car => res.status(200).json(car))
     .catch(err => res.status(500).json({err}));
});


// @ route DELETE req to api/car/collections
// @desc Drop all records for repeating the tests
router.delete('/carcolls', checkAuth, (req, res) => {
    Car.find()
       .then(car => {
          car = null;
          car.save().then(car => res.status(410).json({message : "Car collection dropped successfully", car})
                    .catch(err => res.status(400).json({err});
       });
});

// @ route DELETE req to api/car/collections
// @desc Drop all records for repeating the tests
router.delete('/usercolls', checkAuth, (req, res) => {
    User.find().drop((err, ok) => {
      if(ok) {
        return res.status(410).json({message : "User collection dropped successfully"});
      } else {
        return res.status(400).json({err});
      }
    }); 
});



module.exports = router;
