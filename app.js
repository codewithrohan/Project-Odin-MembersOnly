const express=require('express')
const app=express()
const path = require("path");
const mongoose=require('mongoose')
const cookieParser=require('cookie-parser')
//route import
const userRoute=require('./routes/user_route')
const messageRoute=require('./routes/message_route')
const userMessage=require('./models/user_message')

const database='mongodb+srv://rohan:rohan123@cluster0.ha1ltia.mongodb.net/membersonlyDB?retryWrites=true&w=majority&appName=Cluster0'
mongoose.connect(database)
.then(()=>console.log('database connected '))
.catch(()=>console.log('cant connect to database  '))

app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(cookieParser())

app.set('view engine', 'ejs')
app.set('views', path.resolve('./views'))

// routes
app.get('/',async(req,res)=>{
    try {
        const message=await userMessage.find({})
        return res.render('home',{
            messages:message,
        })
    } catch (error) {
        res.status(500).json('error displaying all messages')
    }
})


app.use('/user',userRoute)
app.use('/message',messageRoute)

app.listen(7000,()=>console.log('server started at port 7000')) 










