const express = require("express")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const User = require("../model/User")
const router = express.Router();

router.post('/register', async (req, res) => {
    const { username, email, password } = req.body;

    try {
        const lowercasedUsername = username.toLowerCase(); 
        const existingUser = await User.findOne({username:lowercasedUsername})
        if(existingUser){
            return res.status(400).json({error : "Existing User"})
        }
        const hashPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ 
            username:lowercasedUsername, 
            email,
             password: hashPassword })
        await newUser.save();
        res.status(201).json({ message: 'User registered successfully!' })
    }
    catch (error) {
        res.status(500).json({ error: error.message })
    }
})

router.post('/login', async (req, res) => {
    const { username, email, password } = req.body;
    try {
        const lowercasedUsername = username.toLowerCase()
        const user = await User.findOne({ username: lowercasedUsername })
        if (!user) return res.status(400).json({ error: 'Invalid credentails' })

        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) return res.status(400).json({ error: 'Invalid credentials' })

        const token = jwt.sign({ userId: user._id, isAdmin: user.isAdmin }, process.env.JWT_SECRET, { expiresIn: '1h' })

        res.json({ token, isAdmin: user.isAdmin })
    }
    catch (error) {
        res.status(500).json({ error: error.message })
    }
})

module.exports = router;