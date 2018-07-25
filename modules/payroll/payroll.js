var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var mongoosePaginate = require("mongoose-paginate");

var Payroll = new Schema(
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
    lendingIdentifiers: [],
    salaryDetail: [
      {
        employee: {
          type: Schema.Types.ObjectId,
          ref: "Employee"
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
        absence: {
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
        },
        salarySummary: [
          {
            date: {
              type: String
            },
            description: {
              type: String
            },
            amount: {
              type: String
            },
            coin: {
              type: String
            }
          }
        ]
      }
    ]
  },
  {
    collection: "Payroll"
  }
);
Payroll.index({ month: 1, year: 1 }, { unique: true });
Payroll.plugin(mongoosePaginate);
module.exports = mongoose.model("Payroll", Payroll);
