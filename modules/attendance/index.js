// itemRoutes.js

var express = require("express");
var attendanceRoutes = express.Router();
var ObjectID = require("mongodb").ObjectID;

// Require Item model in our routes module
var Attendance = require("./attendance");

// Defined store route
attendanceRoutes.route("/add").post(function (req, res) {
  var attendance = new Attendance(req.body);

  attendance
    .save()
    .then(item => {
      res.status(200).json({ item: "Item added successfully" });
    })
    .catch(err => {
      res.status(400).send(err);
      // if (err.message.indexOf("duplicate key error") !== -1) {
      //   console.log(err);
      //   Asistencia.findOneAndUpdate(
      //     { funcionario: ObjectID(req.body.funcionario), fecha: new Date(req.body.fecha) },
      //     {
      //       $set: {
      //         employeeName: req.body.employeeName,
      //         entryTime: req.body.entryTime,
      //         exitTime: req.body.exitTime,
      //         workingHours: req.body.workingHours,
      //         horasExtras: req.body.horasExtras,
      //         horasFaltantes: req.body.horasFaltantes,
      //         observacion: req.body.observacion,
      //         status: req.body.status
      //       }
      //     },
      //     { new: true },
      //     function(err, asistenciaUpdated) {
      //       if (err) console.log(err);
      //       console.log(asistenciaUpdated);
      //       res/
      //         .status(200)
      //         .json({ asistenciaUpdated: "Actualizado con exito" });
      //     }
      //   );
      // } else {
      //   console.log(err);
      //   res.status(400).send("unable to save to database");
      // }
    });
});

// Defined store route
attendanceRoutes.route("/add-data").post(function (req, res) {
  // console.log(req.body);
  // console.log("END BODY");
  var dateAttSheet = req.body[0].date;
  var id;
  let attOfDate = [];
  Attendance.find({
    date: { $gte: dateAttSheet, $lte: dateAttSheet }
  })
    .populate("employee")
    .then(result => {
      attOfDate = result;
      console.log(JSON.stringify(attOfDate));

      if (attOfDate.length > 0) {
        // console.log("LENGHT MAYOR A CERO");
        attOfDate.forEach(attDate => {
          var indexAtt = req.body.findIndex(attBody => {
            if (attDate.employee._id == attBody.employee) {
              // console.log("entro en esta condicion");
              id = attDate._id;
              return true;
            }
            // return false;
          });
          console.log("INDICE", indexAtt);
          if (indexAtt !== -1) {
            req.body[indexAtt]._id = id;
          }
        });
      }

      // console.log("Despues del tema", req.body);

      const bulkAttendances = Attendance.collection.initializeUnorderedBulkOp();

      req.body.forEach(att => {
        if (typeof att.date === "string") {
          att.date = new Date(att.date);
        }
        att.employee = new ObjectID(att.employee);
        console.log("Indice de Asistencia", att._id);
        bulkAttendances
          .find({ _id: ObjectID(att._id) })
          .upsert()
          .replaceOne(att);
      });

      bulkAttendances
        .execute()
        .then(response => {
          res.status(200).send(response);
          // console.log(response);
        })
        .catch(err => res.status(400).send(err));
    })
    .catch(e => console.log(e));

  // var attendances = [];

  // req.body.forEach(att => {
  //   attendances.push({
  //     updateOne: {
  //       filter: { _id: ObjectID(att._id) },
  //       update: {
  //         $set: {
  //           // date: new Date(att.date),
  //           entryTime: att.entryTime,
  //           exitTime: att.exitTime,
  //           employee: att.employee,
  //           employeeName: att.employeeName,
  //           workingHours: att.workingHours,
  //           extraHours: att.extraHours,
  //           delay: att.delay,
  //           remark: att.remark,
  //           "status.absence": att.status.absence,
  //           "status.incomplete": att.status.incomplete,
  //           "status.vacations": att.status.vacations
  //         },
  //         $setOnInsert: {
  //           date: new Date(att.date),
  //           entryTime: att.entryTime,
  //           exitTime: att.exitTime,
  //           employee: att.employee,
  //           employeeName: att.employeeName,
  //           workingHours: att.workingHours,
  //           extraHours: att.extraHours,
  //           delay: att.delay,
  //           remark: att.remark,
  //           "status.absence": att.status.absence,
  //           "status.incomplete": att.status.incomplete,
  //           "status.vacations": att.status.vacations
  //         }
  //       },
  //       upsert: true
  //     }
  //   });
  // });

  // Attendance.collection
  //   .bulkWrite(attendances, { ordered: false })
  //   .then(response => {
  //     res.status(200).send("Data add succesfully");
  //   })
  //   .catch(err => res.status(400).send(err));

  // var attendances = [];
  // req.body.forEach(element => {
  //   if (element.date) {
  //     element.date = new Date(element.date);
  //     console.log(element);
  //     attendances.push(element);
  //   }
  // });

  // // console.log(JSON.stringify(attendances));
  // Attendance.insertMany(attendances)
  //   .then(docs => {
  //     attendances.length = 0;
  //     console.log("Response?", docs);
  //     res.status(200).json({ item: "Item added successfully" });
  //   })
  //   .catch(e => console.log("Error", e));
});

