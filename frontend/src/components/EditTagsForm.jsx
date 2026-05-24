import React, {useState} from "react";

import { TrashIcon } from "@heroicons/react/24/solid";

// Modal to add or remove tags

function EditTagsForm({tags, addTag, setShowEditTagsForm, removeTag, theme }) {
    const [tagToEdit, setTagToEdit] = useState("");
    const [editing, setEditing] = useState(false);
    const [tagName, setTagName] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("Submitting tag:", tagName);
        addTag({name: tagName});
    };

    const themeStyles = {
    light: "bg-white text-gray-900",
    dark: "bg-gray-800 text-white",
    pastel: "bg-pink-100 text-gray-900",
  };


    return (
    <div className="fixed inset-0 bg-black/10 flex items-center justify-center z-50 " id="myModal">
        <div className={`w-4/5 max-w-lg p-6 rounded shadow-lg relative ${themeStyles[theme]}`}>
            <button className="absolute top-2 right-3 text-gray-400 text-2xl font-bold hover:text-black" id="closeModal" onClick={() => setShowEditTagsForm(false)}>
                &times;
            </button>

            <h2 className="text-xl font-semibold mb-4">Edit Tags</h2>
            {tags.map((tag) =>
                <div key={tag._id} className="block">
                    <button> <TrashIcon className="w-5 h-5 text-red-600" onClick={() => removeTag(tag._id)}/> </button>
                    <div className ="note-tag-button inline-block ps-2 mt-2 mb-1 ml-2 mr-2 bg-green-200 rounded-full px-2 py-1 text-black"> {tag.name} </div>
                </div> )}
                <div className ="block mt-5">
                    <form onSubmit={handleSubmit}>
                        <input type="text" className="border border-gray-300 rounded mb-2 px-2 py-1 w-40" placeholder="Enter tag name" value={tagName} onChange={(e) => setTagName(e.target.value)} />
                        <button className="inline bg-blue-400 mx-auto md:w-15 border-2 rounded-full" type="submit"> Add</button>
                    </form>
                </div>
        </div>
    </div>
    );
}


export default EditTagsForm;