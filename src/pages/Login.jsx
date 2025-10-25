import React, { useContext, useState } from "react";
import { login } from "@/services/authService";
import { UserContext } from "@/context/UserContext";
import { useNavigate } from "react-router-dom";
import PasswordInput from "@/components/ui/passwordInput";

const Login = () => {
  // If your UserContext exposes a login handler, use it so the app updates immediately.
  const { loginUser } = useContext(UserContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = await login(email, password);
      if (token) {
        // update context so header and other components react immediately
        loginUser?.(token);
        alert("Login successful!");
        navigate("/"); // Redirect to home page after successful login
      } else {
        alert("Login failed: no token returned");
      }
    } catch (err) {
      alert("Login failed!");
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
      <PasswordInput
          value={password}
          onChange={(e) => setPassword(e.target.value)}
      />
      <button
        type="submit"
        className="bg-blue-500 text-white px-4 py-2 rounded w-full"
      >
        Login
      </button>
    </form>
  );
};

export default Login;


