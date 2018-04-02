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
      ref: "Funcionario",
      required: true
    },
    nombreFuncionario: {
      type: String
    },
    horasTrabajadas: {
      type: String
    },
    horasExtras: {
      type: String
    },
    horasFaltantes: {
      type: String
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
Asistencia.index({fecha: 1, funcionario: 1}, {unique: true})
Asistencia.plugin(mongoosePaginate);

module.exports = mongoose.model("Asistencia", Asistencia);
