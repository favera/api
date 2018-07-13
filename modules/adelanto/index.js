var express = require("express");
var advanceRoutes = express.Router();
//importar ObjectID para consultas
var ObjectID = require("mongodb").ObjectID;
// Require Item model in our routes module
var Advance = require("./adelanto");

// Defined store route
advanceRoutes.route("/add").post(function(req, res) {
  if (req.body.date) {
    req.body.date = new Date(req.body.date);
  }
  var advance = new Advance(req.body);
  advance
    .save()
    .then(item => {
      res.status(200).json({ item: "Item added successfully" });
    })
    .catch(err => {
      res.status(400).send(err);
    });
});

//return all adelantos
advanceRoutes.route("/full-list").get(function(req, res) {
  Advance.find().then(result => {
    res.json(result);
  });
});

//return monthly advance
advanceRoutes.route("/monthly-advance").get(function(req, res) {
  Advance.find({
    date: { $gte: req.query.startDate, $lte: req.query.endDate }
  })
    .then(result => {
      res.json(result);
    })
    .catch(e => console.log(e));
});

// Defined get data(index or listing) route
advanceRoutes.route("/").get(function(req, res) {
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
      date: { $gte: startDate, $lte: endDate },
      employeeName: { $regex: req.query.parameter, $options: "i" }
    };
  }

  //si campo busqueda es nulo, pero fecha inicio y fin no es nulo
  if (!req.query.parameter && startDate && endDate) {
    query = { date: { $gte: startDate, $lte: endDate } };
  }

  //busqueda es nulo, y fecha fin tambien, se le asigna la fecha de hoy
  if (!req.query.parameter && startDate && !endDate) {
    query = { date: { $gte: startDate, $lte: new Date() } };
  }

  if (req.query.parameter && startDate && !endDate) {
    query = {
      date: { $gte: startDate, $lte: new Date() },
      employeeName: { $regex: req.query.parameter, $options: "i" }
    };
  }

  if (req.query.parameter && !startDate && !endDate) {
    query = {
      employeeName: { $regex: req.query.parameter, $options: "i" }
    };
  }
  var options = {
    sort: { _id: -1 },
    populate: { path: "employee" },
    lean: true,
    page: parseInt(req.query.page),
    limit: parseInt(req.query.limit)
  };
  Advance.paginate(query, options).then(result => {
    res.json(result);
  });
});

// // Defined edit route
advanceRoutes.route("/edit/:id").get(function(req, res) {
  var id = req.params.id;
  Advance.findById(id, function(err, advance) {
    res.json(advance);
  });
});

// //  Defined update route
advanceRoutes.route("/update/:id").put(function(req, res) {
  Advance.findById(req.params.id, function(err, advance) {
    if (!advance) return next(new Error("Could not load Document"));
    else {
      advance.date = new Date(req.body.date);
      advance.advanceType = req.body.advanceType;
      advance.employee = req.body.employee;
      advance.employeeName = req.body.employeeName;
      advance.monto = req.body.monto;
      advance.moneda = req.body.moneda;

      advance
        .save()
        .then(advance => {
          res.json("Update complete");
        })
        .catch(err => {
          res.status(400).send("unable to update the database");
        });
    }
  });
});

// Defined delete | remove | destroy route
advanceRoutes.route("/delete/:id").delete(function(req, res) {
  Advance.findByIdAndRemove({ _id: req.params.id }, function(err, item) {
    if (err) res.json(err);
    else res.json("Successfully removed");
  });
});

module.exports = advanceRoutes;
