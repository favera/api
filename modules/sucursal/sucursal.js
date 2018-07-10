var mongoose = require("mongoose");
var Schema = mongoose.Schema;

// Define collection and schema for Subsidiaries
var Subsidiary = new Schema(
  {
    name: {
      type: String,
      required: true
    },
    startingTime: {
      type: String,
      required: true
    },
    endTime: {
      type: String,
      required: true
    },
    phone: {
      type: String
    },
    active: {
      type: Boolean,
      default: true
    }
  },
  {
    collection: "subsidiaries"
  }
);

module.exports = mongoose.model("Subsidiary", Subsidiary);
