const express=require('express')
const {Server}=require('socket.io')
const verifytoken=require('../verifytoken/verifytoken')
const http=require('http')
const User = require('../models/User')
const app=express()
const server=http.createServer(app);
const {Conversation,Message}=require('../models/Conversation')
const Sidebar = require('./Conversation')
const io=new Server(server,{
   cors: {origin : process.env.FRONTEND_URL,
    credentials : true}
})
const onlineusers=new Set();
const conv=async (data)=>{
 
  //  return conversation
}
io.on('connection',async (socket)=>{
  console.log('socket id',socket.id);
  const token=socket.handshake.auth.token;
  // console.log(token)
   const user=await verifytoken(token);
  //  console.log(user);
   onlineusers.add(user?._id.toString())
   socket.join(user?._id.toString());
  io.emit('online_user',Array.from(onlineusers));
  socket.on('sidebar',async (userId)=>{
    // console.log("userId",userId)
      convers=await Sidebar(userId)
    socket.emit('conversationsidebar',convers)
  })
  socket.on('userId',async (userId)=>{
      const users=await User.findById(userId).select('-password');
       const payload={
        _id:users?._id,
        username:users?.username,
        email:users?.email,
        profile_pic:users?.profile_pic,
        online:onlineusers.has(userId)
       }
       socket.emit('user_data',payload);
     
       const getconversation=await Conversation.findOne({
        '$or':[
          {sender:userId,receiver:user?._id},
          {sender:user?._id,receiver:userId}
        ]
      }).populate('message').sort({updatedAt:-1})
      // console.log(getconversation)
       io.emit('messages',getconversation?.message || [])
  })
 
  socket.on('send_message',async(data)=>{
    // console.log("message send:",data)
    // let conversation=conv(data);
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
  //  console.log('conversation',getconversation)
   io.to(data.receiver).emit('conversations',getconversation.message)
  io.to(data.sender).emit('conversations',getconversation.message)
  const conversender=await Sidebar(data.receiver) 
  const converreciever=await Sidebar(data.sender)
  io.to(data.receiver).emit('conversationsidebar',converreciever)
  io.to(data.sender).emit('conversationsidebar',conversender)
  })

  
  socket.on('disconnect',()=>{
    onlineusers.delete(user?._id.toString())
    io.emit('online_user',Array.from(onlineusers));
    console.log('diconnected user',socket.id)
    // console.log('diconnected username:',user?.username)
  })
})

module.exports={
  app,
  server
}