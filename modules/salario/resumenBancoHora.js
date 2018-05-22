var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var ResumenBancoHora = new Schema(
  {
    funcionario: {
      type: Schema.Types.ObjectId,
      ref: "funcionario",
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
        horas: {
          type: String,
          required: true
        },
        observacion: {
          type: String,
          required: true
        }
      }
    ]
  },
  {
    collection: "resumen_banco_hora"
  }
);

module.exports = mongoose.model("ResumenBancoHora", ResumenBancoHora);
