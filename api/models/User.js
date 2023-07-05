const { Schema, model } = require("mongoose");

const UserSchema = new Schema({
  username: { type: String, required: true, min: 4, unique: true },
  passwordhash: { type: String, required: true },
});

const UserModel = model("User", UserSchema);

module.exports = UserModel;
