var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var Salario = new Schema(
  {
    month: {
      type: String,
      required: true
    },
    year: {
      type: String,
      required: true
    },
    salarioDetail: [
      {
        funcionario: {
          type: Schema.Types.ObjectId,
          ref: "Funcionario"
          // required: true
        },
        horasMes: {
          type: String
          // required: true
        },
        horasTrabajadas: {
          type: String
          // required: true
        },
        bancoHorasMes: {
          type: String
          // required: true
        },
        retrasos: {
          type: String
          // required: true
        },
        salarioBase: {
          type: String
          // required: true
        },
        ips: {
          type: String
          // required: true
        },
        descuentos: {
          type: String
          // required: true
        },
        horasExtras: {
          type: String
          // required: true
        },
        adelantos: {
          type: String
          // required: true
        },
        prestamos: {
          type: String
          // required: true
        },
        salarioNeto: {
          type: String
          // required: true
        }
      }
    ]
  },
  {
    collection: "salario"
  }
);

module.exports = mongoose.model("Salario", Salario);
