var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var mongoosePaginate = require("mongoose-paginate");

var Asistencia = new Schema(
  {
    fecha: {
      type: Date,
      required: true
    },
    entrada: {
      type: String,
      required: true
    },
    salida: {
      type: String,
      required: true
    },
    funcionario: {
      type: Schema.Types.ObjectId,
      ref: "Funcionario"
    },
    nombreFuncionario: {
      type: String
    },
    horasTrabajadas: {
      type: String
      //required: true
    },
    horasExtras: {
      type: String
      //required: true
    },
    horasFaltantes: {
      type: String
      //required: true
    },
    observacion: {
      type: String
    },
    estilo: {
      ausente: {
        type: Boolean,
        default: false
      },
      incompleto: {
        type: Boolean,
        default: false
      },
      vacaciones: {
        type: Boolean,
        default: false
      }
    }
  },
  {
    collection: "asistencias"
  }
);
Asistencia.plugin(mongoosePaginate);

module.exports = mongoose.model("Asistencia", Asistencia);
