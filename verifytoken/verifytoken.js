const jwt=require('jsonwebtoken')
const User=require('../models/User')
const SECRETKEY=process.env.SECRETKEY
const verifytoken=async(token)=>{
   
    if(!token){
      return {
        message:'session out',
        logout:true
      }
    }
      const check= await jwt.verify(token,SECRETKEY)
      // console.log(check)
    const user=await User.findById(check.userId).select('-password')
    // console.log(user)
      return user
  
}
module.exports=verifytoken