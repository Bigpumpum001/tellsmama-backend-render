const mongoose = require("mongoose")

const UserSchema = new mongoose.Schema({
    username:{
        type:String,
        require:true
    },
    email:{
        type:String,
        require:true,
        unique:true
    },
    password:{
        type:String,
        require:true
    },
    isAdmin: {
        type: Boolean,
        default: false // ค่าเริ่มต้นเป็น false
    },
})

module.exports = mongoose.model('User', UserSchema)