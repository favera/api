var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var BancoHoras = new Schema(
  {
    funcionarioId: {
      type: Schema.Types.ObjectId,
      ref: "Funcionario",
      required: true
    },
    bancoHoras: {
      type: String,
      required: true
    }
  },
  {
    collection: "banco_horas"
  }
);

module.exports = mongoose.model("bancoHoras", BancoHoras);
