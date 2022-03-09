const mongoose = require('mongoose');
const CryptoJS = require('crypto-js');

const UserSchema = new mongoose.Schema(
  {
    username: { type: String, required: true },
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
    department: { type: String, required: false },
    gender: {
      type: String,
      required: true,
      enum: ["Male", "Female", "Unkown"],
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
      default: process.env.STAFF,
    },
    avatar: String,
  },
  { timestamps: true }
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

const UserModel = mongoose.model("Users", UserSchema);

module.exports = UserModel;
