import React, { useState } from "react";
import { register } from "@/services/authService";
import { useNavigate } from "react-router-dom";
import PasswordInput from "@/components/ui/passwordInput";

const Register = () => {
  // If your UserContext exposes a register handler, use it so the app updates immediately.
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [fullName, setFullName] = useState("");
  const [password, setPassword] = useState("");
  const [rePassword, setRePassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    // clear previous error
    setError("");

    // client-side validation: ensure passwords match
    if (password !== rePassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      const res = await register(name, email, password, fullName);
      if (res) {
        // update context so header and other components react immediately
        alert("registeration successful!");
        navigate("/login"); // Redirect to login page after successful registeration
      } else {
        alert(res.body.message || "registeration failed");
      }
    } catch (err) {
      alert("register failed!");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto mt-20">
      <input
        type="email"
        placeholder="Email"
        className="border p-2 w-full mb-3"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="username"
        placeholder="Username"
        className="border p-2 w-full mb-3"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
      <input
        type="Full Name"
        placeholder="full name"
        className="border p-2 w-full mb-3"
        value={fullName}
        onChange={(e) => setFullName(e.target.value)}
      />
      <PasswordInput
          value={password}
          onChange={(e) => setPassword(e.target.value)}
      />
      <PasswordInput
          value={rePassword}
          onChange={(e) => setRePassword(e.target.value)}
        placeholder="Re-enter your Password"
      />
      {error && <p className="text-sm text-red-600 mt-2">{error}</p>}
      <button
        type="submit"
        disabled={!email || !name || !fullName || !password || !rePassword || password !== rePassword}
        className={
          "w-full px-4 py-2 rounded " +
          (password && password === rePassword && email && name && fullName
            ? "bg-blue-500 text-white hover:bg-blue-600"
            : "bg-gray-200 text-gray-500 cursor-not-allowed")
        }
      >
        Register
      </button>
    </form>
  );
};

export default Register;
