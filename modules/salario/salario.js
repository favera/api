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
    detail: {
      type: Boolean,
      default: false
    },

    salaryDetail: [
      {
        employee: {
          type: Schema.Types.ObjectId,
          ref: "Funcionario"
          // required: true
        },
        name: {
          type: String
          // required: true
        },
        extraHourMinutes: {
          type: Number
          // required: true
        },
        delay: {
          type: Number
          // required: true
        },
        abscence: {
          type: Number
        },
        salary: {
          type: String
          // required: true
        },
        coin: {
          type: String
        },
        ips: {
          type: Number
          // required: true
        },
        salaryAdvance: {
          type: Number
        },
        lending: {
          type: String
          // required: true
        },
        discount: {
          type: Number
          // required: true
        },
        extraHourValue: {
          type: String
          // required: true
        },
        salaryBalance: {
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
Salario.index({ month: 1, year: 1 }, { unique: true });
Salario.plugin(mongoosePaginate);
module.exports = mongoose.model("Salario", Salario);
