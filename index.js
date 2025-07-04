const mongoose = require('mongoose') //mongoose
const express = require('express') // restful api เส้นทางรับส่งข้อมูล
const cors = require('cors') // เปิดให้ frontend เรียก api จาก server ได้
require('dotenv').config()

const app = express()

const allowedOrigins = [
    'http://localhost:3000', // สำหรับการพัฒนา Frontend บนเครื่อง local ของคุณ
    'http://localhost:5173', // พอร์ต default ของ Vite dev server (ถ้าใช้)
    'https://tellsmama.netlify.app', // <-- **นี่คือ URL ของ Frontend ที่ Deploy บน Netlify**
    // เพิ่ม URL อื่นๆ ที่คุณต้องการอนุญาต เช่น Custom Domain ของคุณ
    // 'https://www.your-custom-frontend-domain.com'
];

const corsOptions = {
    origin: function (origin, callback) {
        // ตรวจสอบว่า origin ที่เข้ามาอยู่ในรายการที่อนุญาตหรือไม่
        // หรือถ้าเป็นการเรียกจากแหล่งที่ไม่มี origin (เช่น REST client, mobile app) ก็อนุญาต
        if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // อนุญาต Method ที่จำเป็น
    credentials: true, // อนุญาตให้ส่ง cookies, authorization headers ได้
    optionsSuccessStatus: 200 // สำหรับ preflight requests
};

//Routes
const authRoutes = require("./router/auth")
const protectedRoutes = require('./router/protected')
const productRoutes = require('./router/product')
const categoryRoutes = require('./router/category')
const uploadRouter = require('./router/upload')

app.use('/uploads', express.static('uploads')) // เผื่อ dev local image


// Middleware
app.use(cors(corsOptions))
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