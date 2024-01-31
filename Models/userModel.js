const mongoose = require('mongoose');
require('dotenv').config();
const bcrypt = require('bcrypt');
const DB_LINK = process.env.DB_LINK;

mongoose.connect(DB_LINK)
.then((db) => {
    console.log("User Database connected!")
}).catch((err) => {
    console.log("Error connecting to Database " + err.message);
});

const userSchema = mongoose.Schema({
    name : {
        type : String,
        required : true
    },
    email : {
        type : String,
        required : true,
        unique : true
    },
    password : {
        type : String,
        required : true
    },
    role : {
        type : String,
        enum : ['admin', 'user'],
        default : 'user'
    }
});


const userModel = mongoose.model('userModel', userSchema);
module.exports = userModel;