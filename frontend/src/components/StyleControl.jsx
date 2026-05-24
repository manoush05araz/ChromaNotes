import React, { useEffect, useState } from "react";

//List of colours the user can pick from
const COLOURS = [
   "#FEF3C7","#FDE68A","#FBCFE8","#E9D5FF","#BFDBFE",
  "#BBF7D0","#FCA5A5","#FECACA","#A7F3D0","#F5D0FE",
  "#FEE2E2","#D9F99D","#E0E7FF","#F1F5F9" 
];

//List of fonts the user can pick from
const FONTS = [
  { value: "arial", label: "Arial", fontFamily: "Arial, sans-serif" },
  { value: "times", label: "Times New Roman", fontFamily: "'Times New Roman', serif" },
  { value: "comic", label: "Comic Sans", fontFamily: "'Comic Sans MS', cursive" },
  { value: "georgia", label: "Georgia", fontFamily: "Georgia, serif" },
  { value: "verdana", label: "Verdana", fontFamily: "Verdana, sans-serif" },
  { value: "courier", label: "Courier New", fontFamily: "'Courier New', monospace" },
  { value: "impact", label: "Impact", fontFamily: "Impact, sans-serif" },
  { value: "trebuchet", label: "Trebuchet MS", fontFamily: "'Trebuchet MS', sans-serif" },
  { value: "garamond", label: "Garamond", fontFamily: "Garamond, serif" },
  { value: "brush", label: "Brush Script", fontFamily: "'Brush Script MT', cursive" }
];

export default function StyleControl({colour, setColour, fontStyle, setFont, fontSize, setFontSize}){
    const [localSize, setLocalSize] = useState(fontSize ?? 14);

    useEffect(() => {
        setLocalSize(fontSize ?? 14);
    }, [fontSize]);

    const handleFontSizeChange = (e) => {
        setLocalSize(e.target.value); //for the user to type freely
    }
    
    const handleFontSizeBlur = () => {
        let value = Number(localSize);

        if (Number.isNaN(value)) value = 14; //default value
        if (value < 8) value = 8; //min value of 8
        if (value > 48) value = 48; //max 

        setLocalSize(value);
        setFontSize(value); //update only after clamping
    }
    
    return (
        <div className="space-y-3 mt-4">
            {/* Colour Options */}
            <div>
                <p className="mb-1 font-medium">Colour:</p>
                <div className="flex flex-wrap gap-2">
                    {COLOURS.map((c) => (
                        <button key={c} type="button" onClick={() => {setColour(c); console.log("Colour selected:", c);}} className={`w-7 h-7 rounded-full border shadow-sm`}
                        style={{
                            backgroundColor: c, outline: colour === c ? "2px solid #2563EB" : "none" //visual ring around colour selected
                        }}
                        title={c}
                        />
                    ))}
                </div>
            </div>

            {/* Font Selector */}
            <div>
                <p className=" mb-1 font-medium">Font:</p>
                <select className="select select-bordered select-sm" value={fontStyle} onChange={(e) => setFont(e.target.value)}>
                    {FONTS.map((font) => (
                        <option key={font.value} value={font.value}>{font.label}</option>
                    ))}
                </select>
            </div>

            {/* Font Size Selector */}
            <div>
                <p className="text-sm mb-1 font-medium">Font Size (px):</p>
                <input type="number" value={localSize} onChange={handleFontSizeChange} onBlur={handleFontSizeBlur} className="input input-bordered input-sm w-full max-w-xs"/>
            </div>
        </div>
    );
}