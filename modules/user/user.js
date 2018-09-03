const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const _ = require("lodash");
var Schema = mongoose.Schema;

var User = new Schema(
  {
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
    name: {
      type: String,
      required: true,
      trim: true

    },
    username: {
      type: String,
      unique: true,
      required: true,
      trim: true

    },
    profile: {
      type: String,
      required: true
    },
    password: {
      type: String,
      required: true,
      minlength: 6
    },

    tokens: [
      {
        access: {
          type: String,
          required: true
        },
        token: {
          type: String,
          required: true
        }
      }
    ]
    //   nombre: {
    //     type: String,
    //     required: true
    //   },
    //   hash: String,
    //   salt: String
  },
  {
    collection: "users"
  }
);

User.methods.toJSON = function () {
  var user = this;
  var userObject = user.toObject();

  return _.pick(userObject, ["_id", "email"]);
};

User.methods.generateAuthToken = function () {
  var user = this;
  var access = "auth";
  var token = jwt
    .sign({ _id: user._id.toHexString(), access }, "abc123")
    .toString();
  user.tokens = user.tokens.concat([{ access, token }]);

  return user.save().then(() => {
    return token;
  });
};

User.pre("save", function (next) {
  var user = this;

  if (user.isModified("password")) {
    bcrypt.genSalt(10, function (err, salt) {
      bcrypt.hash(user.password, salt, function (err, hash) {
        if (err) console.log(err);
        user.password = hash;
        next();
      });
    });
  } else {
    next();
  }
});

User.statics.findByToken = function (token) {
  var User = this;
  var decoded, queryUser;

  try {
    decoded = jwt.verify(token, "abc123");
  } catch (error) {
    //retorna un promise para que no ejecute el codigo del queryUser
    return Promise.reject();
  }
  // console.log("Busquedas", decoded._id, token);
  queryUser = User.findOne({
    _id: decoded._id,
    "tokens.token": token,
    "tokens.access": "auth"
  });

  return queryUser;
};

User.statics.findByCredentials = function (email, password) {
  var User = this;

  return User.findOne({ email: email }).then(user => {
    if (!user) {
      return Promise.reject();
    }

    return new Promise((resolve, reject) => {
      bcrypt.compare(password, user.password, (err, res) => {
        if (res) {
          resolve(user);
        } else {
          reject();
        }
      });
    });
  });
};

User.methods.removeToken = function (token) {
  var user = this;
  return user.update({
    //$pull metodo de mongo debe que elimina de un array lo que le pasas en el objeto
    $pull: {
      tokens: {
        token: token
      }
    }
  });
};

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

module.exports = mongoose.model("User", User);
