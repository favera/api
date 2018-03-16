var mongoose = require("mongoose");
var Schema = mongoose.Schema;

// Define collection and schema for Items
var Sucursal = new Schema(
  {
    nombre: {
      type: String,
      required: true
    },
    horaEntrada: {
      type: String,
      required: true
    },
    horaSalida: {
      type: String,
      required: true
    },
    telefono: {
      type: String
    }
  },
  {
    collection: "sucursales"
  }
);

module.exports = mongoose.model("Sucursal", Sucursal);
