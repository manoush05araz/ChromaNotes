import React from "react";

// Header component with title and Add Note button. Goes at the top of the page.

function Header({ onAddNote, currentTheme }) {

    const themeStyles = {
        light: "bg-gray-300 text-black",
        dark: "bg-gray-800 text-white",
        pastel: "bg-pink-200 text-black",
    }
    return (
        <header className={`fixed top-0 left-0 right-0 z-20 flex justify-between ${themeStyles[currentTheme]}`}>
            <h1 className="ml-52 font-semibold text-2xl">ChromaNotes</h1>
            <button className="bg-blue-500 text-white px-4 py-2 rounded" onClick={onAddNote}> Add Note </button>
        </header>
    );
}

export default Header;