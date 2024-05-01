require("dotenv").config();
const jwt = require("../lib/jwt");
const UserModel = require("../models/user.model");
const BlacklistModel = require("../models/blacklist.model");
const auth = async (req, res, next) => {
  // const token = req.headers["authorization"]?.split(" ")[1];
  const accessToken = req.cookies["accessToken"];
  const refreshToken = req.cookies["refreshToken"];
  // console.log(refreshToken, "refreshToken");
  try {
    const blackListed = await BlacklistModel.findOne({ token: accessToken });
    console.log("blacklisted", blackListed);
    if (blackListed) {
      return res
        .status(401)
        .json({ message: "Token blacklisted! Login again..." });
    }

    if (!accessToken && !refreshToken) {
      return res.status(401).send("Un-Authorized Access");
    }
    if (!accessToken && refreshToken) {
      const payload = jwt.verifyToken(refreshToken, false);
      if (payload?.userId) {
        const newAccessToken = jwt.generateToken(
          { userId: payload.userId, role: payload.role },
          "1h",
          true
        );
        res.cookie("accessToken", newAccessToken, { maxAge: 3600000 }); // 3600000
        const user = await UserModel.findById(payload.userId);
        if (!user) {
          return res.status(400).send("User does not exist");
        }
        req.token = accessToken;
        req.user = user;
        return next();
      } else {
        return res.status(401).send("Un-Authorized Access");
      }
    }

    const payload = jwt.verifyToken(accessToken);

    if (!payload?.userId && refreshToken) {
      const payload = jwt.verifyToken(refreshToken, false);
      console.log(payload, "payload");
      if (payload?.userId) {
        const newAccessToken = jwt.generateToken(
          { userId: payload.userId, role: payload.role },
          "1h",
          true
        );
        res.cookie("accessToken", newAccessToken, { maxAge: 3600000 }); // 3600000
        const user = await UserModel.findById(payload.userId);
        if (!user) {
          return res.status(400).send("User does not exist");
        }
        req.token = accessToken;
        req.user = user;
        return next();
      } else {
        return res.status(401).send("Un-Authorized Access");
      }
    }

    const user = await UserModel.findById(payload.userId);
    if (!user) {
      return res.status(400).send("User does not exist");
    }

    req.token = accessToken;
    req.user = user;
    next();
  } catch (error) {
    console.log("catch block", error);
    return res
      .status(500)
      .json({ message: "Error while authentication", error: error.name });
  }
  // next();
};

module.exports = auth;
