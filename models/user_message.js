
const mongoose = require('mongoose');


const messageSchema = new mongoose.Schema({
    title:{
        type: String,
        required: true,
    },
    text: {
        type: String,
        required: true,
    },
    date:{
        type:Date,
        default:Date.now()
    },
    author:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
    }

});

const Message = mongoose.model('Message', messageSchema);

module.exports = Message;












