var express = require("express");
var lendingRoutes = express.Router();

// Require Prestamo model in our routes module
var Lending = require("./lending");

//Importando Object Id
var ObjectID = require("mongodb").ObjectID;

// Defined store route
lendingRoutes.route("/add").post(function (req, res) {
  req.body.amount = parseInt(req.body.amount.split(".").join(""));
  //Formato a fechas porque se recibe string entonces setea el timezone del server y se cera la hora
  req.body.date = new Date(new Date(req.body.date).setHours(24,0,0,0));
  req.body.startMonth = new Date(new Date(req.body.startMonth).setHours(24,0,0,0));
  var lending = new Lending(req.body);
  lending
    .save()
    .then(item => {
      res.status(200).json({ item: "Item added successfully" });
    })
    .catch(err => {
      console.log(err);
      res.status(400).send(err);
    });
});

//retornar cuotas por funcionario y mes
lendingRoutes.route("/employee-lending/:id").get(function (req, res) {
  var installmentDate, dueDate;
  var result = [];
  dueDate = new Date(req.query.start);
  Lending.find(
    {
      employee: new ObjectID(req.params.id),
      "installments.dueDate": { $gte: req.query.start, $lte: req.query.end }
    },
    function (err, lendings) {
      if (err) res.status(400).send(err);

      lendings.forEach(lending => {
        lending.installments.forEach(lending => {
          installmentDate = new Date(lending.dueDate);
          if (dueDate.getMonth() === installmentDate.getMonth()) {
            result.push(lending);
          }
        });
      });
      res.status(200).send(result);
    }
  );
});

//return loan of period dates
lendingRoutes.route("/loan-period").get(function (req, res) {
  Lending.find({
    "installments.dueDate": {
      $gte: req.query.startDate,
      $lte: req.query.endDate
    },
    "installments.state": "pendiente"
  })
    .then(result => {
      res.json(result);
    })
    .catch(e => res.status(400).send(e));
});

//return all prestamos
lendingRoutes.route("/full-list").get(function (req, res) {
  Lending.find({})
    .then(result => {
      res.json(result);
    })
    .catch(e => console.log(e));
});

// Defined get data(index or listing) route
lendingRoutes.route("/").get(function (req, res) {
  var startDate, endDate;
  var query = {};
  if (req.query.startDate !== "null") {
    startDate = new Date(req.query.startDate);
  }

  if (req.query.endDate !== "null") {
    endDate = new Date(req.query.endDate);
  }

  if (req.query.parameter === "null") {
    req.query.parameter = null;
  }

  //si todos los parametros son enviados
  if (req.query.parameter && startDate && endDate) {
    query = {
      "installments.dueDate": { $gte: startDate, $lte: endDate },
      employeeName: { $regex: req.query.parameter, $options: "i" }
    };
  }

  //si campo parameter es nulo, pero fecha inicio y fin no es nulo
  if (!req.query.parameter && startDate && endDate) {
    query = { "installments.dueDate": { $gte: startDate, $lte: endDate } };
  }

  //busqueda es nulo, y fecha fin tambien, se le asigna la fecha de hoy
  if (!req.query.parameter && startDate && !endDate) {
    query = { "installments.dueDate": { $gte: startDate, $lte: new Date() } };
  }

  if (req.query.parameter && startDate && !endDate) {
    query = {
      "installments.dueDate": { $gte: startDate, $lte: new Date() },
      employeeName: { $regex: req.query.parameter, $options: "i" }
    };
  }

  if (req.query.parameter && !startDate && !endDate) {
    query = {
      employeeName: { $regex: req.query.parameter, $options: "i" }
    };
  }
  console.log("Resultado query", query);
  var options = {
    sort: { employeeName: 1 }, //populate: { path: "funcionario" },
    lean: true,
    page: parseInt(req.query.page),
    limit: parseInt(req.query.limit)
  };
  Lending.paginate(query, options).then(result => {
    console.log(result);
    res.json(result);
  });
});

// // Defined edit route
lendingRoutes.route("/edit/:id").get(function (req, res) {
  var id = req.params.id;
  Lending.findById(id, function (err, lending) {
    res.json(lending);
  });
});
//Actualizar prestamos que fueron descontados en la planilla de salarios, en el body se pasa el array de los id de los prestamos
//actualizado desde Detalle Planilla.
lendingRoutes.route("/update/lending/processed").put(function (req, res) {
  console.log(req.body);
  var result;
  req.body.forEach(lending => {
    Lending.update(
      { "installments._id": new ObjectID(lending) },
      { $set: { "installments.$.estado": "procesado" } },
      function (err, updatedLending) {
        if (err) {
          console.log(err);
          res.status(400).send("Error updating lendigns");
        }
        console.log(updatedLending);
        // result = true;
      }
    );
  });
  // if (!result) res.status(400).send("Error updating lendigns");
  res.status(200).send("All lendigns where updated");
});

//Actualizar desde crear planilla
lendingRoutes.route("/update/lending/paid").put(function (req, res) {
  Lending.update(
    { "installments.state": "procesado" },
    { $set: { "installments.$.state": "pagado" } },
    { multi: true },
    function (err, updatedItem) {
      if (err) res.status(400).send(err);
      res.status(200).send(updatedItem);
    }
  );
});

// //  Defined update route
lendingRoutes.route("/update/:id").put(function (req, res) {
  Lending.findById(req.params.id, function (err, lending) {
    if (!lending) res.status(404).send("Lending not found");
    else {
      lending.date = new Date(req.body.date);
      lending.employee = req.body.employee;
      lending.employeeName = req.body.employeeName;
      lending.amount = parseInt(req.body.amount.split(".").join(""));
      lending.coin = req.body.coin;
      lending.startMonth = req.body.startMonth;
      lending.installments = req.body.installments;

      lending
        .save()
        .then(lending => {
          res.json("Update complete");
        })
        .catch(err => {
          res.status(400).send(err);
        });
    }
  });
});

// // Defined delete | remove | destroy route
lendingRoutes.route("/delete/:id").delete(function (req, res) {
  Lending.findByIdAndRemove({ _id: req.params.id }, function (err, item) {
    if (err) res.status(400).send(err);
    else res.status(200).send("Successfully removed");
  });
});

module.exports = lendingRoutes;
