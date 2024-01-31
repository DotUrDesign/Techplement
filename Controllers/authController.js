const userModel = require('../Models/userModel');
require('dotenv').config();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const JWT_KEY = process.env.JWT_KEY;

module.exports.registerUser = async function registerUser(req, res){
    try {
        let data = req.body;
        if(!data){
            return res.status(400).send("Data not found");
        }

        if(!data.password || (data.password.length < 5 || data.password.length > 50))
        {
            return res.status(403).send("Password is too long or too short! Password should be of length between 5 to 50.")
        }

        let salt = await bcrypt.genSalt();
        let hashedPassword = await bcrypt.hash(data.password, salt);
        data.password = hashedPassword;
    
        let userDetails = await userModel.create(data);
        if(!userDetails){
            return res.status(500).send("Unable to create data inside database");
        }
        
        return res.status(200).json({
            message : "Data created in database successfully",
            userDetails : userDetails
        })
    } catch (error) {
        console.log(error.message);
    }
}

function createRefreshToken(payload){
    return jwt.sign(payload, JWT_KEY);
}

function createAccessToken(payload){
    return jwt.sign(payload, JWT_KEY, {expiresIn : '55m'})
}

module.exports.loginUser = async function loginUser(req, res){
    try {
        let {
            email,
            password
        } = req.body;

        
        let userDetails = await userModel.find({ email : email });
        if(!userDetails){
            return res.status(403).send("Please register first!");
        }
        let isVerified = await bcrypt.compare(password, userDetails[0].password);
        if(!isVerified){
            return res.status(403).send("Wrong password!");
        }
        
        let refreshToken = createRefreshToken({id : userDetails[0].id, email : userDetails[0].email});
        let accessToken = createAccessToken({id : userDetails[0].id, email : userDetails[0].email});

        // sending the refresh token in cookie 
        res.cookie('refreshToken', refreshToken, {httpOnly : true});

        // sending the access token in response
        res.status(200).json({
            message : "Login successful",
            userDetails : userDetails,
            token : accessToken
        })

    } catch (error) {
        console.log(error.message);
    }
}

module.exports.protectRoute = async function protectRoute(req, res, next) {
    try {
        if(req.cookies.refreshToken)
        {
            let token = req.cookies.refreshToken;
            let payload = await jwt.verify(token, JWT_KEY);
            if(payload)
            {   
                req.id = payload.id;
                req.email = payload.email;
                next();
            }
            else {
                return res.status(403).send("Wrong credentials");
            }
        }
        else{
            return res.status(403).send("Login first!")
        }
    } catch (error) {
        console.log(error.message);
    }
}

module.exports.logout = async function logout(req, res) {
    try {
        res.cookie('refreshToken', ' ', { maxAge : 1 });
        return res.status(200).send("Logged out successfully");
    } catch (error) {
        console.log(error.message);
    }
}