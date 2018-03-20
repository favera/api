var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var mongoosePaginate = require("mongoose-paginate");

// this.marcacion.fecha = marcacion.fecha;
// this.marcacion.funcionarioId = marcacion.empleadoId;
// this.marcacion.nombreFuncionario = this.nombreFuncionario(
//   marcacion.empleadoId
// );
// this.marcacion.entrada = false;
// this.marcacion.salida = false;
// this.marcacion.horasTrabajadas = false;
// this.marcacion.horasExtras = false;
// this.marcacion.horasFaltantes = false;
// this.marcacion.observacion = "Vacaciones";
// this.marcacion.estilo.ausente = false;
// this.marcacion.estilo.incompleto = false;
// this.marcacion.estilo.vacaciones = true;

var Asistencia = new Schema(
  {
    fecha: {
      type: Date
    },
    entrada: {
      type: String
    },
    salida: {
      type: String
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
