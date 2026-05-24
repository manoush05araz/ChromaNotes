import React, {useState} from "react";


// Modal to add or remove tags

function ExportForm({note, setShowExportForm, handleExportFormSubmit, theme}) {
    //styles 
    const themeStyles = {
    light: "bg-white text-gray-900",
    dark: "bg-gray-800 text-white",
    pastel: "bg-pink-100 text-gray-900",
  };

    return (
    <div className="fixed inset-0 bg-black/10 flex items-center justify-center z-50 " id="myModal">
        <div className={`w-4/5 max-w-lg p-6 rounded shadow-lg relative ${themeStyles[theme]}`}>
            <button className="cursor-pointer absolute top-2 right-3 text-gray-400 text-2xl font-bold hover:text-black" id="closeModal" onClick={() => setShowExportForm(false)}>
                &times;
            </button>

            <h2 className="text-center text-xl font-semibold mb-4">Export Note: {note.title}</h2>
            <div className="ml-20 mr-20 flex justify-between">
                <button className="bg-blue-400 md:w-30 border-2 rounded-full cursor-pointer" onClick={() => handleExportFormSubmit("pdf")}>
                    PDF
                </button>
                <button className="bg-blue-400 md:w-30 border-2 rounded-full cursor-pointer" onClick={() => handleExportFormSubmit("txt")}>
                    Text File
                </button>
            </div>
        </div>
    </div>
    );
}


export default ExportForm;