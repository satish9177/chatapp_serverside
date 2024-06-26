const User = require("../models/User")
const verifytoken = require("../verifytoken/verifytoken")

const userdetails=async(req,res)=>{
  try {
    // console.log(req.cookies)
     const token=req.cookies.token || ""
    //  console.log(token)
     const verify=await verifytoken(token)
    //  console.log(verify)
       return res.status(200).json({userdata:verify})
  } catch (error) {
    res.status(500).json({
      message:error.message || error,
      error:true
    })
  }
}
const updateuserdetails=async(req,res)=>{
  try {
    const token=req.cookies.token || ""
    const verify=await verifytoken(token)
    const {username,profile_pic,email,password}=req.body;
    const updated=await User.findByIdAndUpdate({_id:verify._id},{username,profile_pic,email,password});
   const user=await User.findById(verify._id)
   res.status(200).json({
    message:'successfully updated',
    user
   })
    
  } catch (error) {
    res.status(500).json({
      message:error.message || error,
      error:true
    })
  }
}
module.exports={userdetails,updateuserdetails}