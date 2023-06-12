const userModel = require("../models/users-model");
const bcryptjs = require("bcryptjs");
function checkPayload(req,res,next){
    try {
        let {username,password} = req.body;
        if(!username || !password || username.length>255 || password.length>255){
            res.status(400).json({message:"geçersiz input"});
        }else{
            next();
        }
    } catch (error) {
        next(error);
    }
}

async function validateLogin(req,res,next){
    try {
        let user = await userModel.getByUsername(req.body.username);
        if(!user){
            res.status(404).json({message:"geçersiz kriterler"});
        }else{
            let passwordIsTrue = bcryptjs.compareSync(req.body.password,user.password);
            if(passwordIsTrue){
                req.currentUser = user;
                next()
            }else{
                res.status(400).json({message:"Şifre yanlış."})
            }
        }
    } catch (error) {
        next(error);
    }
}

module.exports = {
    checkPayload,
    validateLogin
}