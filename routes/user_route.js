const { Router } = require('express')
const route = Router()
const User = require('../models/model_user')
const userMessage=require('../models/user_message')
const jwt=require('jsonwebtoken')
const {validateToken}=require('../services/authentication')

route.get('/signup',(req,res)=>{
    res.render('signup.ejs')
})

route.get('/login',(req,res)=>{
    res.render('login.ejs')   
})

route.get('/become-member',(req,res)=>{
    res.render('memberPasscode.ejs')
})

route.get('/become-admin',(req,res)=>{
    res.render('adminPasscode.ejs')
})

route.get('/info',async(req,res)=>{         //postman testing purpose
    const user=await User.find()
    res.json(user)
})

route.post('/signup',async(req,res)=>{
    
    try {
        const {username,email,password}=req.body
    
        const existingUser=await User.findOne({email:email})
        if(existingUser)
        {
            res.status(400).json({msg:'user exists'})
        }
        else{
            await User.create({ username, email, password })
            // res.send({ msg: 'User registered successfully' })
            res.redirect('/')
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: 'Error in signup' });
    }

})

route.post('/login',async (req, res) => {
    try {
        const { email, password } = req.body;

        const token=await User.matchPasswordAndGenerateToken(email,password)
        const message=await userMessage.find({})            //getting all messages in club
        // res.status(200).json({ msg: 'User logged in' });
        // return res.status(200).json({token:token})
        return res.cookie('token',token).render('club',{
            messages:message
        })    // 'token' is cookie name here
    
        
    } catch (error) {
        console.log(error);
        res.status(500).json({ msg: 'login Error' });
    }
});


route.get('/logout', (req, res) => {

    res.clearCookie('token').redirect('/')
})

route.post('/become-member', async (req, res) => {
    try {
        const token = req.cookies.token;
        const payload = validateToken(token);

        const { passcode } = req.body;
        if (passcode === 'member') {
            const messages = await userMessage.find({}).populate('author', 'username');
            console.log(messages) 
            const formattedMessages = messages.map(message => ({
                title: message.title,
                text: message.text,
                date: message.date,
                author: message.author ? message.author.username : 'Unknown' // Include username in each message
            }));

            res.render('membersPage.ejs', {
                messages: formattedMessages
            });
        } else {
            res.status(401).json({ msg: 'Invalid passcode' });
        }
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ msg: 'Internal server error' });
    }
});


route.post('/become-admin',async(req,res)=>{
    
    try {
        const token=req.cookies.token
        const payload=validateToken(token)
        // console.log(payload._id)
        const {adminPass}=req.body

        if(adminPass==='admin')
        {
            const messages = await userMessage.find({}).populate('author', 'username');
            console.log(messages) 
            const formattedMessages = messages.map(message => ({
                title: message.title,
                text: message.text,
                date: message.date,
                author: message.author ? message.author.username : 'Unknown', // Include username in each message
                messageId :message._id 
            }));

            res.render('adminPage.ejs', {
                messages: formattedMessages
            });
        }
    } catch (error) {
        console.log(error)
    }
})

route.post('/delete-message/:id', async (req, res) => {
    try {
        const messageId = req.params.id;
        // Assuming userMessage is your Mongoose model
        const messages = await userMessage.find({}).populate('author', 'username');
        await userMessage.findByIdAndDelete(messageId);
        const formattedMessages = messages.map(message => ({
            title: message.title,
            text: message.text,
            date: message.date,
            author: message.author ? message.author.username : 'Unknown', // Include username in each message
            messageId :message._id 
        }));

        res.render('adminPage.ejs', {
            messages: formattedMessages
        });
    } catch (error) {
        console.log(error);
        res.status(500).send('Error deleting message');
    }
});

module.exports=route










// const tokenval = req.cookies.token;
            // const decodedToken = jwt.verify(tokenval, '$sE2%8N67#NO92r$dnf7j!9@3@42');
            // const userId = decodedToken._id;
            // // const author_name = decodedToken.username;


            // route.post('/become-member', async (req, res) => {
            //     try {
            //         const token = req.cookies.token;
            //         const payload = validateToken(token);
            
            //         const { passcode } = req.body;
            //         if (passcode === 'member') {
            //             const messages = await userMessage.find({}).populate('author', 'username');
            //             console.log(messages) 
            //             const formattedMessages = messages.map(message => ({
            //                 title: message.title,
            //                 text: message.text,
            //                 date: message.date,
            //                 author: message.author ? message.author.username : 'Unknown' // Include username in each message
            //             }));
            
            //             res.render('membersPage.ejs', {
            //                 messages: formattedMessages
            //             });
            //         } else {
            //             res.status(401).json({ msg: 'Invalid passcode' });
            //         }
            //     } catch (error) {
            //         console.error('Error:', error);
            //         res.status(500).json({ msg: 'Internal server error' });
            //     }
            // });
            