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

/*********************** routes ***********************/

// @route GET req to api/car
// @desc READ all bookable cars, filter by seating capacity and rent per day
// @access Authorization req
router.get('/', checkAuth, (req, res) => {
  query = {}

  // seating capacity
  var max_seat_cap = 100000000;       // very large value which can never be reached in this case
  var min_seat_cap = 0;
  if(req.query.max_seatingcap)  max_seat_cap = Number(req.query.max_seatingcap);
  if(req.query.min_seatingcap)  min_seat_cap = Number(req.query.min_seatingcap);
  query['seating_capacity'] = { $gte: min_seat_cap, $lte: max_seat_cap};

  // rent per day
  var max_rent_per_day = 100000000;       // very large value which can never be reached in this case
  var min_rent_per_day = 0;
  if(req.query.max_rent_per_day) max_rent_per_day = req.query.max_rent_per_day;
  if(req.query.min_rent_per_day) min_rent_per_day = req.query.min_rent_per_day;

  query['rent_per_day'] = { $lte : max_rent_per_day, $gte : min_rent_per_day };

  console.log(query);

  Car.find(query)
      .then(cars => res.status(302).json(cars))
      .catch(err => res.status(500).json({ error: err }));
});

// @route GET req to api/car
// @desc show a particular car details and its bookings
// @access Authorization req
router.get('/:id', checkAuth, (req, res) => {
  Car.find({_id : req.params.id})
      .then(cars => res.status(302).json(cars))
      .catch(err => res.status(500).json({ error: err }));
});

// @route POST req to api/car/id
// @desc book a car
// @access Authorization req
router.post('/:id', checkAuth, (req, res) => {
  Car.findById(req.params.id, (err, car)=> {
    if(!car) {
      return res.status(404).json({ error: "No such car found." });
    } else {
        if(req.body.customer_name && req.body.customer_contact_no && req.body.issue_date && req.body.return_date) {
          if(new Date(req.body.return_date) < new Date(req.body.issue_date)) {
            return res.status(400).json({ error: "Invalid entry, return date is before request date." });
          } else {
            for(var i = 0; i < car.booked_status.length; i++) {
              if(!(new Date(req.body.issue_date) >= new Date(car.booked_status[i].issue_date)
                  && new Date(req.body.issue_date) <= new Date(car.booked_status[i].return_date)) &&
                !(new Date(req.body.return_date) >= new Date(car.booked_status[i].issue_date)
                  && new Date(req.body.return_date) <= new Date(car.booked_status[i].return_date)) &&
                !(new Date(req.body.issue_date) <= new Date(car.booked_status[i].issue_date)
                  && new Date(req.body.return_date) >= new Date(car.booked_status[i].issue_date))) {
                    continue;
              } else {
                return res.status(400).json({ error: "Sorry, the car wont be available on the given date, it is already booked for the given time." });
              }
            }

            // add the new booking
            var booked_status = {
              booked: true,
              customer_name: req.body.customer_name,
              customer_contact_no: req.body.customer_contact_no,
              issue_date: req.body.issue_date,
              return_date: req.body.return_date
            }
            if(car.booked_status.length == 0) {
              car.booked_status = [booked_status];
            } else {
              car.booked_status = [...car.booked_status, booked_status]
            }
            car.save().then(car => res.status(201).json({ message : "Car booked successfully" }))
                       .catch(err => res.status(500).json({ message: "Cannot book car.", err }));
          }
        } else {
          return res.status(400).json({ error: "Incomplete booking request, please enter all necessary details." });
        }
    }
  });
});

module.exports = router;
