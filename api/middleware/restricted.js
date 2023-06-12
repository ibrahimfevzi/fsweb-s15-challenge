const tokenHelper = require("../../helper/token-helper");
const jwt = require("jsonwebtoken");

module.exports = async (req, res, next) => {
 
  /*
    EKLEYİN

    1- Authorization headerında geçerli token varsa, sıradakini çağırın.

    2- Authorization headerında token yoksa,
      response body şu mesajı içermelidir: "token gereklidir".

    3- Authorization headerında geçersiz veya timeout olmuş token varsa,
	  response body şu mesajı içermelidir: "token geçersizdir".
  */
 try {
  const token = req.headers["authorization"];
  if(!token){
    res.status(401).json({message:"Token gereklidir"});
  }else{
    jwt.verify(token,tokenHelper.JWT_SECRET,async (err,decodedToken)=>{
      if(err){
        await tokenHelper.deleteFromBlackListToken(token)
        res.status(401).json({message:"Token geçersiz"});
      }else{
        let isLogoutBefore = await tokenHelper.checkIsInsertBlackList(token);
        if(isLogoutBefore){
          res.status(400).json({message:"Daha önce çıkış yapılmış. Tekrar giriş yapınız"})
        }else{
          req.decodedToken = decodedToken;
          next();
        }
      }
    })
  }
 } catch (error) {
  next(error);
 }
};
