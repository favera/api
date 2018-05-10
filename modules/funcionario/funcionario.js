var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var mongoosePaginate = require("mongoose-paginate");

var Funcionario = new Schema(
  {
    acnro: {
      type: String,
      required: true
    },
    activo: {
      type: Boolean,
      required: true
    },
    cargaLaboral: {
      type: String,
      required: true
    },
    fechaIngreso: {
      type: String,
      required: true
    },
    ips: {
      type: String,
      required: true
    },
    medioTiempo: {
      type: Boolean,
      required: true
    },
    moneda: {
      type: String,
      required: true
    },
    nombre: {
      type: String,
      required: true
    },
    nroCedula: {
      type: String,
      required: true
    },
    salario: {
      type: String,
      required: true
    },
    salarioMinuto: {
      type: Number,
      required: true
    },
    sucursal: {
      type: Schema.Types.ObjectId,
      ref: "Sucursal"
    },
    tipoHoraExtra: {
      type: String,
      required: true
    },
    vacaciones: {
      type: [String]
    }
  },
  {
    collection: "funcionarios"
  }
);
Funcionario.plugin(mongoosePaginate);

module.exports = mongoose.model("Funcionario", Funcionario);
