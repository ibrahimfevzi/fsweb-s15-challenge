const db = require("../../data/dbConfig");

function getAll(){
    return db("users");
}
function getByUsername(username){
    return db("users").where("username",username).first();
}
async function insert(insertedModel) {
    await db("users").insert(insertedModel);
    return getByUsername(insertedModel.username);
}

module.exports = {
    getAll,getByUsername,insert
}
