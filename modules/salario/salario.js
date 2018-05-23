var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var mongoosePaginate = require("mongoose-paginate");

var Salario = new Schema(
  {
    month: {
      type: Date,
      required: true
    },
    year: {
      type: Date,
      required: true
    },
    status: {
      type: String,
      default: "Pendiente"
    },
    salaryDetail: [
      {
        employee: {
          type: Schema.Types.ObjectId,
          ref: "Funcionario"
          // required: true
        },
        monthHours: {
          type: String
          // required: true
        },
        workingHours: {
          type: String
          // required: true
        },
        hourBank: {
          type: String
          // required: true
        },
        delay: {
          type: String
          // required: true
        },
        salary: {
          type: String
          // required: true
        },
        ips: {
          type: String
          // required: true
        },
        discount: {
          type: String
          // required: true
        },
        extraHour: {
          type: String
          // required: true
        },
        advanceSalary: {
          type: String
          // required: true
        },
        lending: {
          type: String
          // required: true
        },
        netSalary: {
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

Salario.plugin(mongoosePaginate);
module.exports = mongoose.model("Salario", Salario);
