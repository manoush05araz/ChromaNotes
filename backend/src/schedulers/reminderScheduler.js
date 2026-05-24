import cron from "node-cron";
import Note from "../models/Note.js";
import { sendNotification } from "../services/notificationService.js";

export function startReminderScheduler() {
  cron.schedule("* * * * *", async () => {
    const now = new Date();
    const notesToRemind = await Note.find({
      reminderTime: { $lte: now },
      reminderSent: false,
    });

    for (const note of notesToRemind) {
      await sendNotification(note);
      note.reminderSent = true;
      await note.save();
    }
  });

  console.log("Reminder scheduler started.");
}