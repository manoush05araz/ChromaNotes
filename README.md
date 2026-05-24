# 📝 ChromaNotes

ChromaNotes is a customizable and intuitive note-taking web application that empowers users to create, organize, and personalize their notes in a visually engaging workspace. Unlike traditional note-taking tools, ChromaNotes emphasizes **personalization**, **organization**, and **aesthetics**, giving users full control over how their workspace looks and feels.

---

## 🎯 Motivation

Existing note-taking applications such as Evernote, Notion, and OneNote focus heavily on functionality, but often lack full visual customization or hide personalization features behind paywalls. ChromaNotes fills this gap by allowing users to fully personalize their workspace — from color themes and fonts to folder organization and tagging systems.

The goal is to make note-taking not only efficient but also enjoyable, creative, and truly *yours*.

### What problem does it solve?

- **Lack of personalization** in existing note-taking apps  
- **Cluttered interfaces** that make organization difficult  
- **Paywalled features** for basic customization tools  

### Why it exists

We believe that productivity tools should adapt to the user — not the other way around. ChromaNotes empowers users to take notes in a workspace that reflects their personality and workflow.

---

## 🧠 Sprint 1 Summary

This Sprint focused on setting up the backend and frontend foundation for note management.

### ✅ Implemented Features

Backend:  
Fully functional Express server with MongoDB integration via Mongoose  
CRUD operations for notes (create, read, update, delete)  
Organized route and controller structure  
CORS enabled for frontend-backend communication  
Environment variables managed with dotenv  

Frontend:  
Built using React (Vite)  
Components for displaying, adding, editing, and deleting notes  
Toast notifications for user feedback  
Responsive layout using Tailwind CSS  
Axios instance for backend API calls  
Routing handled via react-router  

## 🧠 Sprint 2 Summary
New additions this sprint:  
Tag system: create, delete, and assign tags to notes  
Filter notes by tag in the sidebar  
Pin/unpin notes and filter to show only pinned notes  

New Note Model properties:  
pinned (Boolean)  
tags (Array of Tag ObjectIds)  
color (custom note background)  
fontStyle (custom font)  
fontSize (custom text size)  

Tag model & controller added  
Endpoints for tag assignment/removal  
UI updates to reflect tagging, filtering, and pinning features  

## 🧩 Tech Stack  
Layer	- Technology  
Frontend - React (Vite)  
Backend	- Node.js + Express  
Database - MongoDB (Mongoose ODM)  
Styling - Tailwind CSS  
Notifications	- React Hot Toast  
Routing -	React Router  
Environment Management - dotenv  
Cross-Origin Support - CORS middleware  

## 💻 Installation

Follow these steps to run the ChromaNotes backend locally.

### 1. Prerequisites

Ensure you have the following installed:
- [Node.js](https://nodejs.org/en/) (v18+)
- [MongoDB](https://www.mongodb.com/)
- [npm](https://www.npmjs.com/)
- [Git](https://git-scm.com/)

### 2. Clone the Repository

bash  
git clone git@github.com:EECS3311F25/project-chromanotes.git  
cd ChromaNotes/backend

### 3. Install Dependencies
npm install

### 4. Environment Variables

Create a .env file in the /backend directory with the following:

MONGO_URI=mongodb+srv://doraziog_db_user:U88rHbU6Z0aIWhY3@cluster0.9x7ieum.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0  
PORT=5001

### 5. Start the Backend Server
npm start

The backend will now be running at http://localhost:5001.

### 6. Run the Frontend  
cd ../frontend  
npm install  
npm run dev  

Frontend runs at http://localhost:5173  

## ⚙️ Backend Overview
### Server (server.js)
Sets up Express server  
Connects to MongoDB  
Handles routes under /api/notes and /api/tags
Enables JSON parsing and CORS  

### Routes  
(notesRoutes.js)
Defines endpoints:  
Method - Endpoint	- Description  
GET	- /api/notes - Fetch all notes  
POST	- /api/notes	- Create a new note  
PUT	- /api/notes/:id	- Update an existing note  
DELETE	- /api/notes/:id	- Delete a note  
GET	- /api/notes/tag/:tagId	- Get notes by tag  
POST	- /api/notes/:id/tags	- Add tag to note  
DELETE	- /api/notes/:id/tags/:tagId	- Remove tag from note  
PATCH	- /api/notes/:id/pin	- Toggle pinned status  
GET	- /api/notes/pinned	- Get all pinned notes  

(tagsRoutes.js)  
Defines endpoints:  
Method - Endpoint	- Description  
GET	- /api/tags	- Fetch all tags  
POST	- /api/tags	- Create a new tag  
DELETE	- /api/tags/:id	- Delete tag (auto‑removed from notes)  

## 🖥️ Frontend Overview
### Key Components
HomePage.jsx — Main controller for notes, tags, filters, forms  
NotesList.jsx — Displays notes, manages delete & pin UI  
NoteForm.jsx — Create/edit notes with color, font, and tag options  
Sidebar.jsx — Displays tags & filtering options  
EditTagsForm.jsx — Add/delete tags  
Header.jsx — Sorting & UI controls  

New Frontend Features (Sprint 2)  
Toggle pinned notes  
Filter by tag  
Tag creation & deletion  
Apply custom colors and font styles per note  
Sorting options (created/modified ascending/descending)  
Improved state management for tag/note syncing  

API Integration  
All requests handled via Axios instance in /lib/axios.js  
Notes update dynamically without page refresh  
Optimistic UI updates for deleting notes & removing tags  

## 🤝 Contribution

We welcome contributions! Please follow the steps below:

### Branching Strategy

We use a simple Git flow model:

main — stable, production-ready code

dev — main development branch

feature branches — new features (e.g., feature/note-tags, feature/user-auth)

bugfix branches — fixes to existing functionality (e.g., bugfix/save-error)

### Pull Request Process

Fork the repository

Create a new branch for your feature

Commit your changes with clear messages

Push your branch and open a Pull Request (PR)

Request at least one team member for review

### Issue Tracking

We use GitHub Issues to report bugs and suggest enhancements. Please include:

Clear description of the problem

Steps to reproduce

Expected vs actual behavior

Screenshots (if applicable)

## ✅ Definition of Done

A feature is considered done when:

The corresponding user story can be fully completed

The feature functions correctly and passes all relevant tests

The code is merged into the dev branch and reviewed by peers

## 🌈 Summary

ChromaNotes redefines what a note-taking app can be by prioritizing aesthetics, personalization, and user freedom.
It’s not just about writing notes — it’s about crafting a workspace that reflects you.

✨ Simple. Customizable. Personal. That’s ChromaNotes.
