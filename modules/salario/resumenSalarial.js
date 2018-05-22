var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var ResumenSalarial = new Schema(
  {
    funcionario: {
      type: Schema.Types.ObjectId,
      ref: "Funcionario",
      required: true
    },
    salario: {
      type: Schema.Types.ObjectId,
      ref: "Salario",
      required: true
    },
    movimientos: [
      {
        mov_id: {
          type: String,
          required: true
        },
        fecha: {
          type: Date,
          required: true
        },
        monto: {
          type: String,
          required: true
        },
        tipoMovimiento: {
          type: String,
          required: true
        }
      }
    ]
  },
  {
    collection: "resumen_salarial"
  }
);

module.exports = mongoose.model("ResumenSalarial", ResumenSalarial);
