const express=require('express')
const route=express.Router()
const jwt = require('jsonwebtoken');
const userMessage=require('../models/user_message')
const User=require('../models/model_user')
const {validateToken}=require('../services/authentication')


route.get('/add-message',(req,res)=>{
    res.render('message.ejs')
})



route.post('/add-message',async(req,res)=>{

    const token=req.cookies.token
    const payload=validateToken(token)
    console.log(payload)
    const {title,text}=req.body
    try {
        
        const message=await userMessage.find({}).populate()
        console.log(message)
        await userMessage.create({
            title,text,
            author:payload._id
        })
        
        // -----
        const author = await User.find({_id:payload._id})
        // res.redirect('/')
        console.log('author :',payload._id)
        res.render('club',{
            messages:message,
            author:payload.username
        })
        //------

    } catch (error) {
        console.log(error)
        res.status(400).json('error in adding message')
    }
   
})





// route.get('/',async(req,res)=>{
//     try {
//         const message=await userMessage.find()
//         return res.render('home',{
//             messages:message,
//         })
//     } catch (error) {
//         res.status(500).json('error displaying all messages')
//     }
// })


 
module.exports=route 






