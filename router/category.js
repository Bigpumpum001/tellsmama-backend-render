const express = require('express')
const router = express.Router()
const Category = require('../model/Category')

router.post('/', async (req, res) => {
    const { name, icon } = req.body;
    if (!name || !icon) {
        return res.status(400).json({ message: 'Category name and icon are required.' })
    }
    try {


        const exists = await Category.findOne({ name })

        if (exists) {
            return res.status(400).json({ message: 'Category name already exists' })
        }

        const category = new Category({
            name, icon
            // : icon || 'bi-box' 
            , subCategories: []
        })
        await category.save()
        res.status(201).json({ message: 'Category created', category })
    }
    catch (error) {
        console.error('Error adding category:', error);
        res.status(500).json({ message: 'Error', error: error.message })
    }
})

router.get('/', async (req, res) => {
    try {
        const categories = await Category.find()
        res.status(200).json(categories)
    }
    catch (error) {
        console.error('Error fetching  category:', error);
        res.status(500).json({ message: 'Error fetching categories', error: error.message })
    }
})

// POST /api/category/:categoryId/subcategory
router.post(('/:categoryId/subcategory'), async (req, res) => {
// router.post(('/:categoryId/subcategory'), async (req, res) => {
    const { categoryId } = req.params
    const { name, icon } = req.body
    // if (categoryId ){
    //     console.log('qwf')
    // }
    // if(!categoryId ){
    //     console.log('dqw')
    // }
    try {
        const category = await Category.findById(categoryId)
        if(!category){
            return res.status(404).json({message:'Category not found.'})
        }
        const isDuplicate = category.subCategories.some(
            (sub)=> sub.name.toLowerCase() === name.toLowerCase()
        )
        if (isDuplicate) {
            return res.status(400).json({ message: 'Subcategory name already exists.' });
        }
        const updatedCategory = await Category.findByIdAndUpdate(
            categoryId,
            {
                $push: {
                    subCategories: {
                        name: name, icon: icon
                    }
                }
            },
            { new: true, runValidators: true }
        )
        if (updatedCategory) {
            res.status(200).json({
                message: 'Subcategory added successfully!',
                category: updatedCategory
            })
            // res.redirect('/addcategory');
        }
        else {
            res.status(404).send('Category not found.');
        }
    }
    catch (error) {
        console.error('Error adding subcategory:', error);
        res.status(500).json({ message: 'Error adding subcategories', error: error.message })

    }
})

// สมมติว่าคุณมี Category Model ที่เชื่อมต่อกับ MongoDB แล้ว
// router.post('/admin/add-subcategory', async (req, res) => {
//     const { categoryId, subCategoryName, subCategoryIcon } = req.body; // สมมติว่าส่ง categoryId มาด้วย

//     try {
//         // 1. ค้นหา Category จากฐานข้อมูลด้วย ID
//         const categoryToUpdate = await Category.findById(categoryId);

//         if (categoryToUpdate) {
//             // 2. เพิ่ม subcategory ใหม่เข้าไปในอาร์เรย์ subCategories ของ Object ที่ดึงมา
//             categoryToUpdate.subCategories.push({
//                 name: subCategoryName,
//                 icon: subCategoryIcon
//             });

//             // 3. บันทึกการเปลี่ยนแปลงกลับไปยังฐานข้อมูล
//             await categoryToUpdate.save();

//             res.redirect('/admin/add-subcategory');
//         } else {
//             res.status(404).send('Category not found.');
//         }
//     } catch (error) {
//         console.error('Error adding subcategory:', error);
//         res.status(500).send('Server Error.');
//     }
// });



// PUT Update Category (handleSaveCategory)
router.put('/:id', async (req, res) => {
    try {
        const { name, icon } = req.body;
        const updatedCategory = await Category.findByIdAndUpdate(
            req.params.id,
            { name, icon },
            { new: true } // คืนค่าเอกสารที่อัปเดตแล้ว
        );
        if (!updatedCategory) {
            return res.status(404).json({ message: 'Category not found' });
        }
        res.json(updatedCategory);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// DELETE Category (handleDeleteCategory)
router.delete('/:id', async (req, res) => {
    try {
        const categoryId = req.params.id;
        const deletedCategory = await Category.findByIdAndDelete(categoryId);

        if (!deletedCategory) {
            return res.status(404).json({ message: 'Category not found' });
        }

        // Optional: ลบสินค้าที่เชื่อมโยงกับ Category นี้ด้วย (ถ้าจำเป็น)
        // await Product.deleteMany({ category: categoryId });

        res.json({ message: 'Category and its subcategories deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// PUT Update SubCategory (handleSaveSubCategory)
router.put('/:categoryId/subcategories/:subCategoryId', async (req, res) => {
    try {
        const { categoryId, subCategoryId } = req.params;
        const { name, icon } = req.body;

        const category = await Category.findById(categoryId);
        if (!category) {
            return res.status(404).json({ message: 'Category not found' });
        }

        const subCategory = category.subCategories.id(subCategoryId);
        if (!subCategory) {
            return res.status(404).json({ message: 'SubCategory not found' });
        }

        subCategory.name = name;
        subCategory.icon = icon;
        await category.save();
        res.json(subCategory);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// DELETE SubCategory (handleDeleteSubCategory)
router.delete('/:categoryId/subcategories/:subCategoryId', async (req, res) => {
    try {
        const { categoryId, subCategoryId } = req.params;

        const category = await Category.findById(categoryId);
        if (!category) {
            return res.status(404).json({ message: 'Category not found' });
        }

        // ลบ subcategory โดยใช้ pull
        category.subCategories.pull({ _id: subCategoryId });
        await category.save();

        res.json({ message: 'SubCategory deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});



module.exports = router