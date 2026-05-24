import React, { useState, useEffect } from "react";
import StyleControl from "../components/StyleControl";

import { TrashIcon } from "@heroicons/react/24/solid";

const getFontFamily = (fontValue) => {
        const fontMap = {
            arial: "Arial, sans-serif",
            times: "'Times New Roman', serif",
            comic: "'Comic Sans MS', cursive",
            georgia: "Georgia, serif",
            verdana: "Verdana, sans-serif",
            courier: "'Courier New', monospace",
            impact: "Impact, sans-serif",
            trebuchet: "'Trebuchet MS', sans-serif",
            garamond: "Garamond, serif",
            brush: "'Brush Script MT', cursive"
        };
        return fontMap[fontValue] || "Arial, sans-serif";
    };

// Must provide onSubmit prop from wherever this form is used. The form doesn't make any API calls itself. onSubmit is 
// whatever function you want to run when the form is submitted. 

// noteTitle and noteContent are optional. If provided, they will be the initial value of the title and content input fields (say when editing a note)
function NoteForm({purpose, onSubmit, note, noteTitle, noteContent, noteColour, noteTags, noteFontFamily, noteFontSize, noteReminderTime, allTags, handleBackButton}) {
    const [title, setTitle] = useState(
        noteTitle === null ? "" : noteTitle
    );
    const [content, setContent] = useState(
        noteContent === null ? "" : noteContent
    );

    const [images, setImages] = useState(
        note ? note.images : []
    );

    const [previews, setPreviews] = useState(
        note && note.images ? note.images.map(img => `http://localhost:5001${img.url}`) : []
    );

    useEffect(() => {
        return () => previews.forEach(url => URL.revokeObjectURL(url));
    }, []); 

    console.log("Initial images:", note);
    console.log("Previews" , previews);
    const [tags, setTags] = useState(
        Array.isArray(noteTags) ? noteTags : []
    );

    //States for style
    const [colour, setColour] = useState(noteColour ?? "#FDE68A"); //default colour
    const [fontStyle, setFont] = useState(noteFontFamily ?? "arial");
    const [fontSize, setFontSize] = useState(noteFontSize || 14);

    //state for reminder & notifications
    const [reminderEnabled, setReminderEnabled] = useState(!!noteReminderTime);
    const [reminderDate, setReminderDate] = useState( noteReminderTime ? new Date(noteReminderTime).toLocaleDateString("en-CA") : "");
    const [reminderTimeInput, setReminderTimeInput] = useState(noteReminderTime ? new Date(noteReminderTime).toLocaleTimeString("en-CA", {hour: "2-digit", minute: "2-digit", hour12: false,}) : "");
    
    const handleSubmit = (e) => {
        e.preventDefault();

        let reminderTime = null;
        if (reminderEnabled){
            if (!reminderDate || !reminderTimeInput){
                alert("Please select both a date and time");
                return;
            }
            const combined = new Date(`${reminderDate}T${reminderTimeInput}:00`);
            if (combined <= new Date()){
                alert("Reminder time cannot be in the past.");
                return ;
            }
            reminderTime = combined.toISOString();
        }
        console.log("Submitting note with colour:", colour);
        onSubmit({title, content, tags, color: colour, fontStyle, fontSize, reminderTime, images});
    };

    const handleFileSelect = (e) => {
        const files = e.target.files[0];
        if(files) {
            setPreviews(prev => [...prev, URL.createObjectURL(files)]);
        }
        setImages([... images, files]);
    };

    const handleFileDelete = (index, e) => {
        e.preventDefault();
        setImages(prev => prev.filter((_, i) => i !== index));
        setPreviews(prev => {
            URL.revokeObjectURL(prev[index]);
            return prev.filter((_, i) => i !== index);
        });
    };
    const textStyle = {
        fontFamily: getFontFamily(fontStyle),
        fontSize: fontSize ? `${fontSize}px` : "14px",
    };
    const titleStyle = {
        fontFamily: getFontFamily(fontStyle),
        fontSize: fontSize ? `${fontSize * 1.3}px` : "14px",
    };

    const editTag = (tag) => {
        setTags(prevTags =>
            prevTags.some(t => t === tag._id)  
            ? prevTags.filter(t => t !== tag._id)  
            : [...prevTags, tag._id]                      
        );
    };
    return (
        <div className="min-h-[90vh] flex items-center text-black **:text-black">
            <div className="relative md:w-106 mx-auto active:none" style={{backgroundColor: colour}}>
                    <button className="absolute top-2 right-3 text-gray-400 text-2xl font-bold hover:text-black" id="closeModal" onClick={handleBackButton} >
                        &times;
                    </button>
                    <form className="grid mt-6 mb-6" onSubmit={handleSubmit}>
                        <input className="outline-none w-full px-3 py-2" id="note-title" type="text" placeholder="Title" value={title} required onChange={(e) => setTitle(e.target.value)} style={titleStyle} />
                        <textarea className="outline-none w-full px-3 py-2" id="note-content" rows={5} cols={20} placeholder="Note content" value={content} required onChange={(e) => setContent(e.target.value)} style={textStyle}></textarea>
                        <StyleControl colour={colour} setColour={setColour} fontStyle={fontStyle} setFont={setFont} fontSize={fontSize} setFontSize={setFontSize}/>
                        <div className="note-tag-menu top-full left-10 mt-2 mb-10 z-50">
                            {allTags?.map(tag => (
                                <button key={tag._id} type="button" className ={`note-tag-button border-2 ${tags.some(t => t === tag._id) ? 'border-black' : 'border-transparent'} box-border inline-block ps-2 mt-5 mb-1 ml-2 mr-2 bg-blue-200 rounded-full px-2 py-1`} 
                                onClick= {(e) => {e.preventDefault(); editTag(tag);}}>{tag.name}</button>
                            ))}
                        </div>

                        <label className="text-center bg-blue-400 inline-block md:w-30 border-2 rounded-full font-medium mt-4 mb-2" htmlFor="note-image">Attach Image</label>
                        <input className="hidden" id="note-image" type="file" accept="image/*" onChange={(e) => handleFileSelect(e)} />
                        <span>   {images && images.length > 0 ? (
                            images.map((image, index) => (
                            <div className="inline-block me-2" key={index}>
                                <img
                                className="w-30 h-auto"
                                src={
                                    previews[index]
                                }
                                alt={typeof images[index] === "string" ? images[index] : images[index].name}
                                />
                                <button className="cursor-pointer" onClick={(e) => handleFileDelete(index, e)}> <TrashIcon className="w-5 h-5" /> </button>
                            </div>
                        ))
                        ) : (
                            "No files chosen"
                        )} </span>
                        {/* Reminder Control*/}
                        <div className="mt-4 px-4 mb-8">
                            <label className="flex items-center gap-2 mb-2">
                                <input type="checkbox" checked={reminderEnabled} onChange={(e) => setReminderEnabled(e.target.checked)} />
                                <span className="text-sm font-medium text-black">Set reminder</span>
                            </label>

                            {reminderEnabled && (
                                <div className="flex flex-wrap gap-3">
                                    <div>
                                        <p className="text-xs mb-1 text-black">Date</p>
                                        <input type="date" className="border rounded px-2 py-1 text-sm" value={reminderDate} onChange={(e) => setReminderDate(e.target.value)}/>
                                    </div>
                                    <div>
                                        <p className="text-xs mb-1 text-black">Time</p>
                                        <input type="time" className="border rounded px-2 py-1 text-sm" value={reminderTimeInput} onChange={(e) => setReminderTimeInput(e.target.value)}/>
                                    </div>
                                </div>
                            )}
                        </div>
                        <button className="bg-blue-400 mx-auto mt-10 md:w-30 border-2 rounded-full"  type="submit">{purpose} Note</button>
                    </form>
            </div>
        </div>
    );
}

export default NoteForm;