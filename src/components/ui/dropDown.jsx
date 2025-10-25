import React, { useState } from 'react';

const DropDown = ({ options, onSelect, placeholder }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedOption, setSelectedOption] = useState(null);

    const toggleOpen = () => {
        setIsOpen(!isOpen)
    }
    const handleSelect = (option) => {
        setSelectedOption(option);
        onSelect(option);
        setIsOpen(false)
    }

    return (
        <div className="relative inline-block text-left">
            <button
                type="button"
                className="inline-flex justify-center w-full rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none"
                onClick={toggleOpen}
            >
                {selectedOption ? selectedOption.label : placeholder}
                <svg
                    className="-mr-1 ml-2 h-5 w-5"
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
                <ul className="dropdown-menu">
                {options.map((option) => (
                    <li className='inline-flex justify-center w-full rounded-md border border-gray-300 bg-gray-100' key={option.value} onClick={() => handleSelect(option)} >
                    {option.label}
                    </li>
                ))}
                </ul>
            )}
        </div>        
    )
}
export default DropDown;