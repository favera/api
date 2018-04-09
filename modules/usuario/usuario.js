const mongoose = require("mongoose");
const validator = require("validator");
// var crypto = require("crypto");
var jwt = require("jsonwebtoken");
var Schema = mongoose.Schema;

var Usuario = new Schema({
  email: {
    type: String,
    unique: true,
    required: true,
    trim: true,
    minlength: 1,
    validate: {
        validator: validator.isEmail,
        message: "Is not a valid Email"
    }
  },
  password: {
      type: String,
      required: true,
      minlength: 6
  },
  tokens: [{
    access: {
        type: String,
        required: true
    },
    token: {
        type: String,
        required: true
    }
  }],
//   nombre: {
//     type: String,
//     required: true
//   },
//   hash: String,
//   salt: String
},
{
    collation: "usuarios"
});

Usuario.method.generateAuthToken = function(){
    var user = this;
    var access = 'auth';
    var token = jwt.sign({_id: user._id.toHexString(), access}, 'abc123').toString();
    user.tokens = user.tokens.concat([{access, token}]);

    return user.save().then(() => {
        return token;
    });
}

// Usuario.methods.setPassword = function(password) {
//   this.salt = crypto.randomBytes(16).toString("hex");
//   this.hash = crypto
//     .pbkdf2Sync(password, this.salt, 1000, 64, "sha512")
//     .toString("hex");
// };

// Usuario.methods.generateJwt = function() {
//   var expiry = new Date();
//   expiry.setDate(expiry.getDate() + 7);

//   return jwt.sign(
//     {
//       _id: this._id,
//       email: this.email,
//       name: this.name,
//       exp: parseInt(expiry.getTime() / 1000)
//     },
//     "MY_SECRET"
//   ); // DO NOT KEEP YOUR SECRET IN THE CODE!
// };

module.exports = mongoose.model("Usuario", Usuario);