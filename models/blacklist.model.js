const mongoose = require("mongoose");

const BlacklistSchema = mongoose.Schema({
  userId: { type: String, required: true },
  token: { type: String, required: true },
});

const BlacklistModel = mongoose.model("blackList", BlacklistSchema);

module.exports = BlacklistModel;
