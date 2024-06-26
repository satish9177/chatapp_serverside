const mongoose=require('mongoose')
const conversationSchema=new mongoose.Schema({
   sender:{
    type:mongoose.Schema.Types.ObjectId,
    ref:'User',
    require:true
   },
   receiver:{
    type:mongoose.Schema.Types.ObjectId,
    ref:'User',
    require:true
   },
   message:[
    {
      type:mongoose.Schema.Types.ObjectId,
      ref:'Message'
    }
   ]
},{
  timestamps:true
})
const messageSchema=new mongoose.Schema({
  text:{
    type:String,
    default:""
  },
  ImageUrl:{
    type:String,
    default:""
  },
  VideoUrl:{
    type:String,
    default:""
  },
  seen:{
    type:String,
    default:false
  }
},{
  timestamps:true
})
const Conversation=mongoose.model('Conversation',conversationSchema)
const Message=mongoose.model('Message',messageSchema)
module.exports={Conversation,Message}