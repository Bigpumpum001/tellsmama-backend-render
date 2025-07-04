const express = require('express')
const router = express.Router()
const Product = require('../model/Product')
const { default: mongoose } = require('mongoose')

router.post('/', async (req, res) => {
    console.log('REQ BODY:', req.body)
    try {
        const { name, price, category, subCategory, imageUrl, created_by } = req.body
        // if (!created_by) {
        //     return res.status(400).json({ message: 'User ID (created_by) is required.' });
        // }
        if (!name || !price || !imageUrl
            //  || !created_by
        ) {
            return res.status(400).json({ message: 'Please provide name, price, imageUrl' });
        }
        if (isNaN(price) || price < 0) {
            return res.status(400).json({ message: 'Price must be a non-negative number.' });
        }
        //  if (!mongoose.Types.ObjectId.isValid(created_by)) {
        //     return res.status(400).json({ message: 'Invalid created_by ID format.' });
        // }
        //  const userExists = await User.findById(created_by);
        // if (!userExists) {
        //     return res.status(404).json({ message: 'Creator (User ID) not found.' });
        // }
        const product = new Product({ name, price, category, subCategory, imageUrl, created_by })
        await product.save()
        res.status(201).json({ message: 'Product added successfull', product });
    }
    catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message })
    }
})

router.get('/', async (req, res) => {
    try {
        // const products = await Product.findOne({})
        const products = await Product.find().populate('created_by', 'username email');
        res.status(200).json(products)
    }
    catch (error) {
        console.error('Error fetching  product:', error);
        res.status(500).json({ message: 'Error fetching products', error: error.message })
    }
})
//Get UserProduct
// @desc    Get all products or products by user getProductById 
router.get('/:id', async (req, res) => {
    try {
        let products
        const { id } = req.params
        if (id) {
            if (!mongoose.Types.ObjectId.isValid(id)) {
                return res.status(400).json({ message: 'Invalid User ID format.' })
            }
            products = await Product.find({ created_by: id }).populate('created_by', 'username email')
        }
        else {
            products = await Product.find().populate('created_by', 'username email')
        }

        res.status(200).json(products)
    }
    catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({ message: 'Failed to fetch products', error: error.message });
    }
})

// @desc    Get single product by ID
router.get('/user/:userId', async (req, res) => {
    try {
        const { userId  } = req.params

        if (!mongoose.Types.ObjectId.isValid(userId )) {
            return res.status(400).json({ message: 'Invalid Product ID format.' })
        }
        // const product = await Product.findById(userId ).populate('created_by', 'username email');
        const product = await Product.find({ created_by: userId }).populate('created_by', 'username email');
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        res.status(200).json(product)
    }
    catch (error) {
        console.error('Error fetching product by ID:', error);
        res.status(500).json({ message: 'Failed to fetch product', error: error.message });
    }
})
// PUT Update Product (handleSaveProduct)
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { name, price, category, subCategory } = req.body;
        const product = await Product.findById(id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' });
        }

        const updateFields = {};
        if (name !== undefined) updateFields.name = name;
        if (price !== undefined) {
            if (isNaN(price) || price < 0) {
                return res.status(400).json({ message: 'Price must be a non-negative number.' });
            }
            updateFields.price = price;
        }
        if (category !== undefined) updateFields.category = category;
        if (subCategory !== undefined) updateFields.subCategory = subCategory;
        if (Object.keys(updateFields).length === 0) {
            return res.status(400).json({ message: 'No fields to update provided.' });
        }
        const updatedProduct = await Product.findByIdAndUpdate(
            id,
            {$set:updateFields},
            // { name, price, category, subCategory },
            { new: true, runValidators: true }
        );
        // if (!updatedProduct) {
        //     return res.status(404).json({ message: 'Product not found' });
        // }
        res.json(updatedProduct);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// DELETE Product (handleDeleteProduct)
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const product = await Product.findById(id);

        const deletedProduct = await Product.findByIdAndDelete(id);
        if (!deletedProduct) {
            return res.status(404).json({ message: 'Product not found' });
        }
        res.json({ message: 'Product deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});



module.exports = router
