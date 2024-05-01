const jwt = require("jsonwebtoken");

const generateToken = (payload = {}, expIn = "1h", isAccessToken = true) => {
  const secretKey = isAccessToken
    ? process.env.JWT_ACCESS_SECRET
    : process.env.JWT_REFRESH_SECRET;
  return jwt.sign(payload, secretKey, { expiresIn: expIn });
};

const verifyToken = (token, isAccessToken = true) => {
  const secretKey = isAccessToken ? process.env.JWT_ACCESS_SECRET : "masai1";
  if (token) {
    return jwt.verify(token, secretKey, (err, result) => {
      if (err) {
        return err;
      }
      return result;
    });
  } else {
    throw new Error("Token not found");
  }
};

module.exports = { generateToken, verifyToken };
