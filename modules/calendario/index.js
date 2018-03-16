// itemRoutes.js

var express = require("express");
var eventoRoutes = express.Router();

// Require Item model in our routes module
var Evento = require("./evento");

// Defined store route
eventoRoutes.route("/add").post(function(req, res) {
  if (req.body.tipoEvento === "vacaciones") {
    req.body.fechaInicio = new Date(req.body.fechaInicio);
    req.body.fechaFin = new Date(req.body.fechaFin);
  }
  if (req.body.tipoEvento === "feriado") {
    console.log("entro en feriado");
    req.body.fechaFeriado = new Date(req.body.fechaFeriado);
  }
  var evento = new Evento(req.body);
  evento
    .save()
    .then(item => {
      console.log(item);
      // res.status(200).json({ item: "Item added successfully" });
      res.json(item);
    })
    .catch(err => {
      res.status(400).send("unable to save to database");
    });
});

// Defined get data(index or listing) route
eventoRoutes.route("/").get(function(req, res) {
  //console.log(req);
  var query = {};
  if (req.query.search) {
    query = { nombre: { $regex: req.query.search, $options: "i" } };
  }
  console.log("Resultado query", query);
  var options = {
    sort: { nombre: 1 },
    populate: { path: "funcionario" },
    lean: true,
    page: parseInt(req.query.page),
    limit: parseInt(req.query.limit)
  };
  Evento.paginate(query, options).then(result => {
    // result.docs = result.docs.filter(function(evento) {
    //   return evento.sucursal != null;
    // });
    res.json(result);
  });

  /* var perPage = 10,
    page = Math.max(0, req.query.page);

  Evento.find(query)
    .limit(perPage)
    .skip(perPage * page)
    .populate({
      path: "sucursal",
      match: { nombre: "MDL BOX" }
    })
    .exec(function(err, eventos) {
      if (err) {
        console.log(err);
      } else {
        // eventos = eventos.filter(function(evento) {
        //   return evento.sucursal != null;
        // });
        res.json(eventos);
      }
    });*/
});

// // Defined edit route
eventoRoutes.route("/edit/:id").get(function(req, res) {
  var id = req.params.id;
  Evento.findById(id, function(err, evento) {
    res.json(evento);
  });
});

// //  Defined update route
eventoRoutes.route("/update/:id").put(function(req, res) {
  if (req.body.tipoEvento === "vacaciones") {
    req.body.fechaInicio = new Date(req.body.fechaInicio);
    req.body.fechaFin = new Date(req.body.fechaFin);
  }
  if (req.body.tipoEvento === "feriado") {
    //console.log("entro en feriado");
    req.body.fechaFeriado = new Date(req.body.fechaFeriado);
  }
  Evento.findById(req.params.id, function(err, evento) {
    if (!evento) return next(new Error("Could not load Document"));
    else {
      evento.tipoEvento = req.body.tipoEvento;
      evento.fechaInicio = req.body.fechaInicio;
      evento.fechaFin = req.body.fechaFin;
      evento.fechaFeriado = req.body.fechaFeriado;
      evento.funcionario = req.body.funcionario;

      evento
        .save()
        .then(evento => {
          res.json("Update complete");
        })
        .catch(err => {
          res.status(400).send("unable to update the database");
        });
    }
  });
});

// // Defined delete | remove | destroy route
eventoRoutes.route("/delete/:id").delete(function(req, res) {
  Evento.findByIdAndRemove({ _id: req.params.id }, function(err, evento) {
    if (err) res.json(err);
    else res.json("Successfully removed");
  });
});

module.exports = eventoRoutes;
