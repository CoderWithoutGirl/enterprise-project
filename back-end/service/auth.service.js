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
    process.env.SECRET_KEY,
    {
      expiresIn: "300s",
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
  console.log(token);
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
const revokeToken = async (token, ipAddress) => {
  const refreshTokenInDb = await getRefreshToken(token);
  refreshTokenInDb.revoked = Date.now();
  refreshTokenInDb.revokedByIp = ipAddress;
  await refreshTokenInDb.save();
};

const refreshJwtToken = async (token) => {
  const refreshToken = await getRefreshToken(token);
  const { user } = refreshToken;
  // generate new jwt
  const jwtToken = signToken(user?.username);

  // return basic details and tokens
  return {
    jwtToken,
  };
};

const register = async (registerAccount) => {
  const { username } = registerAccount;
  const checkAccountExistedInDb = await User.findOne({ username });
  if (checkAccountExistedInDb) {
    throw new Error("Account already exists");
    return;
  } else {
    const createAccount = new User({ ...registerAccount });
    await createAccount.save();
    return createAccount;
  }
};

module.exports = { register, signToken, generateRefreshToken, refreshJwtToken, revokeToken };
