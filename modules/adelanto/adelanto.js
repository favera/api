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
      ref: "Funcionario",
      required: true
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
      required: true,
      validate: {
        validator: function(value) {
          return value.split(".").join("") > 0;
        },
        message: "Valor debe ser mayor a 0"
      }
    }
  },
  {
    collection: "adelantos"
  }
);
Adelanto.plugin(mongoosePaginate);

module.exports = mongoose.model("Adelanto", Adelanto);
