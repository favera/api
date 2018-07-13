var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var mongoosePaginate = require("mongoose-paginate");

var SalaryAdvance = new Schema(
  {
    date: {
      type: Date,
      required: true
    },
    employee: {
      type: Schema.Types.ObjectId,
      ref: "Employee",
      required: true
    },
    employeeName: {
      type: String
    },
    advanceType: {
      type: String,
      required: true
    },
    coin: {
      type: String,
      required: true
    },
    amount: {
      type: Number,
      required: true,
      validate: {
        validator: function(value) {
          return value > 0;
        },
        message: "Valor debe ser mayor a 0"
      }
    }
  },
  {
    collection: "salaryAdvances"
  }
);
SalaryAdvance.plugin(mongoosePaginate);

module.exports = mongoose.model("SalaryAdvance", SalaryAdvance);
