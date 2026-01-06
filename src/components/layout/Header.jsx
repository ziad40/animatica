import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "@/context/UserContext";
import { Avatar } from "@/components/ui/Avatar";
import { LogOut, LogIn, UserPlus, History, BarChart3 } from "lucide-react";

const Header = () => {
  const { user, logoutUser } = useContext(UserContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logoutUser?.();
    navigate("/");
  };

  const handleLogIn = () => navigate("/login");
  const handleRegister = () => navigate("/register");

  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between gap-4">
        <h1 className="text-xl font-bold">CPU Scheduler</h1>

        <div className="ml-auto">
          {user ? (
            <UserLoggedIn user={user} onLogout={handleLogout} />
          ) : (
            <UserLoggedOut onLogin={handleLogIn} onRegister={handleRegister} />
          )}
        </div>
      </div>
    </header>
  );
};

const UserLoggedIn = ({ user, onLogout }) => {
  const navigate = useNavigate();

  const handleHistory = () => {
    if (user.role === "student") {
      navigate("/student-history");
    } else if (user.role === "teacher") {
      navigate("/teacher-dashboard");
    }
  };

  return (
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-2" title="profile data will be added later for student actions">
        <Avatar src={user?.avatar} />
        <span className="font-medium">{user?.username || "Guest"}</span>
      </div>

      {user.role === "student" && (
        <button
          onClick={handleHistory}
          aria-label="View History"
          className="inline-flex items-center gap-2 px-3 py-1 rounded-md text-sm text-gray-700 hover:bg-gray-100"
        >
          <History size={18} />
          <span className="hidden sm:inline">History</span>
        </button>
      )}

      {user.role === "teacher" && (
        <button
          onClick={handleHistory}
          aria-label="Teacher Dashboard"
          className="inline-flex items-center gap-2 px-3 py-1 rounded-md text-sm text-gray-700 hover:bg-gray-100"
        >
          <BarChart3 size={18} />
          <span className="hidden sm:inline">Dashboard</span>
        </button>
      )}

      <button
        onClick={onLogout}
        aria-label="Logout"
        className="inline-flex items-center gap-2 px-3 py-1 rounded-md text-sm text-gray-700 hover:bg-gray-100"
      >
        <LogOut size={18} />
        <span className="hidden sm:inline">Logout</span>
      </button>
    </div>
  );
};

const UserLoggedOut = ({ onLogin, onRegister }) => {
  return (
    <div className="flex items-center gap-3">
      <button
        onClick={onLogin}
        aria-label="Login"
        className="inline-flex items-center gap-2 px-3 py-1 rounded-md text-sm text-gray-700 hover:bg-gray-100"
      >
        <LogIn size={18} />
        <span className="hidden sm:inline">Login</span>
      </button>

      <button
        onClick={onRegister}
        aria-label="Register"
        className="inline-flex items-center gap-2 px-3 py-1 rounded-md text-sm text-gray-700 hover:bg-gray-100"
      >
        <UserPlus size={18} />
        <span className="hidden sm:inline">Register</span>
      </button>
    </div>
  );
};

export default Header;
