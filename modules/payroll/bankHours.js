var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var BankHour = new Schema(
  {
    employee: {
      type: Schema.Types.ObjectId,
      ref: "Employee",
      required: true
    },
    hours: {
      type: Number,
      required: true
    },
    totalMinutes: {
      type: Number,
      required: true
    },
    minutes: {
      type: Number,
      required: true
    }
  },
  {
    collection: "bank_hours"
  }
);

module.exports = mongoose.model("bankHours", BankHour);
