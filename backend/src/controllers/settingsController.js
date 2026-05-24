import Setting from "../models/Setting.js";
import mongoose from "mongoose";

export const getSettings = async (req, res) => {
  try {
    let settings = await Setting.findOne();

    if (!settings) {
      settings = await Setting.create({});
    }

    res.status(200).json(settings);
  } catch (error) {
    console.error("Error in getSettings controller", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const updateSettings = async (req, res) => {
  try {
    const { backgroundTheme } = req.body;

    if (!["light", "dark", "pastel"].includes(backgroundTheme)) {
      return res.status(400).json({ message: "Invalid background theme" });
    }

    const updatedSettings = await Setting.findOneAndUpdate(
      {},
      { backgroundTheme },
      { new: true, upsert: true }
    );

    if (!updatedSettings) {
      return res.status(404).json({ message: "Settings not found" });
    }

    res.status(200).json(updatedSettings);
  } catch (error) {
    console.error("Error in updateSettings controller", error);
    res.status(500).json({ message: "Internal server error" });
  }
};
