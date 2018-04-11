var Usuario = require("./../modules/usuario/usuario");

var authenticate = function(req, res, next){
    var token = req.header('x-auth');

     Usuario.findByToken(token).then((user)=>{
       if(!user){
          return Promise.reject();
       }
       console.log("User from findbytoken", req.user);
       req.user = user;
       req.token = token;
       next();
     }).catch((e)=>{
       res.status(401).send();
     })
}

module.exports = authenticate;