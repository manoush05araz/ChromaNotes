import Note from "../models/Note.js";
import mongoose from "mongoose";
import PDFDocument from "pdfkit";
import { Readable } from "stream";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { dirname} from "path";
import crypto from "crypto";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export async function getAllNotes(_, res) {
  try {
    const notes = await Note.find({ archived: false });
    res.status(200).json(notes);
  } catch (error) {
    console.error("Error in getAllNotes controller", error);
    res.status(500).send("Internal Server Error");
  }
}

export async function getAllPinnedNotes(_, res) {
  try {
    const notes = await Note.find({ pinned: true });
    res.status(200).json(notes);
  } catch (error) {
    console.error("Error in getAllPinnedNotes controller", error);
    res.status(500).send("Internal Server Error");
  }
}

export async function getAllArchivedNotes(req, res) {
  try {
    const notes = await Note.find({ archived: true });
    res.status(200).json(notes);
  } catch (error) {
    console.error("Error in getAllArchivedNotes controller", error);
    res.status(500).send("Internal Server Error");
  }
}

export async function createNote(req, res) {
  try {
    const { title, content, color, fontStyle, fontSize, reminderTime } =
      req.body;
    const note = new Note({
      title,
      content,
      color,
      fontStyle,
      fontSize,
      reminderTime,
      reminderSent: false,
    });

    const saved = await note.save();
    console.log("Saved note:", saved);

    res.status(201).json(saved);
  } catch (error) {
    console.error("Error in createNote controller", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function deleteNote(req, res) {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid note ID" });
    }

    const note = await Note.findById(id);
    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }

    if (note.images && note.images.length > 0) {
      const uploadsDir = path.join(__dirname, "../uploads");

      note.images.forEach((imageObj) => {
        const filePath = path.join(uploadsDir, path.basename(imageObj.url));

        fs.unlink(filePath, (err) => {
          if (err) {
            console.error("Failed to delete image", filePath, err.message);
          } else {
            console.log("Deleted image:", filePath);
          }
        });
      });
    }

    await Note.findByIdAndDelete(id);
    res
      .status(200)
      .json({ message: "Note deleted successfully"});
  } catch (error) {
    console.error("Error in deleteNote controller", error);
    res.status(500).json({ message: "Internal server error" });
  }
}



