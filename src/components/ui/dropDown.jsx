import React, { useState, useEffect, useRef } from 'react';

// Controlled-friendly dropdown.
// Props:
// - options: [{label, value}]
// - onSelect: called with the option object when selected
// - selectedValue: the currently selected option's value (nullable)
// - placeholder, className
const DropDown = ({ options = [], onSelect = () => {}, placeholder = 'Select', className, selectedValue = null }) => {
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef(null);

    const toggleOpen = () => setIsOpen(v => !v);

    const handleSelect = (option) => {
        onSelect(option);
        setIsOpen(false);
    }

    // close on outside click
    useEffect(() => {
        const onDoc = (e) => {
            if (!containerRef.current) return;
            if (!containerRef.current.contains(e.target)) setIsOpen(false);
        };
        document.addEventListener('mousedown', onDoc);
        return () => document.removeEventListener('mousedown', onDoc);
    }, []);

    // Determine label to show from selectedValue prop
    const selectedLabel = options.find(o => String(o.value) === String(selectedValue))?.label;

    return (
        <div ref={containerRef} className="relative inline-block text-left">
            <button
                type="button"
                className={className}
                onClick={toggleOpen}
            >
                {selectedLabel || placeholder}
                <svg
                    className="-mr-1 ml-2 h-5 w-5 inline-block"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                >
                    <path
                        fillRule="evenodd"
                        d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.27a.75.75 0 01.02-1.06z"
                        clipRule="evenodd"
                    />
                </svg>
            </button>
            {isOpen && (
                // absolute positioned menu to float above other content
                <ul className="absolute z-50 mt-1 w-56 max-h-56 overflow-auto bg-white border rounded-md shadow-lg py-1">
                    {options.map((option) => (
                        <li
                            key={option.value}
                            onClick={() => handleSelect(option)}
                            className="block w-full text-left px-3 py-2 hover:bg-gray-100 cursor-pointer"
                        >
                            {option.label}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    )
}
export default DropDown;