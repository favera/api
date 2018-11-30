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
          type: Number
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
          type: Number
          // required: true
        },

        discount: {
          type: Number
          // required: true
        },
        extraHourValue: {
          type: Number
          // required: true
        },
        salaryBalance: {
          type: Number
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
              type: Number
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
    collection: "payroll"
  }
);
Payroll.index({ month: 1, year: 1 }, { unique: true });
Payroll.plugin(mongoosePaginate);
module.exports = mongoose.model("Payroll", Payroll);
