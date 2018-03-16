// itemRoutes.js

var express = require("express");
var app = express();
var itemRoutes = express.Router();

// Require Item model in our routes module
var Item = require("../models/Item");

// Defined store route
itemRoutes.route("/add").post(function(req, res) {
  var item = new Item(req.body);
  item
    .save()
    .then(item => {
      res.status(200).json({ item: "Item added successfully" });
    })
    .catch(err => {
      res.status(400).send("unable to save to database");
    });
});

// Defined get data(index or listing) route
itemRoutes.route("/").get(function(req, res) {
  Item.find(function(err, items) {
    if (err) {
      console.log(err);
    } else {
      res.json(items);
    }
  });
});

// Defined edit route
itemRoutes.route("/edit/:id").get(function(req, res) {
  var id = req.params.id;
  Item.findById(id, function(err, item) {
    res.json(item);
  });
});

//  Defined update route
itemRoutes.route("/update/:id").post(function(req, res) {
  Item.findById(req.params.id, function(err, item) {
    if (!item) return next(new Error("Could not load Document"));
    else {
      item.name = req.body.name;
      item.price = req.body.price;

      item
        .save()
        .then(item => {
          res.json("Update complete");
        })
        .catch(err => {
          res.status(400).send("unable to update the database");
        });
    }
  });
});

// Defined delete | remove | destroy route
itemRoutes.route("/delete/:id").get(function(req, res) {
  Item.findByIdAndRemove({ _id: req.params.id }, function(err, item) {
    if (err) res.json(err);
    else res.json("Successfully removed");
  });
});

module.exports = itemRoutes;

/***** ejemplo del comentario en stack */
//** index.js */

var sucursal = require("./sucursal");
var express = require("express");

var app = (module.exports = express());

app.post("/sucursales", (req, res) => {
  sucursal.create(req.body, function(err, sucursal) {
    if (err) return next(err); // do something on error
    res.json(sucursal); // return user json if ok
  });
});

app.get("/sucursales", (req, res) => {
  //var query = { nombre: "MDL BOX" };
  sucursal.list({}, function(err, listSuc) {
    if (err) return res.send(err);
    res.json(listSuc);
  });
});

/** modelo */
var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var sucursalSchema = new Schema({
  nombre: {
    type: String,
    required: true
  },
  horaEntrada: {
    type: Date,
    required: true
  },
  horaSalida: {
    type: Date,
    required: true
  },
  telefono: {
    type: String
  }
});

var SucursalModel = mongoose.model("Sucursal", sucursalSchema);

var sucursal = {
  create: function(data, callback) {
    var newSucurusal = new SucursalModel({
      nombre: data.nombre,
      horaEntrada: data.horaEntrada,
      horaSalida: data.horaSalida,
      telefono: data.telefono
    });
    newSucurusal.save(function(err, savedSucursal) {
      // some logic here
      callback(err, savedSucursal);
    });
  },
  list: function(data, callback) {
    SucursalModel.find({}, function(err, listSucursal) {
      // some logic here
      console.log(listSucursal);
      callback(err, listSucursal);
    });
  }
};

module.exports = {
  create: sucursal.create,
  list: sucursal.list
};
