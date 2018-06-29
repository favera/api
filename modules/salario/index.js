var express = require("express");
var salarioRoutes = express.Router();

var Salario = require("./salario");
var BancoHora = require("./bancoHora");
var ResumenSalarial = require("./resumenSalarial");
var ResumenBancoHora = require("./resumenBancoHora");
var Asistencia = require("./../asistencia/asistencia");

//### Periodo de pago de planillas de salarios
salarioRoutes.route("/add/period").post(function(req, res) {
  console.log(req.body);
  var salario = new Salario(req.body);

  salario
    .save()
    .then(salario => {
      res.status(200).send(salario);
    })
    .catch(err => {
      res.status(400).send(err);
    });
});

//Actualiza el array de detalle de salario, donde se detalla los pagos de cada funcionario
salarioRoutes.route("/update/salary-detail/:id").put(function(req, res) {
  Salario.findById(req.params.id, function(err, salaryResume) {
    if (err) res.status(400).send(err);

    console.log(req.body);

    // salaryResume.salaryDetail = req.body;
    salaryResume.detail = true;
    salaryResume.save(function(err, updatedSalaryResume) {
      if (err) res.status(400).send(e);
      res.status(200).send("Detail updated!");
    });
  });
});

salarioRoutes.route("/").get(function(req, res) {
  var query = {};
  var options = {
    sort: { _id: -1 },
    lean: true,
    page: parseInt(req.query.page),
    limit: parseInt(req.query.limit)
  };
  Salario.paginate(query, options)
    .then(result => {
      res.json(result);
    })
    .catch(err => {
      res.status(400).send(err);
    });
});

//Obtener detalle
salarioRoutes.route("/salary-detail/:id").get(function(req, res) {
  Salario.findById(req.params.id).exec(function(err, salaryDetail) {
    if (err) res.status(400).send(err);
    res.status(200).send(salaryDetail);
  });
});

salarioRoutes.route("/add/detail/:id").put(function(req, res) {
  Salario.findById(req.params.id).exec(function(err, salario) {
    if (err) res.status(400).send(err);
    salario.salaryDetail = req.body.salaryDetail.slice();
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

//###Banco de Hora###

salarioRoutes.route("/add/banco-hora/:id").post(function(req, res) {
  var query = { funcionario: req.params.id };
  var update = {
    $inc: {
      totalMinutes: req.body.totalMinutes
    }
  };
  var options = { new: true, upsert: true };
  BancoHora.findOneAndUpdate(query, update, options).exec(function(
    err,
    result
  ) {
    console.log(result);
    if (err) {
      res.status(400).send(err);
    }

    res.status(200).send(result);
  });
});

salarioRoutes.route("/banco-hora/:id").get(function(req, res) {
  BancoHora.find({ funcionario: req.params.id })
    .then(response => {
      res.status(200).send(response);
    })
    .catch(e => res.status(400).send(e));
});

//#### Obtener historial de marcaciones por funcionario
salarioRoutes.route("/attendance-historic/:id").get(function(req, res) {
  Asistencia.find({
    $and: [
      { funcionario: req.params.id },
      {
        $or: [{ horasFaltantes: { $ne: null } }, { horasExtras: { $ne: null } }]
      },
      { fecha: { $gte: req.query.inicio, $lte: req.query.fin } }
    ]
  })
    .populate("funcionario")
    .then(response => {
      res.status(200).send(response);
    })
    .catch(e => {
      res.status(400).send(e);
    });
});

//Defined delete | remove | destroy route
salarioRoutes.route("/delete/:id").delete(function(req, res) {
  Salario.findByIdAndRemove({ _id: req.params.id }, function(err, item) {
    if (err) res.status(400).send(err);
    res.status(200).send("Successfully removed");
  });
});

salarioRoutes.route("/update-status/:id").put(function(req, res) {
  Salario.findByIdAndUpdate(
    req.params.id,
    { status: "Aprobado" },
    { new: true },
    function(err, updatedPayroll) {
      if (err) res.status(400).send(err);
      res.status(200).send(updatedPayroll);
    }
  );
});

//### Resumen Salarial ### /
salarioRoutes.route("/add/resumen-salarial").post(function(req, res) {
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
