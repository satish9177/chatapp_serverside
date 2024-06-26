const User=require('../models/User')
const bcrypt=require('bcrypt')
const jwt=require('jsonwebtoken')
const dotenv=require('dotenv')
dotenv.config();
const KEY=process.env.SECRETKEY
const register=async(req,res)=>{
  try {
    // console.log("-1",req.body)
    const {username,email,password,profile_pic}=req.body
    const check=await User.findOne({email:email})
    // console.log(check)
    if(check){
      return res.status(400).json(
        {
          message:'email is already exiting',
         }
      )
    }
    const hash=await bcrypt.genSalt(10)
    const hashpassword=await bcrypt.hash(password,hash)
    const user=await User({username,email,password:hashpassword,profile_pic})
    const data=await user.save();
    
    res.status(201).json({message:'successfully registrated',success:true,data})
  } catch (error) {
    res.status(500).json({
      message:error.message || error,
      error:true
    })
  }
}
const Login=async(req,res)=>{
  try {
     const {email}=req.body
     const check=await User.findOne({email}).select('-password')
     if(!check){
      return res.status(400).json({
        message:'user not  exited',
      })
     }
    
     res.status(200).json({
      message:"email is existing",
      success:true,
      check
     })

  } catch (error) {
    res.status(500).json({
      message:error.message || error,
      error:true
    })
  }
}
const password=async(req,res)=>{
  try {
    const {userId,password}=req.body
    const user=await User.findById(userId)
    if(!user){
      return res.status(400).json({
        message:'user not found'
      })
    }
    const verifypassword=await bcrypt.compare(password,user.password)
    // console.log(password,user.password)
    if(!verifypassword){
      return res.status(400).json({
        message:'wrong password',
        error:true
      })
    }
    const senddata={
      userId:user._id,
      email:user.email
    }
    const token=await jwt.sign(senddata,KEY,{expiresIn:'1d'})
    const cookieopt={
      http:true,
      secure:true
    }
    res.status(200).cookie('token',token,cookieopt).json({
      message:'login successfully',
       token
    })
  } catch (error) {
    res.status(500).json({
      message:error.message || error,
      error:true
    })
  }
}
const logout=async (req,res)=>{
  const {email}=req.body
  const check=await User.findOne({email})
  if(!check){
    return res.status(400).json({
      message:"email is not login"
    })
  }
  const cookieopt={
    http:true,
    secure:true
  }
  res.status(200).cookie('token','',cookieopt).json({
    message:'logged out successfully'
  })
}

module.exports={register,Login,password,logout}