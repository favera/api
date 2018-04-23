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
    fechaInicio: { type: Date },
    fechaFin: { type: Date },
    fechaFeriado: { type: Date },
    motivoFeriado: {
      type: String
    },
    funcionario: {
      type: Schema.Types.ObjectId,
      ref: "Funcionario"
    }
  },
  {
    collection: "eventos"
  }
);

Evento.plugin(mongoosePaginate);

module.exports = mongoose.model("Evento", Evento);
