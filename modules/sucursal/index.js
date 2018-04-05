// itemRoutes.js

var express = require("express");
var sucursalRoutes = express.Router();

// Require Item model in our routes module
var Sucursal = require("./sucursal");
var Funcionario = require("../funcionario/funcionario");

// Defined store route
sucursalRoutes.route("/add").post(function(req, res) {
  var sucursal = new Sucursal(req.body);
  sucursal
    .save()
    .then(item => {
      res.status(200).json({ item: "Item added successfully" });
    })
    .catch(err => {
      res.status(400).send("unable to save to database");
    });
});

// Defined get data(index or listing) route
sucursalRoutes.route("/").get(function(req, res) {
  Sucursal.find(function(err, sucursales) {
    if (err) {
      console.log(err);
    } else {
      res.json(sucursales);
    }
  });
});

// // Defined edit route
sucursalRoutes.route("/edit/:id").get(function(req, res) {
  var id = req.params.id;
  Sucursal.findById(id, function(err, sucursal) {
    res.json(sucursal);
  });
});

// //  Defined update route
sucursalRoutes.route("/update/:id").put(function(req, res) {
  Sucursal.findById(req.params.id, function(err, sucursal) {
    if (!sucursal) return next(new Error("Could not load Document"));
    else {
      sucursal.nombre = req.body.nombre;
      sucursal.horaEntrada = req.body.horaEntrada;
      sucursal.horaSalida = req.body.horaSalida;
      sucursal.telefono = req.body.telefono;

      sucursal
        .save()
        .then(sucursal => {
          res.json("Update complete");
        })
        .catch(err => {
          res.status(400).send("unable to update the database");
        });
    }
  });
});

// // Defined delete | remove | destroy route
sucursalRoutes.route("/delete/:id").get(function(req, res) {
  var sucursales = []
  // Funcionario.distinct("sucursal", function(err, response){
  //   console.log(response);
  // })
  Sucursal.find({"_id":{$nin : Funcionario.distinct("sucursal")}}, function(err, sucursalesEliminar){
    //sucursales = sucursalesEliminar;
    console.log(err, sucursalesEliminar);
  });
  // Sucursal.findByIdAndRemove({ _id: req.params.id }, function(err, sucursal) {
  //   if (err) res.json(err);
  //   else res.json("Successfully removed");
  // });
});

module.exports = sucursalRoutes;
