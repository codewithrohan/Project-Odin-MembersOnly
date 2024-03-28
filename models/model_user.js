 
const mongoose = require('mongoose');
const bcrypt=require('bcrypt')
const {genToken}=require('../services/authentication')
const userSchema = new mongoose.Schema({ 
    username: {
        type: String,
        required: true,
    }, 
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    passcode:{
        type:String,
    },
    createdAt:{
        type:Date,
        default:Date.now(),
    },
    salt:{
        type:String,
    },
    role:{
        type:String,
        enum:['ADMIN','USER','MEMBER'],
        default:'USER'
    }
});

// required for hashing our password 

userSchema.pre('save',async function(next){
    try {
        const salt=await bcrypt.genSalt(10)
        const hashPass=await bcrypt.hash(this.password,salt)
        this.password=hashPass
        next()
    } catch (error) {
        console.log(error)
        res.status(400).json({msg:'error'})
    }
})

// required to compare passwords and generate token
userSchema.statics.matchPasswordAndGenerateToken = async function(email, password) {
    try {
        const user = await this.findOne({ email });

        if (!user) {
            throw new Error('User not found');
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            throw new Error('Invalid password');
        }

        // Use genToken function to generate the token
        const token = await genToken(user);

        return token;
    } catch (error) {
        console.log(error);
        throw error;
    }
};

const User=mongoose.model('User',userSchema)

module.exports = User;


