var express = require("express");
var subsidiaryRoutes = express.Router();

// Require Item model in our routes module
var Subsidiary = require("./subsidiary");
var Employee = require("../employee/employee");

// Defined store route
subsidiaryRoutes.route("/add").post(function (req, res) {
  var subsidiary = new Subsidiary(req.body);
  subsidiary
    .save()
    .then(item => {
      res.status(200).json({ item: "Item added successfully" });
    })
    .catch(err => {
      res.status(400).send(err);
    });
});

// Defined get data(index or listing) route
subsidiaryRoutes.route("/").get(function (req, res) {
  Subsidiary.find({ active: true }, function (err, subsidiary) {
    if (err) {
      console.log(err);
    } else {
      res.json(subsidiary);
    }
  });
});

// // Defined edit route
subsidiaryRoutes.route("/edit/:id").get(function (req, res) {
  var id = req.params.id;
  Subsidiary.findById(id, function (err, subsidiary) {
    res.json(subsidiary);
  });
});

// //  Defined update route
subsidiaryRoutes.route("/update/:id").put(function (req, res) {
  Subsidiary.findById(req.params.id, function (err, subsidiary) {
    if (!subsidiary) return next(new Error("Could not load Document"));
    else {
      subsidiary.name = req.body.nombre;
      subsidiary.startingTime = req.body.startingTime;
      subsidiary.endTime = req.body.endTime;
      subsidiary.phone = req.body.phone;

      subsidiary
        .save()
        .then(subsidiary => {
          res.json("Update complete");
        })
        .catch(err => {
          res.status(400).send("unable to update the database");
        });
    }
  });
});

// // Defined delete | remove | destroy route
subsidiaryRoutes.route("/delete/:id").delete(function (req, res) {
  var subsidiaries = [];
  Employee.distinct("subsidiary", function (err, response) {
    console.log(response);
    subsidiaries = response;

    allowDelete = subsidiaries.findIndex(subsidiary => {
      //probar en casa porque parece que da problema.. en la comparacion
      console.log(typeof subsidiary, typeof req.params.id);
      return subsidiary.toHexString() === req.params.id;
    });
    console.log("Resultado", allowDelete);

    if (allowDelete === -1) {
      Subsidiary.findByIdAndRemove({ _id: req.params.id }, function (
        err,
        subsidiaryRemoved
      ) {
        if (err) res.json(err);
        else res.status(200).send("Successfully removed");
      });
    } else {
      Employee.find({ sucursal: req.params.id, activo: true }, function (
        err,
        employees
      ) {
        if (err) console.log(err);

        if (employees.length > 0) {
          res
            .status(403)
            .send(
              "No es posible Eliminar el registro ya que existen empleados en esta sucursal"
            );
        } else {
          Subsidiary.update(
            { _id: req.params.id },
            { $set: { activo: false } },
            function (err, subsidiary) {
              if (err) return res.status(400).send;

              res.status(200).send("Updated susscesfully");
            }
          );
        }
      });
    }
  });
});

module.exports = subsidiaryRoutes;
