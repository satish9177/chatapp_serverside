const express=require('express');
const mongoose=require('mongoose')
const CONNECTDB=require('./config/mongodbconfig')
const router=require('./routers/user')
const cookieparser=require('cookie-parser')
const app=express(); 
app.use(express.json())
app.use(cookieparser());
CONNECTDB();
const PORT=process.env.PORT || 3000;
app.get('/',(req,res)=>{
  res.send(`server is running in PORT ${PORT} `)
})
app.use('/api',router)
mongoose.connection.once('open',()=>{
  app.listen(PORT,()=>{
    console.log('server is running in',PORT)
  })
})
