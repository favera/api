// itemRoutes.js

var express = require("express");
var eventRoutes = express.Router();

var ObjectId = require("mongoose").Types.ObjectId;
var moment = require("moment");

// Require Item model in our routes module
var Event = require("./event");

// Defined store route
eventRoutes.route("/add").post(function (req, res) {
  //diferencia en dias de las vacaciones (fechaFin - FechaInicio) para que sea positivo
  var diffVacations = moment(req.body.endDate).diff(req.body.startDate, "days");
  var validateVacationsDate;
  //busca eventos activos del empleado, todos los registros relacionados a el.
  Event.find({
    employee: ObjectId(req.body.employee),
    active: true
  }).exec(function (err, employeeEvents) {
    if (err) res.status(400).send(err);
    //diferencia en dias de las vacaciones ya existentes (fechaFin - FechaInicio) para que sea positivo
    employeeEvents.forEach(empEvent => {
      var diffExistingVacations = moment(empEvent.endDate).diff(
        empEvent.startDate,
        "days"
      );
      //si la diferencia de las vacaciones a guardar es mayor de las vacaciones existentes, ingresa al if y calcula la diferencia entre los dias
      //para sumarle a la fechaInicio de las vacaciones, y verificar si la fecha con la diferencia sumada se encuentra en el rango de las fechas de las
      //vacaciones ya existentes, entonces sera un rango invalido de fechas.
      if (diffVacations > diffExistingVacations) {
        var days = diffVacations - diffExistingVacations;
        var validateVacationDate = moment(req.body.startDate).add(days, "days");
        if (
          moment(validateVacationDate).isBetween(
            empEvent.startDate,
            empEvent.endDate,
            null,
            "[]"
          )
        ) {
          return (validateVacationsDate =
            "Ya existe vacaciones dentro de ese periodo");
        }
      } else {
        //Verifica que la fechaInicio o La FechaFinal recibida, no pertenezca al rango de fechas de las vacaciones existentes
        if (
          moment(req.body.startDate).isBetween(
            empEvent.startDate,
            empEvent.endDate,
            null,
            "[]"
          ) ||
          moment(req.body.endDate).isBetween(
            empEvent.startDate,
            empEvent.endDate,
            null,
            "[]"
          )
        ) {
          return (validateVacationsDate =
            "Ya existe vacaciones dentro de ese periodo");
        }
      }
    });

    if (validateVacationsDate) {
      res.status(400).send(validateVacationsDate);
    } else {
      var event = new Event(req.body);
      event
        .save()
        .then(item => {
          res.json(item);
        })
        .catch(err => {
          res.status(400).send(err);
        });
    }
  });
});
//retorna las vacaciones del funcionario que se pasa
eventRoutes.route("/employee-vacation/:id").get(function (req, res) {
  Event.find({ employee: new ObjectId(req.params.id), active: true }).exec(
    function (err, vacations) {
      if (err) res.status(400).send(err);
      res.status(200).send(vacations);
    }
  );
});

//retorna los feriados anuales
eventRoutes.route("/holidays").get(function (req, res) {
  var startDate, endDate;
  if (req.query.startDate && req.query.endDate) {
    startDate = new Date(req.query.startDate);
    endDate = new Date(req.query.endDate);
  }
  Event.find({
    holidayDate: { $gte: startDate, $lte: endDate }
  }).exec(function (err, events) {
    if (err) {
      res.status(400).send("Unable to find holidays");
    } else {
      res.json(events);
    }
  });
});

//retorna los feriados y vacaciones del mes actual
eventRoutes.route("/full-list").get(function (req, res) {
  var startDate, endDate;
  if (req.query.startDate && req.query.endDate) {
    startDate = new Date(req.query.startDate);
    endDate = new Date(req.query.endDate);
  }
  //mongoose query
  const query = Event.find();
  //query por fecha feriado o por fechaInicio y FechaFin de vacaciones
  query
    .or([
      {
        holidayDate: { $gte: startDate, $lte: endDate }
      },
      { startDate: { $gte: startDate, $lte: endDate } },
      { endDate: { $gte: startDate, $lte: endDate } }
    ])
    .populate("employee")
    .exec(function (err, event) {
      if (err) console.log(err);
      else res.json(event);
    });
});

//Desactivar vacaciones una vez culminadas
eventRoutes.route("/deactivate-vacation/:id").get(function (req, res) {
  Event.update({ _id: req.params.id }, { $set: { active: false } }, function (
    err,
    event
  ) {
    if (err) res.status(400).send(err);
    res.status(200).send("Updated sucessfully");
  });
});

// Listado de Eventos
eventRoutes.route("/").get(function (req, res) {
  var query = {};
  // if (req.query.eventType) {
  //   query = { eventType: req.query.eventType };
  // }

  if (req.query.parameter !== "null") {
    query = {
      // eventType: req.query.eventType,
      $or: [
        { eventType: { $regex: req.query.parameter, $options: "i" } },
        { employeeName: { $regex: req.query.parameter, $options: "i" } },
        { holidayDescription: { $regex: req.query.parameter, $options: "i" } }
      ]
    };
  }
  var options = {
    sort: { name: 1 },
    lean: true,
    page: parseInt(req.query.page),
    limit: parseInt(req.query.limit)
  };
  Event.paginate(query, options).then(result => {
    res.json(result);
  });
});

//Lista de funcionarios en vacaciones del mes
eventRoutes.route("/event-per-month").get(function (req, res) {
  query = {
    $and: [{ eventType: req.query.eventType }, {
      $or: {
      }
    }]
  }
})

// // Defined edit route
eventRoutes.route("/edit/:id").get(function (req, res) {
  var id = req.params.id;
  Event.findById(id, function (err, event) {
    res.json(event);
  });
});

// //  Defined update route
eventRoutes.route("/update/:id").put(function (req, res) {
  if (req.body.eventType === "vacaciones") {
    req.body.startDate = new Date(req.body.startDate);
    req.body.endDate = new Date(req.body.endDate);
  }
  if (req.body.eventType === "feriado") {
    //console.log("entro en feriado");
    req.body.holidayDate = new Date(req.body.holidayDate);
  }
  Event.findById(req.params.id, function (err, event) {
    if (!event) return res.status(400).send("Unable to find event");
    else {
      event.eventType = req.body.eventType;
      event.startDate = req.body.startDate;
      event.endDate = req.body.endDate;
      event.holidayDate = req.body.holidayDate;
      event.holidayDescription = req.body.holidayDescription;
      event.employee = req.body.employee;
      event.employeeName = req.body.employeeName;
      event.remark = req.body.remark;

      event
        .save()
        .then(event => {
          res.json(event);
        })
        .catch(err => {
          res.status(400).send("unable to update the database");
        });
    }
  });
});

// // Defined delete | remove | destroy route
eventRoutes.route("/delete/:id").delete(function (req, res) {
  Event.findByIdAndRemove({ _id: req.params.id }, function (err, event) {
    if (err) res.json(err);
    else res.json("Successfully removed");
  });
});

module.exports = eventRoutes;
