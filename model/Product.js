const mongoose = require('mongoose')
// const { default: Categories } = require('../../frontend/cashier-project/src/components/Categories-backup')

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    category: {
        type: String,
        // required: true
    },
    subCategory: {
        type: String,
        // required: true
    },
    imageUrl: {
        type: String,
        required: true
    },
    created_by:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    createdAt:{
        type:Date,
        default:Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now 
    }

}, { timestamps: true })

module.exports = mongoose.model("Product", productSchema)