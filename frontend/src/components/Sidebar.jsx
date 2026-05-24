import React, {useState} from "react";
import api from "../lib/axios";

import { RiPushpinFill } from "react-icons/ri";
import { MdEdit } from "react-icons/md";
import { FaTag } from "react-icons/fa";
import { ArchiveBoxArrowDownIcon } from "@heroicons/react/24/outline";

function Sidebar({showPinnedOnly, setShowPinnedOnly, tags, showTagOnly, setShowTagOnly, showEditTagsForm, setShowEditTagsForm, showArchivedOnly, setShowArchivedOnly, theme, onThemeChange}) {
    const sidebarThemeStyles ={
        light: "bg-gray-200 text-gray-900", 
        dark: "bg-gray-600 text-white",   
        pastel: "bg-purple-200 text-gray-900"
    };

    return (
        <div className={`p-4 w-50 fixed left-0 top-10 h-full ${sidebarThemeStyles[theme]}`}>
            <div className="h-50">
                <button className={`flex items-center gap-2 px-3 py-1 ${showPinnedOnly ? "bg-gray-300" : "bg-transparent"} hover:bg-gray-300 cursor-pointer rounded`} onClick={() => {setShowPinnedOnly(!showPinnedOnly); setShowTagOnly(null);}}>
                    <RiPushpinFill className="w-5 h-5 text-yellow-500" /> Pinned 
                </button>
                {tags.map((tag) => (
                    <button key={tag._id} className={`flex items-center gap-2 px-3 py-1 mt-4 ${showTagOnly === tag._id ? "bg-gray-300" : "bg-transparent"} hover:bg-gray-300 cursor-pointer rounded`} onClick={() => {
                        showTagOnly === tag._id? setShowTagOnly(null) : setShowTagOnly(tag._id); setShowPinnedOnly(false);
                    }}>
                        <FaTag className="w-4 h-4 text-blue-400 ml-1" /> {tag.name}
                    </button>))}

                    <button className={`flex items-center gap-2 px-3 py-1 mt-4 ${showArchivedOnly ? "bg-gray-300" : "bg-transparent"} hover:bg-gray-300 cursor-pointer rounded`} onClick={() => { setShowArchivedOnly(!showArchivedOnly); setShowPinnedOnly(false); setShowTagOnly(null); }}>
                        <ArchiveBoxArrowDownIcon className={`w-5 h-5 ${theme == "dark" ?  "text-white" : "text-gray-700"}`} /> Archived
                    </button>

                <button className={`flex items-center gap-2 px-3 py-1 ${showEditTagsForm ? "bg-gray-200" : "bg-transparent"} mt-4 hover:bg-gray-300 cursor-pointer rounded`} onClick={() => setShowEditTagsForm(!showEditTagsForm)}>
                    <MdEdit className="w-5 h-5" /> Edit Tags
                </button>

                    {/* theme switcher */}
                <div className="mt-8">
                    <p className="text-sm font-semibold mb-2">Theme</p>
                    <div className="flex flex-col gap-2">
                        <button className={`px-3 py-1 rounded cursor-pointer text-sm text-black ${theme == "light" ? "bg-white border border-gray-300" : "bg-gray-100"} hover:bg-gray-200`} onClick={() => onThemeChange("light")}>Light</button>
                        <button className={`px-3 py-1 rounded cursor-pointer text-sm ${theme == "dark" ? "bg-gray-800 text-white" : "bg-gray-100"} hover:bg-gray-300`} onClick={() => onThemeChange("dark")}>Dark</button>
                        <button className={`px-3 py-1 rounded cursor-pointer text-sm text-black ${theme == "pastel" ? "bg-pink-100" : "bg-gray-100"} hover:bg-gray-200`} onClick={() => onThemeChange("pastel")}>Pastel</button>

                    </div>
                </div>
            </div>
        </div>
    )
}

export default Sidebar;