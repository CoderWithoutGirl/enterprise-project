const mongoose = require("mongoose");
const CryptoJS = require("crypto-js");

const UserSchema = mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    fullname: { type: String, required: true },
    email: {
      type: String,
      required: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        "Please fill a valid email address",
      ],
    },
    dateOfBirth: { type: Date, required: true },
    address: { type: String, required: false },
    age: { type: Number, required: true },
    department: { type: Number, required: false },
    gender: {
      type: String,
      required: true,
      enum: ["male", "female", "unkown"],
    },
    role: {
      type: String,
      required: true,
      enum: [
        process.env.QACOORDINATOR,
        process.env.ADMIN,
        process.env.QAMANAGER,
        process.env.STAFF,
      ],
    },
    createdAt: { type: Date, required: true, default: Date.now },
  },
  { collection: "users" }
);

UserSchema.pre("save", async function (next) {
  try {
    const user = this;
    if (!user.isModified("password")) {
      next();
    }
    user.password = CryptoJS.AES.encrypt(
      user.password,
      process.env.ENCRYPT_KEY
    ).toString();
    next();
  } catch (error) {
    next(error);
  }
});

UserSchema.methods.validatePassword = async function (password, next) {
  try {
    const decrypted = CryptoJS.AES.decrypt(
      this.password,
      process.env.ENCRYPT_KEY
    );
    const rawPassword = decrypted.toString(CryptoJS.enc.Utf8);
    if (rawPassword === password) {
      return next(null, this);
    } else {
      return next(null, false);
    }
  } catch (error) {
    return next(error);
  }
};

UserSchema.set("toJSON", {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    // remove these props when object is serialized
    delete ret._id;
    delete ret.password;
  },
});

const UserModel = mongoose.model("user", UserSchema);

module.exports = UserModel;
