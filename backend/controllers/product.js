const formidable = require("formidable");
const _ = require("lodash");
const fs = require("fs");
const path = require("path");
const Product = require("../models/product");
const { errorHandler } = require("../helpers/dbErrorHandler");

exports.create = (req, res) =>
{
    let form = new formidable.IncomingForm();
    form.keepExtensions = true;

    form.parse(req, (err, fields, files) =>
    {
        if (err)
        {
            return res.status(400).json({
                error: "Image could not be uploaded",
            });
        }

        // Log the files object to check its structure
        console.log(files);

        // check for all fields
        const {
            name,
            description,
            price,
            category,
            quantity,
            shipping
        } = fields;

        if (
            !name ||
            !description ||
            !price ||
            !category ||
            !quantity ||
            !shipping
        )
        {
            return res.status(400).json({
                error: "All fields are required"
            });
        }

        let product = new Product(fields);

        if (files.photo)
        {
            // Check if the file path exists
            if (!files.photo.path)
            {
                return res.status(400).json({
                    error: "Filepath is undefined",
                });
            }

            // Check the file size
            // 1kb = 1000
            // 1mb = 1000000
            if (files.photo.size > 1000000)
            {
                return res.status(400).json({
                    error: "Image should be less than 1mb in size",
                });
            }

            // Define the upload directory
            const uploadDir = path.join(__dirname, "../uploads");

            // Check if directory exists, if not, create it
            if (!fs.existsSync(uploadDir))
            {
                fs.mkdirSync(uploadDir, { recursive: true });
            }

            // Create a new file name and path for the uploaded file
            const newFilePath = path.join(uploadDir, files.photo.name);

            try
            {
                // Move the file to the uploads directory
                fs.renameSync(files.photo.path, newFilePath);

                // Save the file information in the product object
                product.photo.data = fs.readFileSync(newFilePath);
                product.photo.contentType = files.photo.type;
            } catch (fileError)
            {
                return res.status(500).json({
                    error: "Error saving the file",
                });
            }
        }

        // Save the product to the database
        product.save((err, result) =>
        {
            if (err)
            {
                return res.status(400).json({
                    error: errorHandler(err),
                });
            }
            res.json(result);
        });
    });
};
