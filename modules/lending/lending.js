var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var mongoosePaginate = require("mongoose-paginate");

var Lending = new Schema(
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
    amount: {
      type: Number,
      required: true,
      validate: {
        validator: function (value) {
          return value > 0;
        },
        message: "Valor debe ser mayor a 0"
      }
    },
    coin: {
      type: String,
      required: true
    },
    startMonth: {
      type: Date,
      required: true
    },
    installmentNumber: {
      type: Number,
      required: true
    },
    installments: [
      {
        dueDate: {
          type: Date,
          required: true
        },
        amount: {
          type: Number,
          validate: {
            validator: function (value) {
              return value > 0;
            },
            message: "Valor debe ser mayor a 0"
          }
        },
        coin: {
          type: String
        },
        state: {
          type: String
        }
      }
    ]
  },
  {
    collection: "lendings"
  }
);
Lending.plugin(mongoosePaginate);

module.exports = mongoose.model("Lending", Lending);
