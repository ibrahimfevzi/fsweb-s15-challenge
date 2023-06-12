require("dotenv").config();
const JWT_SECRET = process.env.JWT_SECRET || "shh";
const jwt = require("jsonwebtoken");
const db= require("../data/dbConfig");

function generateToken(payload){
    return jwt.sign(payload,JWT_SECRET,{expiresIn:"1d"});
}
async function logout(token) {
    await db("tokenBlackList").insert({token:token});
}
function deleteFromBlackListToken(token){
    return db("tokenBlackList").where("token",token).del();
}
function checkIsInsertBlackList(token){
    return db("tokenBlackList").where("token",token).first();
}


module.exports = {
    generateToken,
    JWT_SECRET:JWT_SECRET,
    logout,
    deleteFromBlackListToken,
    checkIsInsertBlackList
}