import React, { useState } from 'react'

const Switcher = ({ setThreeDMode }) => {
  const [isChecked, setIsChecked] = useState(false);

  const handleCheckboxChange = () => {
    setIsChecked((prev) => !prev);
    setThreeDMode((prev) => !prev);
  };

  return (
    <label className="flex cursor-pointer select-none items-center">
      <div className="relative">
        <input
          type="checkbox"
          checked={isChecked}
          onChange={handleCheckboxChange}
          className="sr-only peer"
        />

        {/* Background */}
        <div className="block h-8 w-14 rounded-full bg-gray-300 peer-checked:bg-blue-600 transition-colors"></div>

        {/* Dot */}
        <div className="dot absolute left-1 top-1 h-6 w-6 rounded-full bg-white transition-all peer-checked:translate-x-6"></div>
      </div>
    </label>
  );
};

export default Switcher;
