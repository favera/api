// itemRoutes.js

var express = require("express");
var funcionarioRoutes = express.Router();

// Require Item model in our routes module
var Funcionario = require("./funcionario");

// Defined store route
funcionarioRoutes.route("/add").post(function(req, res) {
  var funcionario = new Funcionario(req.body);
  funcionario
    .save()
    .then(item => {
      res.status(200).json({ item: "Item added successfully" });
    })
    .catch(err => {
      res.status(400).send("unable to save to database");
    });
});

//return all funcionarios
funcionarioRoutes.route("/full-list").get(function(req, res) {
  Funcionario.find({ activo: true }).then(result => {
    res.json(result);
  });
});

// Defined get data(index or listing) route
funcionarioRoutes.route("/").get(function(req, res) {
  console.log(req.search);
  var query = { activo: true };
  if (req.search) {
    query = {
      activo: true,
      nombre: { $regex: req.query.search, $options: "i" }
    };
  }
  console.log("Resultado query", query);
  var options = {
    sort: { nombre: 1 },
    populate: { path: "sucursal" },
    lean: true,
    page: parseInt(req.query.page),
    limit: parseInt(req.query.limit)
  };
  Funcionario.paginate(query, options).then(result => {
    // result.docs = result.docs.filter(function(funcionario) {
    //   return funcionario.sucursal != null;
    // });
    res.json(result);
  });

  /* var perPage = 10,
    page = Math.max(0, req.query.page);

  Funcionario.find(query)
    .limit(perPage)
    .skip(perPage * page)
    .populate({
      path: "sucursal",
      match: { nombre: "MDL BOX" }
    })
    .exec(function(err, funcionarios) {
      if (err) {
        console.log(err);
      } else {
        // funcionarios = funcionarios.filter(function(funcionario) {
        //   return funcionario.sucursal != null;
        // });
        res.json(funcionarios);
      }
    });*/
});

// // Defined edit route
funcionarioRoutes.route("/edit/:id").get(function(req, res) {
  var id = req.params.id;
  Funcionario.findById(id, function(err, funcionario) {
    res.json(funcionario);
  });
});

// //  Defined update route
funcionarioRoutes.route("/update/:id").put(function(req, res) {
  Funcionario.findById(req.params.id, function(err, funcionario) {
    if (!funcionario) return next(new Error("Could not load Document"));
    else {
      funcionario.nombre = req.body.nombre;
      funcionario.acnro = req.body.acnro;
      funcionario.activo = req.body.activo;
      funcionario.cargaLaboral = req.body.cargaLaboral;
      funcionario.fechaIngreso = req.body.fechaIngreso;
      funcionario.ips = req.body.ips;
      funcionario.medioTiempo = req.body.medioTiempo;
      funcionario.moneda = req.body.moneda;
      funcionario.nroCedula = req.body.nroCedula;
      funcionario.salario = req.body.salario;
      funcionario.salarioMinuto = req.body.salarioMinuto;
      funcionario.sucursal = req.body.sucursal;
      funcionario.tipoHoraExtra = req.body.tipoHoraExtra;

      funcionario
        .save()
        .then(funcionario => {
          res.json("Update complete");
        })
        .catch(err => {
          res.status(400).send("unable to update the database");
        });
    }
  });
});

//deactivate employee
funcionarioRoutes.route("/deactivate/:id").put(function(req, res) {
  Funcionario.update({_id: req.params.id}, {$set: {activo: false}}, function(err, funcionario){
    if(err) return res.status(400).send;

    res.status(200).send("Updated susscesfully");
  })
  
});

funcionarioRoutes.route("/update-vacation/:id").put(function(req, res) {
  Funcionario.findById(req.params.id, function(err, funcionario) {
    if (!funcionario) return next(new Error("Could not load Document"));
    else {
      funcionario.vacaciones = req.body.vacaciones;

      funcionario
        .save()
        .then(funcionario => {
          res.json("Update complete");
        })
        .catch(err => {
          res.status(400).send("unable to update the database");
        });
    }
  });
});

// // Defined delete | remove | destroy route
// itemRoutes.route("/delete/:id").get(function(req, res) {
//   Item.findByIdAndRemove({ _id: req.params.id }, function(err, item) {
//     if (err) res.json(err);
//     else res.json("Successfully removed");
//   });
// });

module.exports = funcionarioRoutes;
