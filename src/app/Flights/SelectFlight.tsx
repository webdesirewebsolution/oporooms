'use client'

import React, { useContext } from "react";
import { Context } from "@/Context/context";

const SelectFlight = ({ id }: { id: string }) => {
    const { selectedFlight, setSelectedFlight } = useContext(Context);

    const handleSelect = () => {
        setSelectedFlight({ id })
    };

    return (
        <div
            onClick={handleSelect}
            className={`w-6 h-6 rounded-full border-2 cursor-pointer flex items-center justify-center ${selectedFlight.id == id ? "bg-blue-500 border-blue-500" : "border-gray-400"
                }`}
        >
            {selectedFlight.id == id && <div className="w-3 h-3 bg-white rounded-full"></div>}
        </div>
    );
};

export default SelectFlight