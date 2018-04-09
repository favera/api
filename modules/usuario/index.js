var express = require("express");
var usuarioRoutes = express.Router();

var Usuario = require("./usuario");

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

module.exports = usuarioRoutes;