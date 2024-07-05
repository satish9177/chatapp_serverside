const express=require('express')
const mongoose=require('mongoose')
const CONNECTDB=require('./config/mongodbconfig')
const router=require('./routers/user')
const cookieparser=require('cookie-parser')
const cors=require('cors')
// const app=express(); 
const {app,server}=require('./socket/socket')
app.use(express.json())
app.use(cookieparser());
app.use(cors(
  {origin : process.env.FRONTEND_URL,
  credentials : true}
));
CONNECTDB();
const PORT=process.env.PORT || 8080;
app.get('/',(req,res)=>{
  res.send(`server is running in PORT ${PORT} `)
})
app.use('/api',router)
mongoose.connection.once('open',()=>{
  server.listen(PORT,()=>{
    console.log('server is running in',PORT)
  })
})
