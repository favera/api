// itemRoutes.js

var express = require("express");
var adelantoRoutes = express.Router();

// Require Item model in our routes module
var Adelanto = require("./adelanto");

// Defined store route
adelantoRoutes.route("/add").post(function(req, res) {
  if (req.body.fecha) {
    req.body.fecha = new Date(req.body.fecha);
  }
  var adelanto = new Adelanto(req.body);
  adelanto
    .save()
    .then(item => {
      res.status(200).json({ item: "Item added successfully" });
    })
    .catch(err => {
      res.status(400).send("unable to save to database");
    });
});

//return all adelantos
adelantoRoutes.route("/full-list").get(function(req, res) {
  Adelanto.find().then(result => {
    res.json(result);
  });
});

// Defined get data(index or listing) route
adelantoRoutes.route("/").get(function(req, res) {
  //console.log(req);
  var query = {};
  if (req.query.search) {
    query = { nombre: { $regex: req.query.search, $options: "i" } };
  }
  console.log("Resultado query", query);
  var options = {
    sort: { nombre: 1 },
    populate: { path: "funcionario"},
    lean: true,
    page: parseInt(req.query.page),
    limit: parseInt(req.query.limit)
  };
  Adelanto.paginate(query, options).then(result => {
    // result.docs = result.docs.filter(function(adelanto) {
    //   return adelanto.sucursal != null;
    // });
    res.json(result);
  });

  /* var perPage = 10,
    page = Math.max(0, req.query.page);

  adelanto.find(query)
    .limit(perPage)
    .skip(perPage * page)
    .populate({
      path: "sucursal",
      match: { nombre: "MDL BOX" }
    })
    .exec(function(err, adelantos) {
      if (err) {
        console.log(err);
      } else {
        // adelantos = adelantos.filter(function(adelanto) {
        //   return adelanto.sucursal != null;
        // });
        res.json(adelantos);
      }
    });*/
});

// // Defined edit route
adelantoRoutes.route("/edit/:id").get(function(req, res) {
  var id = req.params.id;
  Adelanto.findById(id, function(err, adelanto) {
    res.json(adelanto);
  });
});

// //  Defined update route
adelantoRoutes.route("/update/:id").put(function(req, res) {
  Adelanto.findById(req.params.id, function(err, adelanto) {
    if (!adelanto) return next(new Error("Could not load Document"));
    else {
      adelanto.fecha = new Date(req.body.fecha);
      adelanto.tipoAdelanto = req.body.tipoAdelanto;
      adelanto.funcionario = req.body.funcionario;
      adelanto.monto = req.body.monto;
      adelanto.moneda = req.body.moneda;

      adelanto
        .save()
        .then(adelanto => {
          res.json("Update complete");
        })
        .catch(err => {
          res.status(400).send("unable to update the database");
        });
    }
  });
});

//deactivate employee
// adelantoRoutes.route("/deactivate/:id").put(function(req, res) {
//   Adelanto.findById(req.params.id, function(err, adelanto) {
//     if (!adelanto) return next(new Error("Could not load Document"));
//     else {
//       adelanto.activo = req.body.activo;

//       adelanto
//         .save()
//         .then(adelanto => {
//           res.json("Update complete");
//         })
//         .catch(err => {
//           res.status(400).send("unable to update the database");
//         });
//     }
//   });
// });

 // Defined delete | remove | destroy route
adelantoRoutes.route("/delete/:id").delete(function(req, res) {
  Adelanto.findByIdAndRemove({ _id: req.params.id }, function(err, item) {
    if (err) res.json(err);
    else res.json("Successfully removed");
  });
});

module.exports = adelantoRoutes;
