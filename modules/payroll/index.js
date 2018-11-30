var express = require("express");
var payrollRoutes = express.Router();
var moment = require("moment");
var ObjectID = require("mongodb").ObjectID;

var Payroll = require("./payroll");
var BankHour = require("./bankHours");
var Attendance = require("./../attendance/attendance");

//### Periodo de pago de planillas de salarios
payrollRoutes.route("/add/period").post(function(req, res) {
  console.log(req.body);

  req.body.month = new Date(new Date(req.body.month).setHours(24, 0, 0, 0));
  req.body.year = new Date(new Date(req.body.year).setHours(24, 0, 0, 0));
  // req.body.month = moment(req.body.month).format();
  // req.body.year = moment(req.body.year).format();
  console.log("Fechas", req.body.month, req.body.year);

  var payroll = new Payroll(req.body);

  payroll
    .save()
    .then(payroll => {
      res.status(200).send(payroll);
    })
    .catch(err => {
      res.status(400).send(err);
    });
});

//Actualiza el array de detalle de salario, donde se detalla los pagos de cada funcionario
payrollRoutes.route("/update/salary-detail/:id").put(function(req, res) {
  Payroll.findById(req.params.id, function(err, salaryResume) {
    if (err) res.status(400).send(err);

    console.log(req.body);

    salaryResume.salaryDetail = req.body;
    salaryResume.detail = true;
    salaryResume.save(function(err, updatedSalaryResume) {
      if (err) res.status(400).send(e);
      res.status(200).send("Detail updated!");
    });
  });
});

payrollRoutes.route("/").get(function(req, res) {
  var query = {};
  var options = {
    sort: { _id: -1 },
    lean: true,
    page: parseInt(req.query.page),
    limit: parseInt(req.query.limit)
  };
  Payroll.paginate(query, options)
    .then(result => {
      res.json(result);
    })
    .catch(err => {
      res.status(400).send(err);
    });
});

//Obtener detalle
payrollRoutes.route("/salary-detail/:id").get(function(req, res) {
  Payroll.findById(req.params.id).exec(function(err, salaryDetail) {
    if (err) res.status(400).send(err);
    res.status(200).send(salaryDetail);
  });
});

payrollRoutes.route("/add/detail/:id").put(function(req, res) {
  Payroll.findById(req.params.id).exec(function(err, payroll) {
    if (err) res.status(400).send(err);
    payroll.salaryDetail = req.body.salaryDetail.slice();
    payroll
      .save()
      .then(payroll => {
        res.status(200).send("Data add sucessfully");
      })
      .catch(err => {
        res.status(400).send(err);
      });
  });
});

//###Banco de Hora###
payrollRoutes.route("/add/bank-hour/:id").post(function(req, res) {
  var query = { employee: req.params.id };
  var update = {
    $inc: {
      totalMinutes: req.body.totalMinutes
    }
  };
  var options = { new: true, upsert: true };
  BankHour.findOneAndUpdate(query, update, options).exec(function(err, result) {
    console.log(result);
    if (err) {
      res.status(400).send(err);
    }

    res.status(200).send(result);
  });
});

payrollRoutes.route("/bank-hour/:id").get(function(req, res) {
  BankHour.find({ employee: req.params.id })
    .then(response => {
      res.status(200).send(response);
    })
    .catch(e => res.status(400).send(e));
});

//#### Obtener historial de marcaciones por funcionario
payrollRoutes.route("/attendance-historic/:id").get(function(req, res) {
  Attendance.find({
    $and: [
      { employee: req.params.id },
      {
        $or: [{ delay: { $ne: null } }, { extraHours: { $ne: null } }]
      },
      { fecha: { $gte: req.query.inicio, $lte: req.query.fin } }
    ]
  })
    .populate("employee")
    .then(response => {
      res.status(200).send(response);
    })
    .catch(e => {
      res.status(400).send(e);
    });
});

//Defined delete | remove | destroy route
payrollRoutes.route("/delete/:id").delete(function(req, res) {
  Payroll.findByIdAndRemove({ _id: req.params.id }, function(err, item) {
    if (err) res.status(400).send(err);
    res.status(200).send("Successfully removed");
  });
});

//query para eliminar cuota de salarySummary y actualizar el valor de SalaryDetail.lending
payrollRoutes.route("/salary-summary/delete-lending").put(function(req, res) {
  console.log("From query", req.query);
  req.params.amount = parseInt(req.query.amount);
  Payroll.update(
    { "salaryDetail.salarySummary._id": new ObjectID(req.query.id) },
    {
      $inc: { "salaryDetail.$.lending": req.query.amount },
      $pull: {
        "salaryDetail.$.salarySummary": { _id: new ObjectID(req.query.id) }
      }
    },
    { multi: false },
    function(err, updatedLending) {
      if (err) res.status(400).send(err);
      res.status(200).send(updatedLending);
      // if (err) console.log(err);
      // console.log("Anytimeee", updatedLending);
    }
  );
});

payrollRoutes.route("/update-status/:id").put(function(req, res) {
  Payroll.findByIdAndUpdate(
    req.params.id,
    { status: "Aprobado" },
    { new: true },
    function(err, updatedPayroll) {
      if (err) res.status(400).send(err);
      res.status(200).send(updatedPayroll);
    }
  );
});

module.exports = payrollRoutes;
