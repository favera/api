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

// BancoHoras.post("findOneAndUpdate", function(next) {
//   var bancHora = this.getUpdate();
//   console.log("Primera impresion", bancHora.totalMinutes, this.funcionario);
//   bancHora.hours = Math.floor(bancHora.totalMinutes / 60);
//   console.log(bancHora.hours);
//   bancHora.minutes = Math.floor(bancHora.totalMinutes % 60);
//   console.log(bancHora.minutes);
//   next();
// });

module.exports = mongoose.model("bancoHoras", BancoHoras);
