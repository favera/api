var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var mongoosePaginate = require("mongoose-paginate");
var moment = require("moment");

// Define collection and schema for Events
var Evento = new Schema(
  {
    tipoEvento: {
      type: String,
      required: true
    },
    fechaInicio: {
      type: Date,
      validate: [
        {
          validator: function(fechaInicio) {
            if (!fechaInicio && this.tipoEvento === "vacaciones") {
              return false;
            }
          },
          message: "El campo es requerido"
        },
        {
          validator: function(fechaInicio) {
            if (moment(fechaInicio).isAfter(this.fechaFin)) {
              return false;
            }
          },
          message: "La fecha inicio debe ser anterior a fecha fin"
        }
      ]
    },
    fechaFin: {
      type: Date,
      validate: [
        {
          validator: function(fechaFin) {
            if (!fechaFin && this.tipoEvento === "vacaciones") {
              return false;
            }
          },
          message: "El campo es requerido"
        },
        {
          validator: function(fechaFin) {
            if (moment(fechaFin).isBefore(this.fechaInicio)) {
              return false;
            }
          },
          message: "La fecha fin debe ser posterior a fecha inicio"
        }
      ]
    },
    fechaFeriado: {
      type: Date,
      index: true,
      unique: true,
      sparse: true,
      validate: {
        validator: function(valor) {
          if (!valor && this.tipoEvento === "feriado") {
            return false;
          }
        },
        message: "El campo es requerido"
      }
    },
    motivoFeriado: {
      type: String,
      validate: {
        validator: function(valor) {
          if (!valor && this.tipoEvento === "feriado") {
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
        validator: function(valor) {
          if (!valor && this.tipoEvento === "vacaciones") {
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
