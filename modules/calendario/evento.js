var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var mongoosePaginate = require("mongoose-paginate");
var moment = require("moment");

// Define collection and schema for Events
var Event = new Schema(
  {
    eventType: {
      type: String,
      required: true
    },
    startDate: {
      type: Date,
      validate: [
        {
          validator: function(startDate) {
            if (!startDate && this.eventType === "vacaciones") {
              return false;
            }
          },
          message: "El campo es requerido"
        },
        {
          validator: function(startDate) {
            if (moment(startDate).isAfter(this.endDate)) {
              return false;
            }
          },
          message: "La fecha inicio debe ser anterior a fecha fin"
        }
      ]
    },
    endDate: {
      type: Date,
      validate: [
        {
          validator: function(endDate) {
            if (!endDate && this.eventType === "vacaciones") {
              return false;
            }
          },
          message: "El campo es requerido"
        },
        {
          validator: function(endDate) {
            if (moment(endDate).isBefore(this.startDate)) {
              return false;
            }
          },
          message: "La fecha fin debe ser posterior a fecha inicio"
        }
      ]
    },
    holidayDate: {
      type: Date,
      index: true,
      unique: true,
      sparse: true,
      validate: {
        validator: function(value) {
          if (!value && this.eventType === "feriado") {
            return false;
          }
        },
        message: "El campo es requerido"
      }
    },
    holidayDescription: {
      type: String,
      validate: {
        validator: function(value) {
          if (!value && this.eventType === "feriado") {
            return false;
          }
        },
        message: "El campo es requerido"
      }
    },
    employee: {
      type: Schema.Types.ObjectId,
      ref: "Employee",
      validate: {
        validator: function(value) {
          if (!value && this.eventType === "vacaciones") {
            return false;
          }
        },
        message: "El campo es requerido"
      }
    },
    employeeName: {
      type: String
    },
    active: {
      type: Boolean,
      required: true,
      default: true
    }
  },
  {
    collection: "events"
  }
);

Event.plugin(mongoosePaginate);

module.exports = mongoose.model("Event", Event);
