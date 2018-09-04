var express = require("express");
var userRoutes = express.Router();

var User = require("./user");
var auth = require("./../../midlewares/authenticate");

userRoutes.route("/add").post(function (req, res) {
  var user = new User(req.body);

  user
    .save()
    .then(() => {
      //res.status(200).json({ item: "Item added successfully" });
      return user.generateAuthToken();
    })
    .then(token => {
      res
        .header("x-auth", token)
        .status(200)
        .send(user);
    })
    .catch(err => {
      res.status(400).send(err);
    });
});

//retorna el objeto a editar
userRoutes.route("/edit/:id").get(function (req, res) {
  User.findById(req.params.id, function (err, user) {
    if (err) res.status(400).send(err);
    res.status(200).send(user)
  })
});

//Obtener listado de usuarios sin retornar contrasenha
userRoutes.route("/users-list").get(function (req, res) {
  var query = User.find({});
  //excluye los campos password y tokens
  query.select('-password -tokens');

  query.exec(function (err, users) {
    if (err) res.status(400).send(err);
    res.status(200).send(users)
  })

});

userRoutes.route("/profile").get(auth, function (req, res) {
  res.send(req.user);
});

userRoutes.route("/token").delete(auth, function (req, res) {
  // console.log("User from delete token", req.user);
  req.user.removeToken(req.token).then(
    () => {
      res.status(200).send();
    },
    () => {
      res.status(400).send();
    }
  );
});

// userRoutes.get("/profile", auth, function(req, res){
//   res.send(req.user);
// })

module.exports = userRoutes;
