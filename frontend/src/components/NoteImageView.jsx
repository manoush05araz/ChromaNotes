import React, {useState} from "react";

import { TrashIcon } from "@heroicons/react/24/solid";

// Modal to add or remove tags

function NoteImageView({image, setNoteImageView, theme}) {
    const themeStyles = {
    light: "bg-white text-gray-900",
    dark: "bg-gray-800 text-white",
    pastel: "bg-pink-100 text-gray-900",
  };


    return (
    <div className="fixed inset-0 bg-black/10 flex items-center justify-center z-50 " id="myModal">
        <div className={`flex justify-center  w-4/5 max-w-lg p-6 rounded shadow-lg relative ${themeStyles[theme]}`}>
            <button className="absolute top-2 right-3 text-gray-400 text-2xl font-bold hover:text-black" id="closeModal" onClick={() => setNoteImageView(false)}>
                &times;
            </button>
            <img src={`http://localhost:5001${image.url}`} alt={image.name} className="inline w-4/5 m-auto h-auto " />
        </div>
    </div>
    );
}


export default NoteImageView;