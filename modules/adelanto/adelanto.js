var mongoose = require("mongoose");
var Schema = mongoose.Schema;
var mongoosePaginate = require("mongoose-paginate");

var Adelanto = new Schema(
  {
    fecha: {
      type: Date,
      required: true
    },
    funcionario: {
      type: Schema.Types.ObjectId,
      ref: "Funcionario"
    },
    nombreFuncionario: {
      type: String
    },
    tipoAdelanto: {
      type: String,
      required: true
    },
    moneda: {
      type: String,
      required: true
    },
    monto: {
      type: String,
      required: true
    }
  },
  {
    collection: "adelantos"
  }
);
Adelanto.plugin(mongoosePaginate);

module.exports = mongoose.model("Adelanto", Adelanto);
