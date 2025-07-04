const mongoose = require('mongoose')
// const { default: Categories } = require('../../frontend/cashier-project/src/components/Categories-backup')
const subCategorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },

    icon: {
        type: String,
        required: true
    }
})

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },

    icon: {
        type: String,
        required: true
    },
    subCategories: [subCategorySchema]



}, { timestamps: true })




module.exports = mongoose.model("Category", categorySchema, 'Category')