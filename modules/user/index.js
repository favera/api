var express = require("express");
var userRoutes = express.Router();
const bcrypt = require("bcryptjs");

var User = require("./user");
var auth = require("./../../midlewares/authenticate");

userRoutes.route("/add").post(function(req, res) {
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
userRoutes.route("/edit/:id").get(function(req, res) {
  User.findById(req.params.id, function(err, user) {
    if (err) res.status(400).send(err);
    res.status(200).send(user);
  });
});

// Elimina usuario
userRoutes.route("/delete/:id").delete(function(req, res) {
  User.findByIdAndRemove({ _id: req.params.id }, function(err, user) {
    if (err) res.json(err);
    else res.json("Successfully removed");
  });
});

//Obtener listado de usuarios sin retornar contrasenha
userRoutes.route("/users-list").get(function(req, res) {
  var query = User.find({});
  //excluye los campos password y tokens
  query.select("-password -tokens");

  query.exec(function(err, users) {
    if (err) res.status(400).send(err);
    res.status(200).send(users);
  });
});

userRoutes.route("/profile").get(auth, function(req, res) {
  res.send(req.user);
});

<<<<<<< HEAD
userRoutes.route("/token").delete(auth, function(req, res) {
=======
userRoutes.route("/update-password").post(function (req, res) {
  User.find({ username: req.body.username }, function (err, user) {
    if (err) res.status(400).send(err);
    console.log(user);

    if (user.length > 0) {
      console.log(req.body.oldpassword, user[0].password)
      bcrypt.compare(req.body.oldpassword, user[0].password, function (err, response) {
        if (err) res.status(400).send(err);
        if (response) {
          User.findOneAndUpdate({ _id: user[0]._id }, { $set: { password: req.body.newpassword } }, function (err, updatedPassword) {
            if (err) res.status(400);
            console.log(updatedPassword);
            res.status(200).send(updatedPassword);
          })
        }
      })
    }

  })
})

userRoutes.route("/token").delete(auth, function (req, res) {
>>>>>>> a48e8c0c48202d160169125f4ae28a646c5e27ac
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
