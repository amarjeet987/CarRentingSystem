const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const config = require('config');
const app = express()

app.use(cors());

// bodyparser middleware
app.use(express.json());

// dbconfig
const db = config.get('mongoURI');

// connect to mongodb
mongoose.connect(db, { useNewUrlParser: true, useUnifiedTopology: true })
.then(() => console.log("MongoDB connected"))
.catch(err => console.log(err));

// api routes
app.use('/api/car', require('./routes/api/crud'));
app.use('/api/users', require('./routes/api/newUser'));
app.use('/api/auth', require('./routes/api/auth'));
app.use('/api/book', require('./routes/api/booking'));
app.use('/api/test', require('./routes/api/test'));

// server port
const port = process.env.PORT;

app.listen(port, () => {
  console.log(`Server running on port ${port}`)
});
