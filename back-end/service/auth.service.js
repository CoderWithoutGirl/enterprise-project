const Jwt = require("jsonwebtoken");
const User = require("../model/user");
const RefreshToken = require("../model/refresh-token.model");
const crypto = require("crypto");

const randomTokenString = () => {
  return crypto.randomBytes(40).toString("hex");
};

const signToken = (payload) => {
  return Jwt.sign(
    {
      issuer: "enterprice-project-v1",
      subject: payload,
    },
    process.env.SECRET_KEY,{
      expiresIn: '120s'
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

const register = async (registerAccount) => {
  const { username, password , confirmPassword } = registerAccount;
  const checkAccountExistedInDb = await User.findOne({ username });
  if (checkAccountExistedInDb) {
    throw new Error("Account already exists");
    return;
  }
  else if (password !== confirmPassword) {
    throw new Error("Password and confirm password do not match");
    return;
  }
  else if (!String(password).match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/)) {
    throw new Error("Password not strong enough");
    return;
  }
  else if (!String(username).match(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)) {
    throw new Error("Username not an email address");
    return;
  }
  else {
    try{
      const createAccount = new User({ ...registerAccount, email: username, role: process.env.STAFF });
      await createAccount.save();
      return createAccount;
    }
    catch(error){
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

module.exports = { register, signToken, generateRefreshToken, refreshJwtToken, revokeToken };
