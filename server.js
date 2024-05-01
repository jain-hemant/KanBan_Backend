const express = require("express");
require("dotenv").config();
const cookieParser = require("cookie-parser");

const connectToDB = require("./config/db");
const auth = require("./middlewares/auth.middleware");
const userRoutes = require("./routes/user.routes");
const kanbanRoutes = require("./routes/kanban.routes");

const server = express();
const PORT = process.env.PORT || 9090;

server.use(express.json());
server.use(cookieParser());
server.use("/user", userRoutes);
server.use("/kanban", auth, kanbanRoutes);

server.get("/", auth, (req, res) => {
  res.send("home route");
});

server.listen(PORT, () => {
  connectToDB(process.env.DB_URL);
  console.log(`Server started at port http://localhost:${PORT}`);
});
