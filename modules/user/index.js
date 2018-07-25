var express = require("express");
var usuarioRoutes = express.Router();

var Usuario = require("./usuario");
var auth = require("./../../midlewares/authenticate");

usuarioRoutes.route("/add").post(function(req, res){
  var user = new Usuario(req.body);

  user.save().then(() => {
    //res.status(200).json({ item: "Item added successfully" });
    return user.generateAuthToken();
  }).then((token)=>{
    res.header('x-auth', token).status(200).send(user);
  })
  .catch(err => {
    res.status(400).send(err);
  });

 });

 usuarioRoutes.route("/profile").get(auth, function (req, res){
    res.send(req.user);
 })

 usuarioRoutes.route("/token").delete(auth, function(req,res){
   console.log("User from delete token", req.user);
   req.user.removeToken(req.token).then(()=> {
     res.status(200).send();
   }, ()=>{
     res.status(400).send();
   })
 })

// usuarioRoutes.get("/profile", auth, function(req, res){
//   res.send(req.user);
// })

module.exports = usuarioRoutes;