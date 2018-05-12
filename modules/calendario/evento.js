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
    fechaInicio: {
      type: Date,
      validate: {
        validator: function(valor){
          if(!valor && this.tipoEvento === "vacaciones"){
            return false;
          }
        },
        message: "El campo es requerido"
      }
    },
    fechaFin: {
      type: Date,
      validate: {
        validator: function(valor){
          if(!valor && this.tipoEvento === "vacaciones"){
            return false;
          }
        },
        message: "El campo es requerido"
      }
    },
    fechaFeriado: {
      type: Date,
      index: true,
      unique: true,
      validate: {
        validator: function(valor){
          if(!valor && this.tipoEvento === "feriado"){
            return false;
          }
        },
        message: "El campo es requerido"
      }
    },
    motivoFeriado: {
      type: String,
      validate: {
        validator: function(valor){
          if(!valor && this.tipoEvento === "feriado"){
            return false;
          }
        },
        message: "El campo es requerido"
      }
    },
    funcionario: {
      type: Schema.Types.ObjectId,
      ref: "Funcionario",
      validate: {
        validator: function(valor){
          if(!valor && this.tipoEvento === "vacaciones"){
            return false;
          }
        },
        message: "El campo es requerido"
      }
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
