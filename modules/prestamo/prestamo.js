var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var mongoosePaginate = require("mongoose-paginate");

var Prestamo = new Schema(
  {
    fecha: {
      type: Date,
      required: true
    },
    funcionario: {
      type: Schema.Types.ObjectId,
      ref: "Funcionario",
      required: true
    },
    nombreFuncionario: {
      type: String
    },
    monto: {
      type: String,
      required: true
    },
    moneda: {
      type: String,
      required: true
    },
    inicioPago: {
      type: Date,
      required: true
    },
    nroCuotas: {
      type: Number,
      required: true
    },
    cuotas: [
      {
        vencimiento: {
          type: Date,
          required: true
        },
        monto: {
          type: String
        },
        moneda: {
          type: String
        },
        estado: {
          type: String
        }
      }
    ]
  },
  {
    collection: "prestamos"
  }
);
Prestamo.plugin(mongoosePaginate);

module.exports = mongoose.model("Prestamo", Prestamo);