//return all asistencias
attendanceRoutes.route("/full-list").get(function (req, res) {
  var start, end;
  console.log(req.query.startDate, req.query.endDate);
  if (req.query.startDate && req.query.endDate) {
    start = new Date(req.query.startDate);
    end = new Date(req.query.endDate);
    console.log(start, end);
  }

  if (req.query.fechaPlanilla) {
    start = end = new Date(req.query.fechaPlanilla);
    console.log(start, end);
  }

  Attendance.find({
    date: { $gte: start, $lte: end }
  })
    .populate("employee")
    .then(result => {
      res.json(result);
    })
    .catch(e => console.log(e));
});

attendanceRoutes.route("/query-data").get(function (req, res) {
  var start, end;
  if (req.query.startDate) {
    start = new Date(req.query.startDate);
    console.log(start);
  }
  if (req.query.endDate) {
    end = new Date(req.query.endDate);
    console.log(end);
  }

  if (req.query.parameter === "null") {
    req.query.parameter = null;
  }

  //console.log(typeof req.query.busqueda);
  if (!req.query.parameter) {
    var query = {
      date: { $gte: start, $lte: end }
    };
  }

  if (req.query.status === "ausentes" && req.query.parameter) {
    console.log("ausentes e incompletos");
    var query = {
      $and: [
        { date: { $gte: start, $lte: end } },
        { "status.absence": { $eq: true } },
        {
          $or: [
            {
              employeeName: { $regex: req.query.parameter, $options: "i" }
            },
            { remark: { $regex: req.query.parameter, $options: "i" } }
          ]
        }
      ]
    };
  }

  if (req.query.status === "ausentes" && !req.query.parameter) {
    console.log("solo ausentes");
    var query = {
      date: { $gte: start, $lte: end },
      "status.absence": { $eq: true }
    };
  }

  if (req.query.status === "incompletos" && req.query.parameter) {
    console.log("incompletos y busqueda");
    var query = {
      $and: [
        { date: { $gte: start, $lte: end } },
        { "status.incomplete": { $eq: true } },
        {
          $or: [
            {
              employeeName: { $regex: req.query.parameter, $options: "i" }
            },
            { remark: { $regex: req.query.parameter, $options: "i" } }
          ]
        }
      ]
    };
  }

  if (req.query.status === "incompletos" && !req.query.parameter) {
    console.log("solo incompletos");
    var query = {
      date: { $gte: start, $lte: end },
      "status.incomplete": { $eq: true }
    };
  }

  if (req.query.status === "vacaciones" && req.query.parameter) {
    console.log("consulta vacaciones y busqueda");
    var query = {
      $and: [
        { date: { $gte: start, $lte: end } },
        { "status.vacations": { $eq: true } },
        {
          $or: [
            {
              employeeName: { $regex: req.query.parameter, $options: "i" }
            },
            { remark: { $regex: req.query.parameter, $options: "i" } }
          ]
        }
      ]
    };
  }

  if (req.query.status === "vacaciones" && !req.query.parameter) {
    var query = {
      date: { $gte: start, $lte: end },
      "status.vacations": { $eq: true }
    };
  }

  if (req.query.parameter && req.query.status === "todos") {
    console.log("Solo Busqueda");
    var query = {
      $and: [
        { date: { $gte: start, $lte: end } },
        {
          $or: [
            {
              employeeName: { $regex: req.query.parameter, $options: "i" }
            },
            { remark: { $regex: req.query.parameter, $options: "i" } }
          ]
        }
      ]
    };
  }

  var options = {
    populate: { path: "employee" },
    lean: true,
    page: parseInt(req.query.page),
    limit: parseInt(req.query.limit)
  };
  Attendance.paginate(query, options).then(result => {
    res.json(result);
  });
});

