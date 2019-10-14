const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// vehicle number, model, seating capacity, rent per day
// Booking status of these cars include the customer details, issue date and return date of the car.

const BookedStatusSchema = new Schema({
  customer_name: String,
  customer_contact_no: String,
  issue_date: Date,
  return_date: Date
});

const CarSchema = new Schema({
  vehicle_no: {
    type: String,
    required: true
  },
  model: {
    type: String,
    required: true
  },
  seating_capacity: {
    type: Number,
    required: true
  },
  rent_per_day: {
    type: Number,
    required: true
  },
  booked_status: [BookedStatusSchema]
});

module.exports = Car = mongoose.model('car', CarSchema);
