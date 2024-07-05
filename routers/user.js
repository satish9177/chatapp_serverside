const express=require('express')
const {register,Login,password,logout} = require('../controllers/User')
const {userdetails,updateuserdetails,getuserdetails} = require('../controllers/UserDetails')

const router=express.Router()
router.route('/register').post(register)
router.post('/login',Login)
router.post('/password',password)
router.post('/logout',logout)
router.get('/userdetail',userdetails)
router.post('/updateuserdata',updateuserdetails);
router.post('/search_users',getuserdetails);
module.exports=router