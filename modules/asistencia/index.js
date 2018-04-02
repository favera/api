// itemRoutes.js

var express = require("express");
var asistenciaRoutes = express.Router();

// Require Item model in our routes module
var Asistencia = require("./asistencia");

// Defined store route
asistenciaRoutes.route("/add").post(function(req, res) {
  if (req.body.fecha) {
    req.body.fecha = new Date(req.body.fecha);
  }

  var asistencia = new Asistencia(req.body);
 
    asistencia
    .save()
    .then(item => {
      res.status(200).json({ item: "Item added successfully" });
    })
    .catch(err => {
      if(err.message.indexOf('duplicate key error') !== -1){
        console.log(err);
        Asistencia.findOneAndUpdate({funcionario: req.body.funcionario}, {entrada: req.body.entrada}, {new: true}, function(err){
          if(err) console.log(err);
        })
      };
      //console.log(err);
      //res.status(400).send("unable to save to database");
    });
 
});

// Defined store route
asistenciaRoutes.route("/test-data").post(function(req, res) {
  console.log(req.body);
  console.log("END BODY");

  var asistencias = [];
  req.body.forEach(element => {
    if (element.fecha) {
      element.fecha = new Date(element.fecha);
      console.log(element);
      asistencias.push(element);
    }

    // var asistencia = new Asistencia(element);
    // asistencia
    //   .save()
    //   .then(item => {
    //     console.log(item);
    //     success = true;
    //     // res.status(200).json({ item: "Item added successfully" });
    //   })
    //   .catch(err => {
    //     console.log(err);
    //     // res.status(400).send("unable to save to database");
    //   });
  });

  console.log(JSON.stringify(asistencias));
  Asistencia.insertMany(asistencias)
    .then(docs => {
      asistencias.length = 0;
      console.log("Response?", docs);
      res.status(200).json({ item: "Item added successfully" });
    })
    .catch(e => console.log("Error", e));
  // console.log(success);
  // if (success) {
  //   res.status(200).json({ item: "Item added successfully" });
  // }
});

//return all asistencias
asistenciaRoutes.route("/full-list").get(function(req, res) {
  var inicio, fin;
  console.log(req.query.inicio);
  if (req.query.inicio && req.query.fin) {
    inicio = new Date(req.query.inicio);
    fin = new Date(req.query.fin);
    console.log(inicio, fin);
  }

  Asistencia.find({ fecha: { $gte: inicio, $lte: fin } })
    .then(result => {
      res.json(result);
    })
    .catch(e => console.log(e));
});

asistenciaRoutes.route("/query-data").get(function(req, res) {
  var inicio, fin;
  if (req.query.inicio) {
    inicio = new Date(req.query.inicio);
    console.log(inicio);
  }
  if (req.query.fin) {
    fin = new Date(req.query.fin);
    console.log(fin);
  }

  if (req.query.busqueda === "null") {
    req.query.busqueda = null;
  }

  //console.log(typeof req.query.busqueda);
  if (!req.query.busqueda) {
    console.log("Busqueda null");
    var query = {
      fecha: { $gte: inicio, $lte: fin }
    };
  }

  // $or: [
  //   { nombreFuncionario: { $regex: req.query.busqueda, $options: "i" } },
  //   { observacion: { $regex: req.query.busqueda, $options: "i" } }
  // ]

  if (req.query.estado === "ausentes" && req.query.busqueda) {
    console.log("ausentes e incompletos");
    var query = {
      $and: [
        { fecha: { $gte: inicio, $lte: fin } },
        { "estilo.ausente": { $eq: true } },
        {
          $or: [
            {
              nombreFuncionario: { $regex: req.query.busqueda, $options: "i" }
            },
            { observacion: { $regex: req.query.busqueda, $options: "i" } }
          ]
        }
      ]
    };
  }

  if (req.query.estado === "ausentes" && !req.query.busqueda) {
    console.log("solo ausentes");
    var query = {
      fecha: { $gte: inicio, $lte: fin },
      "estilo.ausente": { $eq: true }
    };
  }

  if (req.query.estado === "incompletos" && req.query.busqueda) {
    console.log("incompletos y busqueda");
    var query = {
      $and: [
        { fecha: { $gte: inicio, $lte: fin } },
        { "estilo.incompleto": { $eq: true } },
        {
          $or: [
            {
              nombreFuncionario: { $regex: req.query.busqueda, $options: "i" }
            },
            { observacion: { $regex: req.query.busqueda, $options: "i" } }
          ]
        }
      ]
    };
  }

  if (req.query.estado === "incompletos" && !req.query.busqueda) {
    console.log("solo incompletos");
    var query = {
      fecha: { $gte: inicio, $lte: fin },
      "estilo.incompleto": { $eq: true }
    };
  }

  if (req.query.estado === "vacaciones" && req.query.busqueda) {
    console.log("consulta vacaciones y busqueda");
    var query = {
      $and: [
        { fecha: { $gte: inicio, $lte: fin } },
        { "estilo.vacaciones": { $eq: true } },
        {
          $or: [
            {
              nombreFuncionario: { $regex: req.query.busqueda, $options: "i" }
            },
            { observacion: { $regex: req.query.busqueda, $options: "i" } }
          ]
        }
      ]
    };
  }

  if (req.query.estado === "vacaciones" && !req.query.busqueda) {
    var query = {
      fecha: { $gte: inicio, $lte: fin },
      "estilo.vacaciones": { $eq: true }
    };
  }

  if (req.query.busqueda && req.query.estado === "todos") {
    console.log("Solo Busqueda");
    var query = {
      $and: [
        { fecha: { $gte: inicio, $lte: fin } },
        {
          $or: [
            {
              nombreFuncionario: { $regex: req.query.busqueda, $options: "i" }
            },
            { observacion: { $regex: req.query.busqueda, $options: "i" } }
          ]
        }
      ]
    };
  }

  var options = {
    //populate: { path: "funcionario", select: "nombre" },
    lean: true,
    page: parseInt(req.query.page),
    limit: parseInt(req.query.limit)
  };
  Asistencia.paginate(query, options).then(result => {
    res.json(result);
  });
});

