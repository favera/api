var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var mongoosePaginate = require("mongoose-paginate");

var Attendance = new Schema(
  {
    date: {
      type: Date,
      required: true
    },
    entryTime: {
      type: String
      //required: true
    },
    exitTime: {
      type: String
      //required: true
    },
    employee: {
      type: Schema.Types.ObjectId,
      ref: "Employee",
      required: true
    },
    employeeName: {
      type: String
    },
    workedHours: {
      type: String
    },
    extraHours: {
      type: String
    },
    delay: {
      type: String
    },
    remark: {
      type: String
    },
    payExtraHours: {
      type: Boolean,
      default: false
    },
    payHoliday: {
      type: Boolean,
      default: false
    },
    hourBank: {
      type: Boolean,
      default: false
    },
    secondShift: {
      type: Boolean,
      default: false,
      required: true
    },
    status: {
      absence: {
        type: Boolean,
        default: false
      },
      incomplete: {
        type: Boolean,
        default: false
      },
      vacation: {
        type: Boolean,
        default: false
      }
    }
  },
  {
    collection: "attendances"
  }
);
Attendance.index({ date: 1, employee: 1 }, { unique: true });
Attendance.plugin(mongoosePaginate);

Attendance.statics.testPop = function (param) {
  var attendance = this;
  var result;

  return attendance
    .find({})
    .populate({
      path: "employee",
      match: { nombre: { $regex: param, $options: "i" } }
    })
    .exec(function (err, employee) {
      if (err) console.log(err);

      result = employee.filter(function (attendance) {
        return attendance.employee !== null;
      });
      console.log(result);
    });
};

module.exports = mongoose.model("Attendance", Attendance);
