// itemRoutes.js

var express = require("express");
var eventoRoutes = express.Router();

// Require Item model in our routes module
var Evento = require("./evento");

// Defined store route
eventoRoutes.route("/add").post(function(req, res) {
  // if (req.body.tipoEvento === "vacaciones") {
  //   req.body.fechaInicio = new Date(req.body.fechaInicio);
  //   req.body.fechaFin = new Date(req.body.fechaFin);
  // }
  // if (req.body.tipoEvento === "feriado") {
  //   console.log("entro en feriado");
  //   req.body.fechaFeriado = new Date(req.body.fechaFeriado);
  // }
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

//retorna los feriados del anho
eventoRoutes.route("/feriados").get(function(req, res) {
  console.log("Entro en feriados");
  // console.log(req);
  var inicio, fin;
  if (req.query.inicio && req.query.fin) {
    inicio = new Date(req.query.inicio);
    fin = new Date(req.query.fin);
  }
  console.log(req.query.inicio, req.query.fin);
  Evento.find({
    fechaFeriado: { $gte: inicio, $lte: fin }
  }).exec(function(err, eventos) {
    if (err) {
      console.log(err);
      res.status(400).send("Unable to find feriados");
    } else {
      res.json(eventos);
    }
  });
  // Evento.find().then((err, feriados) => {
  //   console.log(feriados);
  //   if (err) res.status(400).send("Unable to find feriados");
  //   res.status(200).send(feriados);
  // });
});

//retorna los feriados y vacaciones del mes actual
eventoRoutes.route("/full-list").get(function(req, res) {
  var inicio, fin;
  if (req.query.inicio && req.query.fin) {
    inicio = new Date(req.query.inicio);
    fin = new Date(req.query.fin);
  }
  //mongoose query
  const query = Evento.find();
  console.log("Entro query mongoose");

  query
    .or([
      {
        fechaFeriado: { $gte: inicio, $lte: fin }
      },
      { fechaInicio: { $gte: inicio, $lte: fin } },
      { fechaFin: { $gte: inicio, $lte: fin } }
    ])
    .populate("funcionario")
    .exec(function(err, evento) {
      if (err) console.log(err);
      else res.json(evento);
    });

  // Evento.find({
  //   fechaFeriado: { $gte: inicio, $lte: fin }
  // }).exec(function(err, eventos) {
  //   if (err) {
  //     console.log(err);
  //   } else {
  //     res.json(eventos);
  //   }
  // });
});

// Defined get data(index or listing) route
eventoRoutes.route("/").get(function(req, res) {
  //console.log(req);
  var query = {};
  if (req.query.tipoEvento) {
    query = { tipoEvento: req.query.tipoEvento };
  }

  if (req.query.busqueda !== "null") {
    query = {
      tipoEvento: req.query.tipoEvento,
      $or: [
        { nombreFuncionario: { $regex: req.query.busqueda, $options: "i" } },
        { motivoFeriado: { $regex: req.query.busqueda, $options } }
      ]
    };
  }
  console.log("Resultado query", query);
  var options = {
    sort: { nombre: 1 },
    // populate: { path: "funcionario" },
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
      evento.motivoFeriado = req.body.motivoFeriado;
      evento.funcionario = req.body.funcionario;
      evento.nombreFuncionario = req.body.nombreFuncionario;

      evento
        .save()
        .then(evento => {
          res.json(evento);
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
