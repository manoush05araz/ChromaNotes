import React, {useEffect, useState} from "react";
import api from "../lib/axios";
import toast from "react-hot-toast";

import NotesList from "../components/NotesList";
import Sidebar from "../components/Sidebar";
import Header from "../components/Header";
import NoteForm from "../components/NoteForm";
import EditTagsForm from "../components/EditTagsForm";
import ExportForm from "../components/ExportForm";
import socket from "../lib/socket";

function HomePage() {

    // States to control whether to show the NoteForm component for adding or editing a note
    const [showAddNoteForm, setShowAddNoteForm] = useState(false);
    const [showEditNoteForm, setShowEditNoteForm] = useState(false);
    const [showExportForm, setShowExportForm] = useState(false);

    // State to hold the current note being edited, null if no note is being edited
    const [noteToEdit, setNoteToEdit] = useState(null);

    // State to hold the note being exported
    const [noteToExport, setNoteToExport] = useState(null);

    // States to control which notes are shown
    const [showPinnedOnly, setShowPinnedOnly] = useState(false);
    const [showTagOnly, setShowTagOnly] = useState(null);
    const [showArchivedOnly, setShowArchivedOnly] = useState(false);

    // State to control the edit tags form 
    const [showEditTagsForm, setShowEditTagsForm] = useState(false);

    const [tags, setTags] = useState([]);

    //reminder popup
    const [reminderNotification, setReminderNotification] = useState(null);
    
    const [notes, setNotes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [sortOrder, setSortOrder] = useState("modifiedLatest");

    // Theme state to control background theme
    const [theme, setTheme] = useState("light");

    const sortNotes = (notes, sortOrder) => {
    return (notes || []).sort((a, b) => {
            if (b.pinned !== a.pinned) return b.pinned - a.pinned;

            switch (sortOrder) {
            case "createdEarliest":
                return new Date(a.createdAt) - new Date(b.createdAt);
            case "createdLatest":
                return new Date(b.createdAt) - new Date(a.createdAt);
            case "modifiedEarliest":
                return new Date(a.updatedAt) - new Date(b.updatedAt);
            case "modifiedLatest":
                return new Date(b.updatedAt) - new Date(a.updatedAt);
            default:
                return 0;
            }
        });
    };

    //Load theme 
    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const res = await api.get("/settings");
                if (res.data?.backgroundTheme) {
                    setTheme(res.data.backgroundTheme);
                }
            } catch (error){
                toast.error("Failed to load theme");
            }
        };
        fetchSettings();
    }, []);

    //Handle update theme and save to backend
    const handleThemeChange = async(newTheme) => {
        setTheme(newTheme);

        try{
            await api.put("/settings", { backgroundTheme: newTheme });
            toast.success("Theme updated");
        } catch (error) {
            toast.error("Failed to save theme");
        }
    };

    //apply different classes based on theme
    const getThemeClasses = () => {
        switch (theme) {
            case "dark":
                return "bg-gray-900 text-white";
            case "pastel":
                return "pastel-bg";
            case "light":
            default:
                return "bg-gray-50 text-gray-900";
        }
    };

    //Delete note when user clicks delete button
    const handleDelete = async (noteId) => {
        const previousNotes = notes;

        //remove from UI
        setNotes((prev) => prev.filter((note) => (note._id) !== noteId));

        try {
            await api.delete(`/notes/${noteId}`);
            toast.success("Note deleted");
        } catch (error) {
            //if delete fails, put note back
            setNotes(previousNotes);
            toast.error("Failed to delete note");
        }
    };

    // Pin/Unpin note when user clicks pin button
    const handleUpdatePin = async (note) => {
        const previousNotes = notes;

        // Update UI

        if(! note.archived) {
            let updatedNotes = previousNotes.map((n) => n._id === note._id ? { ...n, pinned: !n.pinned } : n );
            updatedNotes = updatedNotes.sort((a,b) => b.pinned - a.pinned);
            setNotes(updatedNotes);
            console.log(updatedNotes);

            try{
                await api.patch(`/notes/${note._id}/pin`);
                toast.success(note.pinned ? "Note unpinned" : "Note pinned");
            } catch (error) {
                setNotes(previousNotes);
                toast.error("Failed to update pin status");
            }
        }
    };

    // Archive / Unarchive notes
    const handleUpdateArchive = async (note) => {
        const previousNotes = notes;

        // Update UI
        let updatedNotes = previousNotes.map((n) => n._id === note._id ? { ...n, archived: !n.archived, pinned: false} : n );
        setNotes(updatedNotes);

        try{
            await api.patch(`/notes/${note._id}/archive`);
            toast.success(note.archived ? "Note unarchived" : "Note archived");
        } catch (error) {
            setNotes(previousNotes);
            toast.error("Failed to update archive status");
        }
    };
    
    //reminder notification
    useEffect(() => {
        socket.on("reminder", (data) =>{
            setReminderNotification({
                title: data.title || "Reminder", message: data.message || "Reminder from a note", reminderTime: data.reminderTime,
            });
        });
        return () => {
            socket.off("reminder");
        };
}, []);

    //Load notes
    useEffect(() => {
        const fetchNotes = async () => {
            try {
                const res = await api.get("/notes");
                setNotes(sortNotes(res.data, sortOrder) || []);
      
            } catch(error) {
                toast.error("Failed to load notes");
            } finally {
                setLoading(false);
            }
        };
        fetchNotes();
    }, [sortOrder]);
    
    // Determine which notes to show
        var filteredNotes = notes;
        if(showPinnedOnly) {
            filteredNotes = notes.filter((note) => note.pinned);
        }
        else if (showTagOnly) {
            filteredNotes = notes.filter((note) => note.tags && note.tags.includes(showTagOnly));
        }else if (showArchivedOnly){
            filteredNotes = notes.filter((note) => note.archived);
        } else {
            filteredNotes = notes.filter((note) => !note.archived);
        }

    {/* useEffect(() => {
    const handleClick = (event) => {
        // If click is NOT inside either the button that opens the tag menu
        // or the tag menu itself, close it.
        if (
        !event.target.closest(".note-tag-button") &&
        !event.target.closest(".note-tag-menu")
        ) {
        setNoteToEditTag(null);
        }
    };

    window.addEventListener("click", handleClick);
    return () => window.removeEventListener("click", handleClick);
    }, []); */}
    // Load tags from the backend when the component mounts
    useEffect(() => {
        const fetchTags = async () => {
            try {
                const res = await api.get("/tags");
                setTags(res.data || []);
            } catch (error) {
                console.error("Failed to load tags:", error);
            }
        };

        fetchTags();
    }, []);

    // Creates new tag in the backend and updates the tags state
    const addTag = async ({name}) => {
        if(!name) {
            alert("Please fill in a tag name");
            return;
        }

        try {
            const {data: createdTag} = await api.post("/tags", {name});
            console.log("Tag added successfully", createdTag);
            setTags([...tags, createdTag]);
            setShowEditTagsForm(false);
        } catch (error) {
            console.error("Error adding tag:", error);
        }
    };

    // Deletes tag from the backend and updates the tags state
    const removeTag = async (tagId) => {
        const previousTags = tags;

        setTags((prev) => prev.filter((tag) => tag._id !== tagId));
        setNotes(prevNotes =>
        prevNotes.map(note => ({
            ...note,
            tags: note.tags.filter(t => t !== tagId)
        }))
        );
        try {
            await  api.delete(`/tags/${tagId}`);

            console.log("Tag deleted successfully");
        } catch (error) {
            setTags(previousTags);
            console.error("Error deleting tag:", error);
        }
    };

    // When the NoteForm is submitted, make a POST request to add the new note and hide the NoteForm component
    const handleAddNoteFormSubmit = async ({title, content, tags, color, fontStyle, fontSize, reminderTime, images}) => {
        if(!title || !content) {
            alert("Please fill in both title and content");
            return;
        }
 
        try{ 
            console.log("POST payload:", {title, content, color, fontStyle});
            const {data: createdNote} = await api.post("/notes", {title, content, color, fontStyle, fontSize, reminderTime});
            console.log("Note added successfully, ", createdNote._id);
            
            for (const tag of tags) {
                await api.post(`/notes/${createdNote._id}/tags`, {tagId: tag});
                console.log(`Tag ${tag} added to note ${createdNote._id}`);
            }

            let newImages = [];
            for(let i = 0; i < images.length; i++) {
                const formData = new FormData();
                formData.append("image", images[i]);

                const response = await api.post(
                    `/notes/${createdNote._id}/images`,
                    formData,
                    {
                        headers: {
                            "Content-Type": "multipart/form-data"
                        }
                    }
                );
                newImages.push(response.data.images[i]);
            }

            const updated = { ...createdNote, tags, images: newImages};
            setNotes((prev) => [...prev, updated]);
            setShowAddNoteForm(false);
        } catch (error) {
        console.error("Error adding note:", error);
        }
    };


    
    // When the Edit Note form is submitted, make a PUT request to edit the note and hide the NoteForm component
    const handleEditNoteFormSubmit = async ({title, content, tags, color, fontStyle, fontSize, reminderTime, images}) => {
        if(!title || !content) {
            alert("Please fill in both title and content");
            return;
        }

        try {
            const oldTags = noteToEdit.tags || [];
            const { data: updated } = await api.put(`/notes/${noteToEdit._id}`, {title, content, color, fontStyle, fontSize, reminderTime});
            console.log("Note edited successfully", updated);

            for (const tag of tags) {
                if(!oldTags.includes(tag)) {
                    await api.post(`/notes/${updated._id}/tags`, {tagId: tag});
                    console.log(`Tag ${tag} added to note ${updated._id}`);
                }
            }
            console.log("noteToEdit.tags:", noteToEdit.tags);

            for (const oldTag of oldTags) {
                if(!tags.includes(oldTag)) {
                    console.log("Removing tag:", oldTag);
                    await api.delete(`/notes/${updated._id}/tags/${oldTag}`);
                    console.log(`Tag ${oldTag} removed from note ${updated._id}`);
                }
            }

            const oldImages = noteToEdit.images || [];
            let newImages = [];



            for(let i = 0; i < images.length; i++) {
                if(!oldImages.includes(images[i])) {
                    const formData = new FormData();
                    formData.append("image", images[i]);

                    const response = await api.post(
                        `/notes/${updated._id}/images`,
                        formData,
                        {
                            headers: {
                                "Content-Type": "multipart/form-data"
                            }
                        }
                    );
                    newImages.push(response.data.images[response.data.images.length - 1]);
                }
            }

            console.log("Old images", oldImages);
            console.log("Images after edit", images);
            console.log("New images", newImages);

            for(let i = 0; i < oldImages.length; i++) {
                if(!images.includes(oldImages[i])) {
                    const response = await api.delete(`/notes/${updated._id}/images/${oldImages[i].id}`);
                    console.log(`Image ${oldImages[i]} removed from note ${updated._id}`);
                }
            }
            let i = 0;
            const finalImages = images.map(img => {
                if (img instanceof File) {
                    // Find the uploaded version in newImages by matching the id
                    return newImages[i++];
                } else {
                    // Existing image: keep as-is
                    return img;
                }
            }).filter(Boolean); // remove undefined just in case

            console.log("Final images to be set on note:", finalImages);
            const updatedWithTags = { ...updated, tags, images: finalImages };
            setNotes((prev) => prev.map((note) => (note._id === updated._id ? updatedWithTags : note)));
            setShowEditNoteForm(false);
            setNoteToEdit(null);
        } catch (error) {
          console.error("Error editing note:", error);
      }
  };    
    
    const handleExportFormSubmit = async(fileType) => {
        try{
            setShowExportForm(false);
            setNoteToExport(null);
            window.open(`http://localhost:5001/api/notes/${noteToExport._id}/export?type=${fileType}`, "_blank");
        }
        catch(error){
            console.log("Error exporting note", noteToExport, error);
        }
    };

    // When the Add Note button is clicked, show the NoteForm component
    const handleAddNoteButtonClick = () => {
        console.log("Add Note button clicked");
        setShowAddNoteForm(true);
        setShowEditNoteForm(false);
    };

    // When the Edit Note button is clicked, show the NoteForm component
    const handleEditNoteButtonClick = (note) => {
        console.log("Edit Note button clicked");
        setShowEditNoteForm(true);
        setShowAddNoteForm(false);
        setNoteToEdit(note);
    };

    // When a NoteForm is open and the back button is clicked, hide the NoteForm component
    const handleNoteFormBackButton = () => {
        console.log("Back button clicked");
        setShowAddNoteForm(false);
        setShowEditNoteForm(false);
        setShowEditTagsForm(false);
    };

    const handleExport = (note) => {
        console.log("Export Note button clicked for note: " + note._id);
        setNoteToExport(note);
        setShowExportForm(true);
    }
    return (
        <div className={`${getThemeClasses()} min-h-screen w-full`}>
            <Header onAddNote={handleAddNoteButtonClick} currentTheme={theme} />
            <Sidebar showPinnedOnly={showPinnedOnly} setShowPinnedOnly={setShowPinnedOnly} tags={tags} showTagOnly={showTagOnly} 
            setShowTagOnly={setShowTagOnly} showEditTagsForm={showEditTagsForm} setShowEditTagsForm={setShowEditTagsForm} showArchivedOnly={showArchivedOnly} setShowArchivedOnly={setShowArchivedOnly} theme={theme} onThemeChange={handleThemeChange}/>

            {!showAddNoteForm && !showEditNoteForm &&
                <div className="pt-11">
                    <NotesList filteredNotes={filteredNotes} loading={loading} handleDelete={handleDelete} handleUpdatePin={handleUpdatePin} handleExport={handleExport} setSortOrder={setSortOrder} tags={tags} showPinnedOnly={showPinnedOnly} showTagOnly ={showTagOnly} handleEdit={handleEditNoteButtonClick} handleUpdateArchive={handleUpdateArchive} theme={theme}/>
                    {showEditTagsForm && <EditTagsForm tags={tags} addTag={addTag} setShowEditTagsForm={setShowEditTagsForm} removeTag={removeTag} theme={theme} />}
                    {showExportForm && <ExportForm note={noteToExport} setShowExportForm={setShowExportForm} handleExportFormSubmit={handleExportFormSubmit} theme={theme}/>}

                </div>
            }

            { /* Show Edit Note form if showEditNoteForm is true */}
            <div className="pt-11">
                {!showAddNoteForm && showEditNoteForm &&
                    <NoteForm purpose={"Edit"} onSubmit={handleEditNoteFormSubmit} note={noteToEdit} noteTitle={noteToEdit.title} noteContent={noteToEdit.content} 
                    noteColour={noteToEdit.color} noteTags={noteToEdit.tags} noteFontFamily={noteToEdit.fontStyle} noteFontSize={noteToEdit.fontSize} noteReminderTime={noteToEdit.reminderTime} allTags={tags} handleBackButton={handleNoteFormBackButton} />
                }
            </div>



            {/* If showAddNoteForm is true, show the NoteForm component */}
            <div className="pt-11">
                {showAddNoteForm && 
                    <NoteForm purpose={"Add"} onSubmit={handleAddNoteFormSubmit} noteTitle={null} noteContent={null} noteFontSize={14} noteReminderTime={null} allTags={tags} handleBackButton={handleNoteFormBackButton} />
                }
            </div>



{/* Reminder notification */}
            {reminderNotification && (
                <div className="fixed bottom-4 right-4 z-50 max-w-sm">
                    <div className="bg-blue-500 text-white px-4 py-3 rounded-2xl shadow-xl">
            <div className="flex justify-between items-start gap-3">
                <div>
                    <p className="text-[10px] uppercase tracking-wide opacity-80">Reminder</p>
                    <p className="font-semibold text-sm">{reminderNotification.title}</p>
                    {reminderNotification.reminderTime && (
                        <p className="text-xs mt-1 opacity-85">Due{" "}{new Date(reminderNotification.reminderTime).toLocaleString()}</p>
                    )}
                    {reminderNotification.message && (
                    <p className="text-xs mt-1">{reminderNotification.message}</p>
                    )}
                </div>
            <button className="ml-2 text-xs opacity-80 hover:opacity-100" onClick={() => setReminderNotification(null)}>✕</button>
            </div>
        </div>
        </div>
        )}


        </div>
    );
};





export default HomePage;