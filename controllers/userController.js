const users=require('../models/userModel')
const jwt=require('jsonwebtoken')
const axios = require('axios');
const { oauth2Client } = require('../middleware/googleAuthMiddleware');


// register

exports.registerController=async(req,res)=>{
    console.log("Inside Register Controller")
    console.log(req.body)
    const {username,email,password}=req.body

    try{
        const existingUser=await users.findOne({email})
        if(existingUser){
            res.status(406).json("Already existing user.. Please Login")
        }else{
            const newUser= new users({username,email,password})
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
            const token=jwt.sign({userId:existingUser._id},process.env.JWTPASSWORD)
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



// exports.googleAuthCallback = async (req, res) => {
//     console.log("🚀 Google Auth Callback triggered");
//     console.log("Received user from Google:", req.user);
    
//     if (!req.user) {
//       console.error("❌ Google authentication failed.");
//       return res.status(401).json({ message: "Google authentication failed" });
//     }
    
//     const googleUser = req.user;
//     console.log("✅ Extracted Google User:", googleUser);
    
//     try {
//       // Find existing user or create a new one
//       let user = await users.findOne({ email: googleUser.email });
      
//       if (!user) {
//         user = new users({
//           username: googleUser.displayName,
//           email: googleUser.email,
//           googleId: googleUser.id,
//           profileImage: googleUser.photos?.[0]?.value || "",
//         });
        
//         await user.save();
//         console.log("🆕 New user created:", user);
//       }
      
//       console.log("🔍 User found or created:", user);
      
//       // Check if JWT secret is available
//       const jwtSecret = process.env.JWT_SECRET_KEY || process.env.JWT_SECRET;
      
//       if (!jwtSecret) {
//         console.error("❌ JWT secret is missing");
//         return res.status(500).json({ message: "Server error" });
//       }
      
//       // Generate authentication token
//       const token = jwt.sign(
//         { id: user._id, username: user.username, email: user.email },
//         jwtSecret,
//         { expiresIn: "1h" }
//       );
      
//       console.log("🔑 Generated Token:", token);
      
//       // Redirect to frontend with token
//       res.redirect(`${process.env.FRONTEND_URL}/auth-success?token=${token}`);
//     } catch (error) {
//       console.error("⚠️ Error in Google Auth Callback:", error);
//       res.status(500).json({ message: "Authentication process failed", error: error.message });
//     }
// };