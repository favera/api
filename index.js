var express = require("express");
var bodyParser = require("body-parser");
var cors = require("cors");
const _ = require("lodash");
//var proxy = require('http-proxy-middleware');

var mongoose = require("./config/mongoose");

var app = express();

const port = process.env.PORT || 3000;

//app.use(bodyParser.json());
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));
//hace visible en el response del header x-auth
app.use(cors({
  exposedHeaders: 'x-auth'
}));

// var sucursal = require("./modules/sucursal/index");
var auth  = require("./midlewares/authenticate");
var usuarios = require("./modules/usuario/index");
var test = require("./modules/sucursal/index");
var funcionario = require("./modules/funcionario/index");
var evento = require("./modules/calendario/index");
var asistencia = require("./modules/asistencia/index");
var adelanto = require("./modules/adelanto/index");
var prestamo = require("./modules/prestamo/index");
var Usuario = require("./modules/usuario/usuario");

// proxy({target: 'http://chiprx.itaipu:8080', changeOrigin: true})

app.use("/sucursales", auth, test);
app.use("/funcionarios", auth, funcionario);
app.use("/eventos", auth, evento);
app.use("/asistencias", auth, asistencia);
app.use("/adelantos", auth, adelanto);
app.use("/prestamos", auth, prestamo);
app.use("/users", usuarios);

app.post("/users/login", (req, res)=>{
  var body = _.pick(req.body, ['email', 'password'])

  Usuario.findByCredentials(body.email, body.password).then((user)=>{
    //res.send(user);
    return user.generateAuthToken().then((token)=>{
      console.log(token);
      res.header('x-auth', token).send(user);
    })
  }).catch((e)=> {
    res.status(400).send();
  })
  
})
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