// Defined get data(index or listing) route
asistenciaRoutes.route("/").get(function(req, res) {
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
  Asistencia.paginate(query, options).then(result => {
    // result.docs = result.docs.filter(function(asistencia) {
    //   return asistencia.sucursal != null;
    // });
    res.json(result);
  });

  /* var perPage = 10,
    page = Math.max(0, req.query.page);

  Asistencia.find(query)
    .limit(perPage)
    .skip(perPage * page)
    .populate({
      path: "sucursal",
      match: { nombre: "MDL BOX" }
    })
    .exec(function(err, asistencias) {
      if (err) {
        console.log(err);
      } else {
        // asistencias = asistencias.filter(function(asistencia) {
        //   return asistencia.sucursal != null;
        // });
        res.json(asistencias);
      }
    });*/
});

// // Defined edit route
asistenciaRoutes.route("/edit/:id").get(function(req, res) {
  var id = req.params.id;
  Asistencia.findById(id, function(err, asistencia) {
    res.json(asistencia);
  });
});

// //  Defined update route
asistenciaRoutes.route("/update/:id").put(function(req, res) {
  Asistencia.findById(req.params.id, function(err, asistencia) {
    if (!asistencia) return next(new Error("Could not load Document"));
    else {
      asistencia.fecha = new Date(req.body.fecha);
      asistencia.entrada = req.body.entrada;
      asistencia.salida = req.body.salida;
      asistencia.funcionario = req.body.funcionario;
      asistencia.nombreFuncionario = req.body.nombreFuncionario;
      asistencia.horasTrabajadas = req.body.horasTrabajadas;
      asistencia.horasExtras = req.body.horasExtras;
      asistencia.horasFaltantes = req.body.horasFaltantes;
      asistencia.observacion = req.body.observacion;
      asistencia.estilo.ausente = req.body.estilo.ausente;
      asistencia.estilo.incompleto = req.body.estilo.incompleto;
      asistencia.estilo.vacaciones = req.body.estilo.vacaciones;

      asistencia
        .save()
        .then(asistencia => {
          res.json("Update complete");
        })
        .catch(err => {
          res.status(400).send("unable to update the database");
        });
    }
  });
});

//deactivate employee
// asistenciaRoutes.route("/deactivate/:id").put(function(req, res) {
//   Asistencia.findById(req.params.id, function(err, asistencia) {
//     if (!asistencia) return next(new Error("Could not load Document"));
//     else {
//       asistencia.activo = req.body.activo;

//       asistencia
//         .save()
//         .then(asistencia => {
//           res.json("Update complete");
//         })
//         .catch(err => {
//           res.status(400).send("unable to update the database");
//         });
//     }
//   });
// });

// // Defined delete | remove | destroy route
asistenciaRoutes.route("/delete/:id").delete(function(req, res) {
  Asistencia.findByIdAndRemove({ _id: req.params.id }, function(err, item) {
    if (err) res.json(err);
    else res.json("Successfully removed");
  });
});

module.exports = asistenciaRoutes;
