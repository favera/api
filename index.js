var express = require("express");
var bodyParser = require("body-parser");
var cors = require("cors");

var mongoose = require("./config/mongoose");

var app = express();

app.use(bodyParser.json());
app.use(cors());

// var sucursal = require("./modules/sucursal/index");

var test = require("./modules/sucursal/index");
var funcionario = require("./modules/funcionario/index");
var evento = require("./modules/calendario/index");
var asistencia = require("./modules/asistencia/index");

app.use("/sucursales", test);
app.use("/funcionarios", funcionario);
app.use("/eventos", evento);
app.use("/asistencias", asistencia);
// app.use(sucursal);

// var blogSchema = new Schema({
//   title: String,
//   author: String
// });

// var Blog = mongoose.model("Blog", blogSchema);

// app.post("/blogs", (req, res) => {
//   var blog = new Blog({
//     title: req.body.title,
//     author: req.body.author
//   });

//   blog.save().then(
//     doc => {
//       res.send(doc);
//     },
//     e => {
//       res.send(e);
//     }
//   );
// });

// app.get("/blogs", (req, res) => {
//   Blog.find().then(
//     blogs => {
//       res.send({ blogs });
//     },
//     e => {
//       res.status(400).send();
//     }
//   );
// });

app.listen(3000, () => console.log("Started on port 3000"));

module.exports = { app };
