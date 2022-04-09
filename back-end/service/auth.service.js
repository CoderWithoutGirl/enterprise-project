const Jwt = require("jsonwebtoken");
const User = require("../model/user");
const RefreshToken = require("../model/refresh-token.model");
const crypto = require("crypto");
const {sendNewEmail} = require('../queue/email.queue')
const { inviteUser } = require("../documents/index");

const randomTokenString = () => {
  return crypto.randomBytes(40).toString("hex");
};

const signToken = (payload) => {
  return Jwt.sign(
    {
      issuer: "enterprice-project-v1",
      subject: payload,
    },
    process.env.SECRET_KEY,
    {
      expiresIn: "64800s",
    }
  );
};

const generateRefreshToken = async (user, ipAddress) => {
  const newRefreshToken = new RefreshToken({
    user,
    token: randomTokenString(),
    createdByIp: ipAddress,
    expiredDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
  });
  await newRefreshToken.save();
  return newRefreshToken;
};

const getRefreshToken = async (token) => {
  const refreshTokenInDb = await RefreshToken.findOne({ token }).populate(
    "user"
  );
  if (!refreshTokenInDb || !refreshTokenInDb.isActive) {
    throw new Error("Invalid Refresh Token");
  } else {
    return refreshTokenInDb;
  }
};

//TODO: CHange Revoke token function
const revokeToken = async (token) => {
  await RefreshToken.findOneAndDelete({token})
};

const refreshJwtToken = async (token) => {
  const refreshToken = await getRefreshToken(token);
  const { user } = refreshToken;
  // generate new jwt
  const jwtToken = signToken(user?.username);

  // return basic details and tokens
  return {
    token: jwtToken,
  };
};

const register = async (registerAccount, origin) => {
  const { username, password, confirmPassword } = registerAccount;
  const checkAccountExistedInDb = await User.findOne({ username });
  if (checkAccountExistedInDb) {
    throw new Error("Account already exists");
  } 
  else {
    try {
      const createAccount = new User({
        ...registerAccount,
        email: username,
        role: process.env.STAFF,
      });
      await createAccount.save();
      sendNewEmail({
        to: username,
        subject: "Congratulations, Your account is here!",
        html: inviteUser(
          createAccount.fullname,
          `${origin}/login`,
          username,
          process.env.DEFAULT_PASSWORD
        ),
      });
      return createAccount;
    } catch (error) {
      if (error.name === "ValidationError") {
        let errors = {};

        Object.keys(error.errors).forEach((key) => {
          errors[key] = error.errors[key].message;
        });
        console.log(errors);

        throw new Error(errors);
      }
    }
  }
};

module.exports = {
  register,
  signToken,
  generateRefreshToken,
  refreshJwtToken,
  revokeToken,
};
