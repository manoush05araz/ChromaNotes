import React, { useEffect, useState } from "react";
import api from "../lib/axios";

import { TrashIcon } from "@heroicons/react/24/solid";
import { RiPushpinFill } from "react-icons/ri";
import { MdEdit } from "react-icons/md";
import { RiUnpinFill } from "react-icons/ri";
import { FaPlusCircle } from "react-icons/fa";
import { ArchiveBoxArrowDownIcon } from "@heroicons/react/24/outline";
import { BiExport } from "react-icons/bi";
import { MdNotificationsActive } from "react-icons/md";


import NoteImageView from "./NoteImageView.jsx";

//Show all notes
export default function NotesList({filteredNotes, loading, handleDelete, handleUpdatePin, handleExport, setSortOrder, tags, showPinnedOnly, showTagOnly, handleEdit, handleUpdateArchive, theme}){

    const [searchTerm, setSearchTerm] = useState("");
    const [showNoteImageView, setShowNoteImageView] = useState(false);
    const [noteImage, setNoteImage] = useState(null);
    //Loading
    if (loading){
        return <div className="text-center py-10">Loading notes...</div>;
    }

    //No notes
    if (filteredNotes.length === 0){
        return (
            <div className="text-center py-10 text-gray-500">
                No notes found.
            </div>
        );
    }

    const displayedNotes = filteredNotes.filter(note => {
        return note.content.toLowerCase().includes(searchTerm.toLowerCase()) || note.title.toLowerCase().includes(searchTerm.toLowerCase());
    });

    //Show all notes
    return (
        <div >
            <div className="ml-50 flex items-center justify-end relative">
                <input type="text" value={searchTerm} className={`w-150 border-2 border-gray-400 rounded-full p-2 absolute left-1/2 transform -translate-x-1/2 ${theme == "dark" ? "text-white placeholder-gray-300" : "text-black placeholder-gray-500"}`} placeholder="Search" onChange={(e) => setSearchTerm(e.target.value)}/>
                <div className="mt-2 mb-2 flex-row-reverse flex">
                    <div className= {`p-2 relative group mr-8 inline-block ${theme == "dark" ? "bg-gray-700 text-white" : "bg-gray-200 text-black"}`}>
                        <div className="cursor-pointer w-40 text-center">
                            Sort Notes
                        </div>
                        <div className={`absolute top-full left-0 hidden group-hover:block min-w-[100px] shadow-lg p-3 z-10 ${theme === "dark" ? "bg-gray-700 text-white" : "bg-gray-200 text-black"} `}>
                            <button className={`m-1 cursor-pointer ${theme === "dark" ? "bg-gray-800 hover:bg-gray-600" : "bg-white hover:bg-gray-300"}`} onClick={() => setSortOrder("createdEarliest")}>Date Created (Earliest)</button>
                            <button className={`m-1 cursor-pointer ${theme === "dark" ? "bg-gray-800 hover:bg-gray-600" : "bg-white hover:bg-gray-300"}`} onClick={() => setSortOrder("createdLatest")}>Date Created (Latest)</button>
                            <button className={`m-1 cursor-pointer ${theme === "dark" ? "bg-gray-800 hover:bg-gray-600" : "bg-white hover:bg-gray-300"}`} onClick={() => setSortOrder("modifiedEarliest")}>Date Modified (Earliest)</button>
                            <button className={`m-1 cursor-pointer ${theme === "dark" ? "bg-gray-800 hover:bg-gray-600" : "bg-white hover:bg-gray-300"}`} onClick={() => setSortOrder("modifiedLatest")}>Date Modified (Latest)</button>
                        </div>
                    </div>
                </div>
            </div>
            <div className="ml-50 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 p-4">
                {displayedNotes.map((note) => {
                    const id= note._id || note.id;
                    const bg = note.color || "#FDE68A";
                    const getFontStyle = (fontValue) => {
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
                    const fontStyle = {
                        fontFamily:getFontStyle(note.fontStyle),
                        fontSize: note.fontSize ? `${note.fontSize}px` : "14px",
                    };
                    const titleStyle = {
                        fontFamily: getFontStyle(note.fontStyle),
                        fontSize: note.fontSize ? `${note.fontSize * 1.3}px` : "14px",
                    };

                    return (

                        <div key={id} className="min-h-30 card shadow relative" style={{backgroundColor: bg}}> 
                            {/*reminder icon*/}
                            {note.reminderTime && new Date(note.reminderTime) > new Date() && (<MdNotificationsActive className="w-5 h-5 text-blue-500 absolute top-2 right-2" title="Reminder set"/>)}
                            <div className="card-body flex flex-col justify-between"> 
                                <h3 className="card-title text-base text-black wrap-break-word font-bold" style={titleStyle}>{note.title}</h3>
                                <p className="mb-10 whitespace-pre-wrap wrap-break-word text-black" style={fontStyle}>{note.content}</p>
                                <div className="inline-block mb-10">
                                    {note.images.map((image, index) => (
                                        <button className="cursor-pointer" onClick={() => {setNoteImage(image); setShowNoteImageView(true);}}>
                                            <img key={index} src={`http://localhost:5001${image.url}`} alt={`${note.images[index].name}`} className="inline w-30 h-auto m-2 rounded" />
                                        </button>
                                    ))}
                                </div>
                                <div className="absolute bottom-0 flex justify-start mt-4">
                                    {note.tags.map(tag => <div className ="note-tag-button ps-2 mb-1 ml-2 mr-2 bg-blue-200 rounded-full px-2 py-1 text-black"> {tags.find(t => t._id === tag)?.name} </div>)}

                                    {/* not implemented yet */}
                                    {/* <button onClick={(e) => {e.stopPropagation(); handleEditTag(note)}}> <FaPlusCircle /> </button>
                                    {noteToEditTag !== null && noteToEditTag._id === note._id && 
                                        <div className="shadow note-tag-menu absolute top-full left-10 mt-2 z-50 w-50 bg-white dark:bg-neutral-800 border border-gray-300">
                                            <div className ="note-tag-button inline-block ps-2 mt-2 mb-1 ml-2 mr-2 bg-blue-200 rounded-full px-2 py-1"> Tag1 </div>
                                            <div className ="block ml-3">
                                                New Tag
                                                <input type="text" className="border border-gray-300 rounded mb-2 px-2 py-1 w-40" placeholder="Enter tag name" />
                                            </div>
                                        </div>
                                    } */}

                                </div>
                                <div className="absolute bottom-2 right-2 flex gap-2">
                                    <button className="cursor-pointer mr-2" onClick={() => handleUpdatePin(note)}>
                                        {note.pinned ? <RiPushpinFill className="w-5 h-5 text-yellow-500" /> : <RiUnpinFill className="w-5 h-5 text-gray-400" />}
                                    </button>
                                    <button className="cursor-pointer mr-2" onClick={() => handleEdit && handleEdit(note)} >
                                        <MdEdit className="w-5 h-5 text-gray-400" />
                                    </button>
                                    <button className="cursor-pointer mr-2" onClick={() => handleUpdateArchive(note)}>
                                        <ArchiveBoxArrowDownIcon className={`w-5 h-5 ${
                                            note.archived ? "text-green-600" : "text-gray-500"
                                        }`}/>
                                            
                                    </button>
                                    <button  className="cursor-pointer mr-2" onClick={() => handleDelete(id)}>
                                        <TrashIcon className="w-5 h-5 text-red-600" />
                                    </button>
                                    <button className="cursor-pointer mr-2" onClick={() => handleExport(note)}>
                                        <BiExport className="w-5 h-5 text-black"/>
                                    </button>
                                </div>
                            </div>
                        </div>
                ); })}
            </div>
            {showNoteImageView && <NoteImageView image={noteImage} setNoteImageView={setShowNoteImageView} theme={theme} />}
        </div>
    );
}
