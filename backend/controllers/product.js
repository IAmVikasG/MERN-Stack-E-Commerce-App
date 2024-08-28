const formidable = require("formidable");
const _ = require("lodash");
const fs = require("fs");
const path = require("path");
const Product = require("../models/product");
const { errorHandler } = require("../helpers/dbErrorHandler");

exports.productById = (req, res, next, id) =>
{
    Product.findById(id).exec((err, product) =>
    {
        if (err || !product)
        {
            return res.status(400).json({
                error: "Product not found"
            });
        }

        req.product = product;
        next();
    });
};

exports.read = (req, res) =>
{
    req.product.photo = undefined; // Because it will take time.
    return res.json(req.product);
};

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

exports.remove = (req, res) =>
{
    let product = req.product;
    product.remove((err, deletedProduct) =>
    {
        if (err)
        {
            return res.status(400).json({
                error: errorHandler(err)
            });
        }
        res.json({
            message: "Product deleted successfully"
        });
    });
};

exports.update = (req, res) =>
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

        // Find the product by ID
        Product.findById(req.params.productId, (err, product) =>
        {
            if (err || !product)
            {
                return res.status(400).json({
                    error: "Product not found",
                });
            }

            // Update product fields
            product = _.extend(product, fields);

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

                    // Update the file information in the product object
                    product.photo.data = fs.readFileSync(newFilePath);
                    product.photo.contentType = files.photo.type;
                } catch (fileError)
                {
                    return res.status(500).json({
                        error: "Error saving the file",
                    });
                }
            }

            // Save the updated product to the database
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
    });
};

/**
 * sell / arrival
 * by sell = /products?sortBy=sold&order=desc&limit=4
 * by arrival = /products?sortBy=createdAt&order=desc&limit=4
 * if no params are sent, then all products are returned
 */

exports.list = (req, res) =>
{
    let order = req.query.order ? req.query.order : "asc";
    let sortBy = req.query.sortBy ? req.query.sortBy : "_id";
    let limit = req.query.limit ? parseInt(req.query.limit) : 6;

    Product.find()
        .select("-photo")
        .populate("category")
        .sort([[sortBy, order]])
        .limit(limit)
        .exec((err, products) =>
        {
            if (err)
            {
                return res.status(400).json({
                    error: "Products not found"
                });
            }
            res.json(products);
        });
};

/**
 * it will find the products based on the req product category
 * other products that has the same category, will be returned
 */

exports.listRelated = (req, res) =>
{
    let limit = req.query.limit ? parseInt(req.query.limit) : 6;

    Product.find({ _id: { $ne: req.product }, category: req.product.category })
        .limit(limit)
        .populate("category", "_id name")
        .exec((err, products) =>
        {
            if (err)
            {
                return res.status(400).json({
                    error: "Products not found"
                });
            }
            res.json(products);
        });
};

exports.listCategories = (req, res) =>
{
    Product.distinct("category", {}, (err, categories) =>
    {
        if (err)
        {
            return res.status(400).json({
                error: "Categories not found"
            });
        }
        res.json(categories);
    });
};

/**
 * list products by search
 * we will implement product search in react frontend
 * we will show categories in checkbox and price range in radio buttons
 * as the user clicks on those checkbox and radio buttons
 * we will make api request and show the products to users based on what he wants
 */

exports.listBySearch = (req, res) =>
{
    let order = req.body.order ? req.body.order : "desc";
    let sortBy = req.body.sortBy ? req.body.sortBy : "_id";
    let limit = req.body.limit ? parseInt(req.body.limit) : 100;
    let skip = parseInt(req.body.skip);
    let findArgs = {};

    // console.log(order, sortBy, limit, skip, req.body.filters);
    // console.log("findArgs", findArgs);

    for (let key in req.body.filters)
    {
        if (req.body.filters[key].length > 0)
        {
            if (key === "price")
            {
                // gte -  greater than price [0-10]
                // lte - less than
                findArgs[key] = {
                    $gte: req.body.filters[key][0],
                    $lte: req.body.filters[key][1]
                };
            } else
            {
                findArgs[key] = req.body.filters[key];
            }
        }
    }

    Product.find(findArgs)
        .select("-photo")
        .populate("category")
        .sort([[sortBy, order]])
        .skip(skip)
        .limit(limit)
        .exec((err, data) =>
        {
            if (err)
            {
                return res.status(400).json({
                    error: "Products not found"
                });
            }
            res.json({
                size: data.length,
                data
            });
        });
};

exports.photo = (req, res, next) =>
{
    if (req.product.photo.data)
    {
        res.set("Content-Type", req.product.photo.contentType);
        return res.send(req.product.photo.data);
    }
    next();
};

exports.listSearch = (req, res) =>
{
    // create query object to hold search value and category value
    const query = {};
    // assign search value to query.name
    if (req.query.search)
    {
        query.name = { $regex: req.query.search, $options: "i" };
        // assigne category value to query.category
        if (req.query.category && req.query.category != "All")
        {
            query.category = req.query.category;
        }
        // find the product based on query object with 2 properties
        // search and category
        Product.find(query, (err, products) =>
        {
            if (err)
            {
                return res.status(400).json({
                    error: errorHandler(err)
                });
            }
            res.json(products);
        }).select("-photo");
    }
};
