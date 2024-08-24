const express = require('express');
require("dotenv").config();
const mongoose = require('mongoose');

const app = express();


// Database connection
main().catch(err => console.log(err));

async function main()
{
    await mongoose.connect('mongodb://127.0.0.1:27017/mern_ecommerce');

    // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
}


app.get("/", (req, res) =>
{
    res.send("hello world");
});

const port = process.env.PORT || 8000;

app.listen(port, () =>
{
    console.log(`Server is running at ${port}`);
})
