var express = require("express");
var bodyParser = require("body-parser");
var cors = require("cors");
const _ = require("lodash");

var mongoose = require("./config/mongoose");

var app = express();

const port = process.env.PORT || 3000;

//app.use(bodyParser.json());
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));
//hace visible en el response del header x-auth
app.use(
  cors({
    exposedHeaders: "x-auth"
  })
);

var auth = require("./midlewares/authenticate");
var users = require("./modules/user/index");
var subsidiaries = require("./modules/subsidiary/index");
var employees = require("./modules/employee/index");
var events = require("./modules/event/index");
var attendances = require("./modules/attendance/index");
var advances = require("./modules/advance/index");
var lendings = require("./modules/lending/index");
var User = require("./modules/user/user");
var payroll = require("./modules/payroll/index");

app.use("/subsidiaries", auth, subsidiaries);
app.use("/employees", auth, employees);
app.use("/events", auth, events);
app.use("/attendances", auth, attendances);
app.use("/advances", auth, advances);
app.use("/lendings", auth, lendings);
app.use("/payrolls", auth, payroll);
app.use("/users", users);

app.post("/users/login", (req, res) => {
  var body = _.pick(req.body, ["email", "password"]);

  User.findByCredentials(body.email, body.password)
    .then(user => {
      //res.send(user);
      return user.generateAuthToken().then(token => {
        // console.log(token);
        res.header("x-auth", token).send(user);
      });
    })
    .catch(e => {
      res.status(400).send();
    });
});

app.get("/", (req, res) => {
  res.send("<h1> Hello! <h1/>");
});

app.listen(port, () => {
  console.log(`Started up at port ${port}`);
});

module.exports = { app };
