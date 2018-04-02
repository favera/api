var express = require("express");
var bodyParser = require("body-parser");
var cors = require("cors");
//var proxy = require('http-proxy-middleware');

var mongoose = require("./config/mongoose");

var app = express();

const port = process.env.PORT || 3000;

//app.use(bodyParser.json());
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));
app.use(cors());

// var sucursal = require("./modules/sucursal/index");

var test = require("./modules/sucursal/index");
var funcionario = require("./modules/funcionario/index");
var evento = require("./modules/calendario/index");
var asistencia = require("./modules/asistencia/index");
var adelanto = require("./modules/adelanto/index");
var prestamo = require("./modules/prestamo/index");

// proxy({target: 'http://chiprx.itaipu:8080', changeOrigin: true})

app.use("/sucursales", test);
app.use("/funcionarios", funcionario);
app.use("/eventos", evento);
app.use("/asistencias", asistencia);
app.use("/adelantos", adelanto);
app.use("/prestamos", prestamo);
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

app.get("/", (req, res) => {
  res.send("<h1> Hello! <h1/>");
});

app.listen(port, () => {
  console.log(`Started up at port ${port}`);
});

module.exports = { app };
