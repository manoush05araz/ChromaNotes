import { io } from "../server.js";

export const sendNotification = (note) => {
  io.emit("reminder", {
    id: note._id,
    title: note.title,
    message: `Reminder: "${note.title}" is coming up.`,
    reminderTime: note.reminderTime,
  });

  console.log("Reminder sent for:", note.title);
};