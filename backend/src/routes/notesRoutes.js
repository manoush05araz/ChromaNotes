import express from "express";
import upload from "../upload.js";
import {
  getAllNotes,
  createNote,
  deleteNote,
  updateNote,
  getNotesByTag,
  addTagToNote,
  removeTagFromNote,
  togglePinNote,
  getAllPinnedNotes,
  exportNote,
  addImageToNote,
  toggleArchiveNote,
  getAllArchivedNotes,
  removeImageFromNote,
} from "../controllers/notesController.js";

const router = express.Router();

router.get("/", getAllNotes);
router.post("/", createNote);
router.delete("/:id", deleteNote);
router.put("/:id", updateNote);
router.get("/tag/:tagId", getNotesByTag);
router.post("/:id/tags", addTagToNote);
router.delete("/:id/tags/:tagId", removeTagFromNote);
router.patch("/:id/pin", togglePinNote);
router.patch("/:id/archive", toggleArchiveNote);
router.get("/pinned", getAllPinnedNotes);
router.get("/archived", getAllArchivedNotes);
router.get("/:id/export", exportNote);
router.post("/:id/images", upload.single("image"), addImageToNote);
router.delete("/:id/images/:imageID", removeImageFromNote);

export default router;