// Defined get data(index or listing) route
attendanceRoutes.route("/").get(function (req, res) {
  var query = {};
  if (req.query.search) {
    query = { nombre: { $regex: req.query.search, $options: "i" } };
  }
  console.log("Resultado query", query);
  var options = {
    sort: { nombre: 1 },
    populate: { path: "employee" },
    lean: true,
    page: parseInt(req.query.page),
    limit: parseInt(req.query.limit)
  };
  Attendance.paginate(query, options).then(result => {
    res.json(result);
  });
});

// // Defined edit route
attendanceRoutes.route("/edit/:id").get(function (req, res) {
  var id = req.params.id;
  Attendance.findById(id, function (err, attendance) {
    res.json(attendance);
  });
});

// //  Defined update route
attendanceRoutes.route("/update/:id").put(function (req, res) {
  Attendance.findById(req.params.id, function (err, attendance) {
    if (!attendance) return res.status(400).send("unable to get the field");
    else {
      attendance.date = new Date(req.body.date);
      attendance.entryTime = req.body.entryTime;
      attendance.exitTime = req.body.exitTime;
      attendance.employee = req.body.employee;
      attendance.employeeName = req.body.employeeName;
      attendance.workedHours = req.body.workedHours;
      attendance.extraHours = req.body.extraHours;
      attendance.delay = req.body.delay;
      attendance.remark = req.body.remark;
      attendance.status.absence = req.body.status.absence;
      attendance.status.incomplete = req.body.status.incomplete;
      attendance.status.vacations = req.body.status.vacations;
      attendance.secondShift = req.body.secondShift;

      attendance
        .save()
        .then(attendance => {
          res.json("Update complete");
        })
        .catch(err => {
          res.status(400).send("unable to update the database");
        });
    }
  });
});

//update field hora extra
attendanceRoutes.route("/update-overtime/:id").put(function (req, res) {
  Attendance.findById(req.params.id, function (err, attendance) {
    if (!attendance) {
      console.log("error");
    } else {
      attendance.payExtraHours = true;
      attendance.save(function (err, attendanceUpdated) {
        if (err) {
          console.log("error");
        }

        res.status(200).send(attendanceUpdated);
      });
    }
  });
});

//update field banco de hora
attendanceRoutes.route("/update-banktime/:id").put(function (req, res) {
  Attendance.findById(req.params.id, function (err, attendance) {
    if (!attendance) {
      console.log("error");
    } else {
      attendance.bankHour = true;
      attendance.save(function (err, attendanceUpdated) {
        if (err) {
          console.log("error");
        }

        res.status(200).send(attendanceUpdated);
      });
    }
  });
});

//Actualizar hora extra from resumen banco de hora
attendanceRoutes.route("/cancel-overtime/:id").put(function (req, res) {
  var query = req.params.id;
  var update = {
    $set: { extraHours: null, observacion: "No aceptable para banco de hora" }
  };
  var options = { new: true };
  Attendance.findByIdAndUpdate(query, update, options, function (
    err,
    attendance
  ) {
    if (err) {
      res.status(400).send(err);
    }
    res.status(200).send(attendance);
  });
});

//compensacion de retraso por banco de hora
attendanceRoutes.route("/amend-delay/:id").put(function (req, res) {
  var query = req.params.id;
  var update = {
    $set: {
      delay: req.body.delay,
      remark: "Compensacion de retraso por banco de hora"
    }
  };
  var options = { new: true };
  Attendance.findByIdAndUpdate(query, update, options, function (
    err,
    attendanceUpdated
  ) {
    if (err) {
      res.status(400).send(err);
    }
    res.status(200).send(attendanceUpdated);
  });
});

//query for dashboard return all delays
attendanceRoutes.route("/all-delays").get(function (req, res) {
  console.log(req.query.startDate, req.query.endDate);
  Attendance.find(
    //
    { date: { $gte: req.query.startDate, $lte: req.query.endDate } },
    { delay: { $ne: null } },
    function (err, attendances) {
      if (err) res.status(400).send(err);
      res.status(200).send(attendances);
    }
  );
});

// // Defined delete | remove | destroy route
attendanceRoutes.route("/delete/:id").delete(function (req, res) {
  Attendance.findByIdAndRemove({ _id: req.params.id }, function (err, item) {
    if (err) res.json(err);
    else res.json("Successfully removed");
  });
});

// attendanceRoutes.route("/test-pop").get(function(req, res) {
//   var options = {
//     page: 1,
//     limit: 10
//   };
//   Attendance.testPop(req.query.search)
//     .paginate({}, options)
//     .then(result => {
//       console.log("paginacion", result);
//       res.json(result);
//     })
//     .catch(e => console.log(e));
// });

module.exports = attendanceRoutes;
