const express = require('express');
require("dotenv").config();
const mongoose = require('mongoose');
const morgan = require("morgan");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");


const app = express();

// Custom imports file
const userRoutes = require('./routes/user');

// Database connection
main().catch(err => console.log(err));

async function main()
{
    await mongoose.connect(process.env.MONGO_URI);

    // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
}

// middlewares
app.use(morgan("dev"));
app.use(bodyParser.json());
app.use(cookieParser());

// Routes
app.use('/api', userRoutes);

const port = process.env.PORT || 8000;

app.listen(port, () =>
{
    console.log(`Server is running at ${port}`);
})
