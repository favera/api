var express = require("express");
var prestamoRoutes = express.Router();

// Require Prestamo model in our routes module
var Prestamo = require("./prestamo");

// Defined store route
prestamoRoutes.route("/add").post(function(req, res) {
  var prestamo = new Prestamo(req.body);
  prestamo
    .save()
    .then(item => {
      res.status(200).json({ item: "Item added successfully" });
    })
    .catch(err => {
      console.log(err);
      res.status(400).send("unable to save to database");
    });
});

//return all prestamos
prestamoRoutes.route("/full-list").get(function(req, res) {
  Prestamo.find({})
    .then(result => {
      res.json(result);
    })
    .catch(e => console.log(e));
});

// Defined get data(index or listing) route
prestamoRoutes.route("/").get(function(req, res) {
  console.log("Entro");
  var query = {};
  if (req.query.search) {
    query = { nombreFuncionario: { $regex: req.query.search, $options: "i" } };
  }
  console.log("Resultado query", query);
  var options = {
    sort: { nombreFuncionario: 1 },
    //populate: { path: "funcionario" },
    lean: true,
    page: parseInt(req.query.page),
    limit: parseInt(req.query.limit)
  };
  Prestamo.paginate(query, options).then(result => {
    console.log(result);
    res.json(result);
  });
});

// // Defined edit route
prestamoRoutes.route("/edit/:id").get(function(req, res) {
  var id = req.params.id;
  Prestamo.findById(id, function(err, prestamo) {
    res.json(prestamo);
  });
});

// //  Defined update route
prestamoRoutes.route("/update/:id").put(function(req, res) {
  Prestamo.findById(req.params.id, function(err, prestamo) {
    if (!prestamo) return next(new Error("Could not load Document"));
    else {
      prestamo.fecha = new Date(req.body.fecha);
      prestamo.funcionario = req.body.funcionario;
      prestamo.nombreFuncionario = req.body.nombreFuncionario;
      prestamo.monto = req.body.monto;
      prestamo.moneda = req.body.moneda;
      prestamo.inicioPago = req.body.inicioPago;
      prestamo.cuotas = req.body.cuotas;

      prestamo
        .save()
        .then(prestamo => {
          res.json("Update complete");
        })
        .catch(err => {
          res.status(400).send("unable to update the database");
        });
    }
  });
});

// // Defined delete | remove | destroy route
prestamoRoutes.route("/delete/:id").delete(function(req, res) {
  Prestamo.findByIdAndRemove({ _id: req.params.id }, function(err, item) {
    if (err) res.json(err);
    else res.json("Successfully removed");
  });
});

module.exports = prestamoRoutes;
