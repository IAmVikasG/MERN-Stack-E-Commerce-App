const express = require('express');
require('dotenv').config();
const mongoose = require('mongoose');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const expressValidator = require('express-validator');
const cors = require("cors");


const app = express();

// Custom imports file
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const categoryRoutes = require('./routes/category');
const productRoutes = require('./routes/product');
const braintreeRoutes = require("./routes/braintree");
const orderRoutes = require("./routes/order");


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
app.use(expressValidator());
app.use(cors());


// Routes
app.use('/api', authRoutes);
app.use('/api', userRoutes);
app.use('/api', categoryRoutes);
app.use('/api', productRoutes);
app.use("/api", braintreeRoutes);
app.use("/api", orderRoutes);


const port = process.env.PORT || 8000;

app.listen(port, () =>
{
    console.log(`Server is running at ${port}`);
})
