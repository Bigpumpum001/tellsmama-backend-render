const express = require('express')
const multer = require('multer')
const fs = require('fs')
const cloudinary = require('../cloudinary')


const router = express.Router()

// keep in temp folder
const upload = multer({ dest: 'uploads/' })

router.get('/', (req, res) => {
    res.send('Upload route is working!')
})

router.post('/', upload.single('image'), async (req, res) => {
    console.log('req.file:', req.file)

    try {
        const result = await cloudinary.uploader.upload(req.file.path, {
            folder: 'products',//folder in cloudinary
            width: 300,
            height: 300,
            crop: 'fit' // fill, fit , scale , limit crop: 'fill' จะ ตัดส่วนเกิน เพื่อให้ขนาดพอดี, ส่วน crop: 'fit' จะ ย่อให้พอดีโดยไม่ตัดภาพ
        })
        //delete file local
        try {
            fs.unlinkSync(req.file.path)
            res.json({ imageUrl: result.secure_url })
        }
        catch (unlinkErr) {
            console.error('Failed to delete temp file:', unlinkErr)
        }


    }
    catch (err) {
        res.status(500).json({ message: 'Upload failed', error: err.message })
    }
})
module.exports = router