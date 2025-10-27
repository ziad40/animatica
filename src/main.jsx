import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { UserProvider } from "@/context/UserContext";
import Header from "@/components/layout/Header";
import Dashboard from "@/pages/Dashboard";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import "@/style.css";
import { OverlayProvider } from "@/context/OverlayContext";

function App() {
  return (
    <Router>
      <UserProvider>
        <OverlayProvider>
          <div className="min-h-screen bg-gray-50 flex flex-col">
            <Header />
            <main className="flex-1 p-6">
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
              </Routes>
            </main>
          </div>
        </OverlayProvider>
      </UserProvider>
    </Router>
  );
}

// Mount the app
const container = document.getElementById("root");
if (container) {
  const root = createRoot(container);
  root.render(<App />);
} else {
  console.error('Root container not found: ensure index.html contains <div id="root"></div>');
}

export default App;
