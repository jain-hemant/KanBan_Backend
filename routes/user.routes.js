const { Router } = require("express");
const bcrypt = require("bcrypt");
require("dotenv").config();

const jwt = require("../lib/jwt");
const UserModel = require("../models/user.model");
const BlacklistModel = require("../models/blacklist.model");
const auth = require("../middlewares/auth.middleware");

const userRoutes = Router();

userRoutes.post("/register", async (req, res) => {
  const { name, email, password } = req.body;
  try {
    if ((!name, !email, !password)) {
      return res.status(403).json({ message: "All field mandatory" });
    }
    const userExist = await UserModel.findOne({ email });
    //console.log(userExist); // If Success then Why null
    if (userExist) {
      return res
        .status(403)
        .json({ message: "User already registered!, Login please." });
    }
    const hash = bcrypt.hashSync(password, 5, (err, hash) => {
      if (err)
        return res.status(500).json({ message: "Encryption Error", err });
      return hash;
    });

    const user = new UserModel({ name, email, password: hash });
    const data = await user.save();
    if (data) {
      return res.status(201).json({ message: "User created successfully." });
    }
  } catch (error) {
    // console.error(error);
    return res
      .status(500)
      .json({ message: "Error while user registration!", error });
  }
});

userRoutes.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    if ((!email, !password)) {
      return res
        .status(403)
        .json({ message: "email & password is mandatory." });
    }
    const user = await UserModel.findOne({ email });
    if (!user) {
      return res
        .status(403)
        .json({ message: "User not found. kindly register." });
    }
    const decode = await bcrypt.compare(password, user.password);

    if (decode) {
      const payload = { userId: user._id, role: user.role };
      const accessExpIn = "5s";
      const refreshExpIn = 86400000;
      const accessToken = jwt.generateToken(payload, accessExpIn, true);
      const refreshToken = jwt.generateToken(payload, refreshExpIn, false);

      res.cookie("accessToken", accessToken, { maxAge: 3600000 }); // 3600000
      res.cookie("refreshToken", refreshToken, { maxAge: refreshExpIn });

      return res
        .status(200)
        .json({ message: "User logged in successfully", accessToken });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Error while Login", error });
  }
});

userRoutes.delete("/logout", auth, async (req, res) => {
  const accessToken = req.token;
  const userId = req.user.id;
  // console.log(req.user.id);
  try {
    const logout = new BlacklistModel({ token: accessToken, userId });
    await logout.save();
    return res.status(200).json({ message: "User logout successfully." });
  } catch (error) {
    console.log("logout error", error);
    return res.status(500).json({ message: "Error while logout." });
  }
});

module.exports = userRoutes;
