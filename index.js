const mongoose = require('mongoose') //mongoose
const express = require('express') // restful api เส้นทางรับส่งข้อมูล
const cors = require('cors') // เปิดให้ frontend เรียก api จาก server ได้
require('dotenv').config()

const app = express()

//Routes
const authRoutes = require("./router/auth")
const protectedRoutes = require('./router/protected')
const productRoutes = require('./router/product')
const categoryRoutes = require('./router/category')
const uploadRouter = require('./router/upload')

app.use('/uploads', express.static('uploads')) // เผื่อ dev local image


// Middleware
app.use(cors())
app.use(express.json())

mongoose.connect(process.env.MONGO_URI)

app.use('/api/auth', authRoutes)
app.use('/api', protectedRoutes)
app.use('/api/product', productRoutes)
app.use('/api/category', categoryRoutes)
app.use('/api/upload', uploadRouter)

// test
app.get('/', (req, res) => {
    res.send('Welcome to the API!');
});


const port = process.env.PORT || 5000

app.listen((port), () => {
    console.log(`Server running on port ${port}`)
})