export async function updateNote(req, res) {
  try {
    const { title, content, color, fontStyle, fontSize, reminderTime } =
      req.body;
    const updatedNote = await Note.findByIdAndUpdate(
      req.params.id,
      {
        title,
        content,
        color,
        fontStyle,
        fontSize,
        reminderTime,
        reminderSent: false,
      },
      {
        new: true,
      }
    );

    if (!updatedNote) {
      return res.status(404).json({ message: "Note not found" });
    }

    res.status(200).json(updatedNote);
  } catch (error) {
    console.error("Error in updateNote controller", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function getNotesByTag(req, res) {
  try {
    const { tagId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(tagId)) {
      return res.status(400).json({ message: "Invalid tag ID" });
    }

    const notes = await Note.find({ tags: tagId }).populate("tags");

    res.status(200).json(notes);
  } catch (error) {
    console.error("Error in getNotesByTag controller", error);
    res.status(500).send("Internal Server Error");
  }
}

export async function addTagToNote(req, res) {
  try {
    const { id } = req.params;
    const { tagId } = req.body;
    console.log("noteId:", id, "tagId:", tagId); // 🔍 check values

    if (
      !mongoose.Types.ObjectId.isValid(id) ||
      !mongoose.Types.ObjectId.isValid(tagId)
    ) {
      return res.status(400).json({ message: "Invalid note ID or tag ID" });
    }

    const note = await Note.findById(id);
    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }

    if (!note.tags.includes(tagId)) {
      note.tags.push(tagId);
      await note.save();
    }

    res.status(200).json(note);
  } catch (error) {
    console.error("Error in addTagToNote controller", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function removeTagFromNote(req, res) {
  try {
    const { id, tagId } = req.params;

    if (
      !mongoose.Types.ObjectId.isValid(id) ||
      !mongoose.Types.ObjectId.isValid(tagId)
    ) {
      return res.status(400).json({ message: "Invalid note ID or tag ID" });
    }

    const note = await Note.findById(id);
    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }

    note.tags = note.tags.filter((tag) => tag.toString() !== tagId.toString());
    await note.save();

    res.status(200).json(note);
  } catch (error) {
    console.error("Error in removeTagFromNote controller", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function togglePinNote(req, res) {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid note ID" });
    }

    const note = await Note.findById(id);
    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }

    note.pinned = !note.pinned;

    const updatedNote = await note.save();

    res.status(200).json(updatedNote);
  } catch (error) {
    console.error("Error in togglePinNote controller", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function toggleArchiveNote(req, res) {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid note ID" });
    }

    const note = await Note.findById(id);
    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }

    note.archived = !note.archived;
    await note.save();

    res.status(200).json(note);
  } catch (error) {
    console.error("Error in archive controller", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function exportNote(req, res) {
  try {
    const { id } = req.params;
    const { type } = req.query; // "pdf" or "txt"

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid note ID" });
    }

    const note = await Note.findById(id);
    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }


    // font map (ttf/otf files)
    const fontMap = {
      "arial": "Arial.ttf",
      "brush": "Brush Script.ttf",
      "comic": "Comic Sans MS.ttf",
      "courier": "Courier New.ttf",
      "garamond": "EBGaramond.otf",
      "georgia": "Georgia.ttf",
      "impact": "Impact.ttf",
      "times": "Times New Roman.ttf",
      "trebuchet": "Trebuchet MS.ttf",
      "verdana": "Verdana.ttf"
    }

    // fallback font 
    const defaultFont = "Arial.ttf";

    // selected font 
    const selectedFontFile = fontMap[note.fontStyle] || defaultFont;
    const fontPath = path.join(__dirname, "../../fonts", selectedFontFile);

    // export as text .txt
    if (type === "txt") {
      const textData =
        `${note.title}\n` +
        `\n${note.content}\n\n` +
        `Created: ${note.createdAt}\nUpdated: ${note.updatedAt}`;

      res.setHeader("Content-Type", "text/plain");
      res.setHeader(
        "Content-Disposition",
        `attachment; filename="${note.title}.txt"`
      );
      return res.send(textData);
    }

    // export as PDF .pdf
    if (type == "pdf") {
      const doc = new PDFDocument();

      res.setHeader("Content-Type", "application/pdf");
      res.setHeader(
        "Content-Disposition",
        `attachment; filename="${note.title}.pdf"`
      );

      doc.pipe(res);

      // load font 
      if (fs.existsSync(fontPath)) {
        doc.registerFont("custom", fontPath);
        doc.font("custom");
      } else {
        console.warn("Font not found, using default:", defaultFont);
      }

      // title
      doc.fontSize((note.fontSize || 14) + 6).text(note.title, { bold: true});
      doc.moveDown();

      // content
      doc.fontSize(note.fontSize || 14).text(note.content, {
        align: "left"
      });
      doc.moveDown();

      // add images
      if (note.images && note.images.length > 0) {
        const uploadsDir = path.join(__dirname, "../uploads");

        for (const image of note.images) {
          const imgPath = path.join(uploadsDir, path.basename(image.url));

          if (fs.existsSync(imgPath)) {
            doc.moveDown(1);
            doc.image(imgPath, {
              fit: [250, 200],
              align: "center",
            });
            doc.moveDown(2);
          } else {
            doc.text(`[Missing Image: ${image.url}]`);
          }
        }
      }

      doc.end();

      return;
    }

    // if type is missing
    return res.status(400).json({
      message: "Missing export type. Use ?type=pdf or ?type=txt",
    });
  } catch (error) {
    console.error("Error in exportNote controller", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function addImageToNote(req, res) {
  try {
    const { id } = req.params;
    
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid note ID" });
    }

    if (!req.file) {
      return res.status(400).json({ message: "No image uploaded" });
    }

    const imageUrl = `/uploads/${req.file.filename}`;

    const note = await Note.findById(id);
    if (!note) return res.status(404).json({ message: "Note not found" });
    
    const newImage = {
      url: imageUrl,
      id: crypto.randomUUID()
    }
    note.images.push(newImage);
    await note.save();

    res.status(200).json(note);

  } catch (error) {
    console.error("Error in addImageToNote controller", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export async function removeImageFromNote(req, res) {
  try {
    const { id, imageID } = req.params;

    if(!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid note ID" });
    }

    const note = await Note.findById(id);
    if (!note) {
      return res.status(404).json({ message: "Note not found" });
    }

    const imageObj = note.images.find(img => img.id === imageID);
    if (!imageObj) return res.status(404).json({ message: "Image not found" });

    // Build safe path relative to src folder
    const uploadsDir = path.join(__dirname, "../uploads");
    const filePath = path.join(uploadsDir, path.basename(imageObj.url));

    // Delete file
    fs.unlink(filePath, err => {
      if (err) console.error("Failed to delete file:", err);
    });

    note.images = note.images.filter(image => image.id !== imageID);
    await note.save();
  
    res.json(note);
  } catch (error) {
    console.error("Error in removeImageFromNote controller", error);
    res.status(500).json({ message: "Internal server error" });
  }
}