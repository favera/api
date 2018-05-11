var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var mongoosePaginate = require("mongoose-paginate");

// Define collection and schema for Events
var Evento = new Schema(
  {
    tipoEvento: {
      type: String,
      required: true
    },
    fechaInicio: { type: Date, required: true },
    fechaFin: { type: Date, required: true },
    fechaFeriado: { type: Date, index: true, unique: true },
    motivoFeriado: {
      type: String,
      required: true
    },
    funcionario: {
      type: Schema.Types.ObjectId,
      ref: "Funcionario",
      required: true
    },
    nombreFuncionario: {
      type: String
    },
    activo: {
      type: Boolean,
      required: true,
      default: true
    }
  },
  {
    collection: "eventos"
  }
);

Evento.plugin(mongoosePaginate);

module.exports = mongoose.model("Evento", Evento);
