import React, { useState } from 'react';

// component props: onSelect (function), placeholder (string)
// Renders a number input field that allows users to enter a number using input of type number.
const NumberInput = ({ onSelect, placeholder }) => {
    const [value, setValue] = useState("");
    const handleChange = (e) => {
        const newValue = e.target.value;
        setValue(newValue);
        if (onSelect) {
            onSelect(newValue);
        }
    }
    return (
        <input
            type="number"
            value={value}
            onChange={handleChange}
            placeholder={placeholder || "Enter a number"}
            className="border p-2 w-full m-4"
        />
    );
    
}
export default NumberInput;