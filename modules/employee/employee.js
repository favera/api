var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var mongoosePaginate = require("mongoose-paginate");

var Employee = new Schema(
  {
    acnro: {
      type: String,
      required: true,
      index: true,
      unique: true
    },
    active: {
      type: Boolean,
      required: true
    },
    workingHours: {
      type: String,
      required: true
    },
    admissionDate: {
      type: String,
      required: true
    },
    ips: {
      type: String,
      required: true
    },
    halfTime: {
      type: Boolean,
      required: true
    },
    coin: {
      type: String,
      required: true
    },
    name: {
      type: String,
      required: true
    },
    identityNumber: {
      type: String,
      required: true
    },
    salary: {
      type: Number,
      required: true,
      validate: {
        validator: function(value) {
          return value > 0;
        },
        message: "Valor debe ser mayor a 0"
      }
    },
    salaryPerMinute: {
      type: Number,
      required: true
    },
    subsidiary: {
      type: Schema.Types.ObjectId,
      ref: "Subsidiary",
      required: true
    },
    vacations: {
      type: [String]
    }
  },
  {
    collection: "employees"
  }
);
Employee.plugin(mongoosePaginate);

module.exports = mongoose.model("Employee", Employee);
