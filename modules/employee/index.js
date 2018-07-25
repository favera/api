// itemRoutes.js

var express = require("express");
var employeeRoutes = express.Router();

// Require Item model in our routes module
var Employee = require("./employee");

// Defined store route
employeeRoutes.route("/add").post(function (req, res) {
  var employee = new Employee(req.body);
  employee
    .save()
    .then(item => {
      res.status(200).json({ item: "Item added successfully" });
    })
    .catch(err => {
      res.status(400).send(err);
    });
});

//return all funcionarios
employeeRoutes.route("/full-list").get(function (req, res) {
  Employee.find({ active: true }).then(result => {
    res.json(result);
  });
});

// Defined get data(index or listing) route
employeeRoutes.route("/").get(function (req, res) {
  var query = { active: true };
  if (req.query.search && req.query.search !== "null") {
    query = {
      active: true,
      name: { $regex: req.query.search, $options: "i" }
    };
  }
  console.log("Resultado query", query);
  var options = {
    sort: { name: 1 },
    populate: { path: "subsidiary" },
    lean: true,
    page: parseInt(req.query.page),
    limit: parseInt(req.query.limit)
  };
  Employee.paginate(query, options).then(result => {
    res.json(result);
  });
});

// // Defined edit route
employeeRoutes.route("/edit/:id").get(function (req, res) {
  var id = req.params.id;
  Employee.findById(id, function (err, employee) {
    res.json(employee);
  });
});

// //  Defined update route
employeeRoutes.route("/update/:id").put(function (req, res) {
  Employee.findById(req.params.id, function (err, employee) {
    if (!employee) return next(new Error("Could not load Document"));
    else {
      employee.name = req.body.name;
      employee.acnro = req.body.acnro;
      employee.active = req.body.active;
      employee.workingHours = req.body.workingHours;
      employee.admissionDate = req.body.admissionDate;
      employee.ips = req.body.ips;
      employee.halfTime = req.body.halfTime;
      employee.coin = req.body.coin;
      employee.identityNumber = req.body.identityNumber;
      employee.salary = req.body.salary;
      employee.salaryPerMinute = req.body.salaryPerMinute;
      employee.subsidiary = req.body.subsidiary;

      employee
        .save()
        .then(employee => {
          res.json("Update complete");
        })
        .catch(err => {
          res.status(400).send("unable to update the database");
        });
    }
  });
});

//deactivate employee
employeeRoutes.route("/deactivate/:id").put(function (req, res) {
  Employee.update({ _id: req.params.id }, { $set: { active: false } }, function (
    err,
    employee
  ) {
    if (err) return res.status(400).send;

    res.status(200).send("Updated susscesfully");
  });
});

employeeRoutes.route("/update-vacation/:id").put(function (req, res) {
  Employee.findById(req.params.id, function (err, employee) {
    if (err || !employee) res.status(400).send(err);
    if (!req.body.active) {
      var index = employee.vacations.indexOf(req.body.vacations);
      if (index > -1) {
        employee.vacations.splice(index, 1);
      }
    } else {
      employee.vacations.push(req.body.vacations);
    }

    employee
      .save()
      .then(employee => {
        res.status(200).send("Update complete");
      })
      .catch(err => {
        res.status(400).send(err);
      });
  });
});

module.exports = employeeRoutes;
