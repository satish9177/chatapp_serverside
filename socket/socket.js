const express=require('express')
const {Server}=require('socket.io')
const verifytoken=require('../verifytoken/verifytoken')
const http=require('http')
const User = require('../models/User')
const app=express()
const server=http.createServer(app);
const {Conversation,Message}=require('../models/Conversation')
const io=new Server(server,{
   cors: {origin : process.env.FRONTEND_URL,
    credentials : true}
})
const onlineusers=new Set();
io.on('connection',async (socket)=>{
  console.log('socket id',socket.id);
  const token=socket.handshake.auth.token;
  // console.log(token)
   const user=await verifytoken(token);
  //  console.log(user);
   onlineusers.add(user?._id.toString())
   
  io.emit('online_user',Array.from(onlineusers));
  socket.on('userId',async (userId)=>{
      const user=await User.findById(userId).select('-password');
       const payload={
        username:user?.username,
        email:user?.email,
        profile_pic:user?.profile_pic,
        online:onlineusers.has(userId.toString())
       }
       io.emit('user_data',payload);
  })
  socket.on('send_message',async(data)=>{
    // console.log("message send:",data)
   let conversation=await Conversation.findOne({
    '$or':[
      {sender:data.sender,receiver:data.receiver},
      {sender:data.receiver,receiver:data.sender}
    ]
   })
  
   if(!conversation){
    const createconversation=new Conversation({
      sender:data.sender,
      receiver:data.receiver
    })
    conversation=await createconversation.save()
   }
  //  console.log('conversation',conversation)
   const message=new Message({
    text:data.text,
    ImageUrl:data.ImageUrl,
    VideoUrl:data.VideoUrl,
    mesgByUserId:data.mesgByUserId
   })
   const savedmessage= await message.save()
    const updatedconversation=await Conversation.updateOne({_id:conversation._id},{
      '$push':{message:savedmessage?._id}
    })
    const getconversation=await Conversation.findOne({
      '$or':[
        {sender:data.sender,receiver:data.receiver},
        {sender:data.receiver,receiver:data.sender}
      ]
    }).populate('message').sort({updatedAt:-1})
  //   console.log('message',savedmessage)
   console.log('conversation',getconversation)
    io.to(data.receiver).emit('conversations',getconversation.message)
    io.to(data.sender).emit('conversations',getconversation.message)
  })
  socket.on('disconnect',()=>{
    onlineusers.delete(user?._id)
    io.emit('online_user',Array.from(onlineusers));
    console.log('diconnected user',socket.id)
    // console.log('diconnected username:',user?.username)
  })
})

module.exports={
  app,
  server
}