var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var BancoHoras = new Schema(
  {
    funcionario: {
      type: Schema.Types.ObjectId,
      ref: "Funcionario",
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
    collection: "banco_horas"
  }
);

module.exports = mongoose.model("bancoHoras", BancoHoras);
