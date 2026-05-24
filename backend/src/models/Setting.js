import mongoose from "mongoose";

const SettingsSchema = new mongoose.Schema({
  backgroundTheme: {
    type: String,
    enum: ["light", "dark", "pastel"],
    default: "light",
  },
});

const Setting = mongoose.model("Setting", SettingsSchema);

export default Setting;