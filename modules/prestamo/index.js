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
      res.status(400).send(err);
    });
});

//return loan of period dates
prestamoRoutes.route("/loan-period").get(function(req, res) {
  Prestamo.find({
    "cuotas.vencimiento": { $gte: req.query.inicio, $lte: req.query.fin }
  })
    .then(result => {
      res.json(result);
    })
    .catch(e => res.status(400).send(e));
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
  //console.log(req);
  var inicio, fin;
  var query = {};
  console.log(req.query.busqueda, req.query.inicio, req.query.fin);
  if (req.query.inicio !== "null") {
    console.log("fecha Inicio", req.query.inicio);
    inicio = new Date(req.query.inicio);
  }

  if (req.query.fin !== "null") {
    console.log("fecha Fin", req.query.fin);
    fin = new Date(req.query.fin);
  }

  if (req.query.busqueda === "null") {
    req.query.busqueda = null;
  }

  //si todos los parametros son enviados
  if (req.query.busqueda && inicio && fin) {
    query = {
      "cuotas.vencimiento": { $gte: inicio, $lte: fin },
      nombreFuncionario: { $regex: req.query.busqueda, $options: "i" }
    };
  }

  //si campo busqueda es nulo, pero fecha inicio y fin no es nulo
  if (!req.query.busqueda && inicio && fin) {
    console.log("query utilizada", inicio, fin);
    query = { "cuotas.vencimiento": { $gte: inicio, $lte: fin } };
  }

  //busqueda es nulo, y fecha fin tambien, se le asigna la fecha de hoy
  if (!req.query.busqueda && inicio && !fin) {
    query = { "cuotas.vencimiento": { $gte: inicio, $lte: new Date() } };
  }

  if (req.query.busqueda && inicio && !fin) {
    query = {
      "cuotas.vencimiento": { $gte: inicio, $lte: new Date() },
      nombreFuncionario: { $regex: req.query.busqueda, $options: "i" }
    };
  }

  if (req.query.busqueda && !inicio && !fin) {
    query = {
      nombreFuncionario: { $regex: req.query.busqueda, $options: "i" }
    };
  }
  console.log("Resultado query", query);
  var options = {
    sort: { nombreFuncionario: 1 }, //populate: { path: "funcionario" },
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
    if (err) res.status(400).send(err);
    else res.status(200).send("Successfully removed");
  });
});

module.exports = prestamoRoutes;
