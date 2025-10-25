import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

function PasswordInput({ value, onChange , placeholder = "Enter your Password" }) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="relative w-full">
      <input
        type={showPassword ? "text" : "password"}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="border p-2 w-full mb-3"
      />

      <button
        type="button"
        onClick={() => setShowPassword(!showPassword)}
        className="absolute inset-y-0 right-2 flex items-center text-gray-500 hover:text-gray-700"
      >
        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
      </button>
    </div>
  );
}

export default PasswordInput;
