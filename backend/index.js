const express = require('express');
var mongoose = require('mongoose');
const cors = require('cors');
const { routes } = require('../backend/App/routes/web/userRoutes.js');
require('dotenv').config();

const app = express();

app.use(express.json());   // for parsing json data
app.use(cors());           // to allow cross-origin requests

app.use('/web/api', routes);

// it is the connectivity of mongoose with the database
mongoose.connect(process.env.dbURL)     // it is a kind of promise so we can use .then() and .catch() methods
.then(() => {
    console.log('Connected to MongoDB...')
    app.listen(process.env.PORT);
}).catch(
    (err) => console.error('Error:', err)
);