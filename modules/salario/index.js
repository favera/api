var express = require("express");
var salarioRoutes = express.Router();

var Salario = require("./salario");
var ResumenSalarial = require("./resumenSalarial");
var ResumenBancoHora = require("./resumenBancoHora");

salarioRoutes.route("/add/period/").post(function(req, res) {
  console.log(req.body);
  var salario = new Salario(req.body);

  salario
    .save()
    .then(salario => {
      res.status(200).send("Data add successfully");
    })
    .catch(err => {
      res.status(400).send(err);
    });
});

salarioRoutes.route("/add/detail/:id").put(function(req, res) {
  Salario.findById(req.params.id).exec(function(err, salario) {
    if (err) res.status(400).send(err);
    salario.salarioDetail = req.body.salarioDetail.slice();
    salario
      .save()
      .then(salario => {
        res.status(200).send("Data add sucessfully");
      })
      .catch(err => {
        res.status(400).send(err);
      });
  });
});

salarioRoutes.route("/add/resumen-salarial/").post(function(req, res) {
  var resumenSalarial = new ResumenSalarial(req.body);

  resumenSalarial
    .save()
    .then(resumen => {
      res.status(200).send("data add sucessfully");
    })
    .catch(err => {
      res.status(400).send(err);
    });
});

module.exports = salarioRoutes;
