import Tag from "../models/Tag.js";
import mongoose from "mongoose";
import Note from "../models/Note.js";
export async function getAllTags(_, res) {
  try {
    const tags = await Tag.find();
    res.status(200).json(tags);
  } catch (error) {
    console.error("Error in getAllTags controller", error);
    res.status(500).send("Internal Server Error");
  }
}

export async function createTag(req, res) {
  try {
    const { name } = req.body;
    const tag = new Tag({ name });

    const savedTag = await tag.save();
    res.status(201).json(savedTag);
  } catch (error) {
    console.error("Error in createTag controller", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function deleteTag(req, res) {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid tag ID" });
    }

    const deletedTag = await Tag.findByIdAndDelete(id);
    await Note.updateMany(
      { tags: id },
      { $pull: { tags: id } }
    );
    if (!deletedTag) {
      return res.status(404).json({ message: "Tag not found" });
    }

    res
      .status(200)
      .json({ message: "Tag deleted successfully", tag: deletedTag });
  } catch (error) {
    console.error("Error in deleteTag controller", error);
    res.status(500).json({ message: "Internal server error" });
  }
}