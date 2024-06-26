const mongoose=require('mongoose')
const dotenv=require('dotenv')
dotenv.config()
const URL=process.env.MONGODB_URL;
const CONNECTDB=async()=>{
    try {
      mongoose.connect(URL);
      console.log('database is connected')
    } catch (error) {
      console.log('database is not connected',error)
    }
}
module.exports=CONNECTDB
