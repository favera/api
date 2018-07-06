var express = require("express");
var prestamoRoutes = express.Router();

// Require Prestamo model in our routes module
var Prestamo = require("./prestamo");

//Importando Object Id
var ObjectID = require("mongodb").ObjectID;

// Defined store route
prestamoRoutes.route("/add").post(function(req, res) {
  req.body.monto = parseInt(req.body.monto.split(".").join(""));
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

//retornar cuotas por funcionario y mes
prestamoRoutes.route("/employee-lending/:id").get(function(req, res) {
  var cuotaDate, vencimiento;
  var resultado = [];
  vencimiento = new Date(req.query.start);
  Prestamo.find(
    {
      funcionario: new ObjectID(req.params.id),
      "cuotas.vencimiento": { $gte: req.query.start, $lte: req.query.end }
    },
    function(err, lendings) {
      if (err) res.status(400).send(err);

      lendings.forEach(lending => {
        lending.cuotas.forEach(cuota => {
          cuotaDate = new Date(cuota.vencimiento);
          if (vencimiento.getMonth() === cuotaDate.getMonth()) {
            resultado.push(cuota);
          }
        });
      });
      res.status(200).send(resultado);
    }
  );
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
//Actualizar prestamos que fueron descontados en la planilla de salarios, en el body se pasa el array de los id de los prestamos
//actualizado desde Detalle Planilla.
prestamoRoutes.route("/update/lending/processed").put(function(req, res) {
  console.log(req.body);
  var result;
  req.body.forEach(lending => {
    Prestamo.update(
      { "cuotas._id": new ObjectID(lending) },
      { $set: { "cuotas.$.estado": "procesado" } },
      function(err, updatedLending) {
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
prestamoRoutes.route("/update/lending/paid").put(function(req, res) {
  Prestamo.update(
    { "cuotas.estado": "procesado" },
    { $set: { "cuotas.$.estado": "pagado" } },
    { multi: true },
    function(err, updatedItem) {
      if (err) res.status(400).send(err);
      res.status(200).send(updatedItem);
    }
  );
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
