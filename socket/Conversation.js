const {Conversation,Message}=require('../models/Conversation')
const Sidebar=async(userId)=>{
  console.log(userId)
  if(userId){
    const conversation=await Conversation.find({
      '$or':[
        {sender:userId},
        {receiver:userId}
      ]
    }).populate('message').populate('sender').populate('receiver').sort({updatedAt:-1})
    // console.log(conversation)
    const convers=conversation.map((con)=>{
       const countunseenmsg=con.message.reduce((prev,curr)=>{
              
        return prev+ (curr?.seen ?1:0);
       },0)
       return {
        _id:con._id,
        sender:con.sender,
        receiver:con.receiver,
        unseen:countunseenmsg,
        lastmessage:con.message[con.message?.length-1]
       }
    })
    // console.log("convers:",convers)
  return convers
  } 
  return [];
}
module.exports=Sidebar