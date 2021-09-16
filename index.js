const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const mongoose = require('mongoose');
const fileUpload = require('express-fileupload');

const app = express();

//environment variables

require('dotenv').config();

//database connections
mongoose.connect(process.env.API_URL)
  .then(() => console.log("Connected to DB"))
  .catch(() => console.log("Error connecting to Mongo"));

//middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(fileUpload({
  useTempFiles: true,
  tempFileDir: '/tmp/',
  createParentPath: true
}));
app.use(morgan('dev'));

//routes 
app.use('/api/auth', require('./routes/auth'));
app.use('/api/positions', require('./routes/position'));
app.use('/api/techniques', require('./routes/technique'))

//listen to server in a port
const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log("Server running...")
})