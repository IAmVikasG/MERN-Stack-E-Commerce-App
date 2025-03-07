const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;

const productSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            trim: true,
            required: true,
            maxlength: 32
        },
        description: {
            type: String,
            required: true,
            maxlength: 2000
        },
        price: {
            type: Number,
            trim: true,
            required: true,
            maxlength: 32
        },
        category: {
            type: ObjectId,
            ref: "Category",
            required: true
        },
        quantity: {
            type: Number
        },
        sold: {
            type: Number,
            default: 0
        },
        photo: {
            data: Buffer,
            contentType: String
        },
        shipping: {
            required: false,
            type: Boolean
        }
    },
    { timestamps: true }
);

// Create a virtual field 'id' that maps to '_id'
productSchema.virtual('id').get(function ()
{
    return this._id.toHexString();
});

// Ensure virtual fields are serialized in the output
productSchema.set('toJSON', {
    virtuals: true,
});
productSchema.set('toObject', {
    virtuals: true,
});

module.exports = mongoose.model("Product", productSchema);
