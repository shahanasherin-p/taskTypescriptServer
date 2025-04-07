const users=require('../models/userModel')
const jwt=require('jsonwebtoken')
const axios = require('axios');
const { oauth2Client } = require('../middleware/googleAuthMiddleware');


// register

exports.registerController=async(req,res)=>{
    console.log("Inside Register Controller")
    console.log(req.body)
    const {username,email,password,role}=req.body

    try{
        const existingUser=await users.findOne({email})
        if(existingUser){
            res.status(406).json("Already existing user.. Please Login")
        }else{
            const newUser= new users({username,email,password,role: role || "User",})
            await newUser.save()
            res.status(200).json(newUser)
        }

    }catch(err){
        res.status(401).json(err)
    }

}

// login

exports.loginController=async(req,res)=>{
    console.log("Inside loginController")
    const {email,password}=req.body
    console.log(email,password)
    try{
        const existingUser=await users.findOne({email,password})
        if(existingUser){
            // token generation
            const token=jwt.sign({userId:existingUser._id},process.env.JWT_SECRET_KEY)
            res.status(200).json({user:existingUser,token})
        }else{
            res.status(404).json("Incorrect Email/Password")
        }
    }catch(err){
        res.status(401).json(err)
    }
}


// profile updation
exports.editUserController=async(req,res)=>{
    console.log("Inside editUserController")
    const {username,email,password,profileImage}=req.body
    const uploadProfilePic=req.file?req.file.filename:profileImage
    const userId=req.userId
    try{
        const updateUser=await users.findByIdAndUpdate({_id:userId},{username,email,password,profileImage:uploadProfilePic},{new:true})
        await updateUser.save()
        res.status(200).json(updateUser)
    }
    catch(err){
        res.status(401).json(err)
    }
}



// get all users

exports.getAllUsersController=async(req,res)=>{
    console.log("Inside getAllUsersController")
    try{
        const allUsers=await users.find({"role":"User"})
        res.status(200).json(allUsers)
    }catch(err){
        res.status(401).json(err)
    }
}

// delete a user 
exports.deleteUser = async (req, res) => {
    console.log("Inside deleteUser");

    try {
        const deletedUser = await users.findByIdAndDelete(req.params.id);
        if (!deletedUser) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
        console.error("Error deleting user:", error);
        res.status(500).json({ message: "Error deleting user", error: error.message });
    }
};