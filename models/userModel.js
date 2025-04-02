const mongoose=require('mongoose')

const userSchema=new mongoose.Schema({
    username:{
        type:String,
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required: function () {
            return !this.googleId;
        },    
    },
    googleId: { type: String, default: null },
    profileImage: {
        type: String,
        default: ''
    },

})

const users=mongoose.model("users",userSchema)

module.exports=users