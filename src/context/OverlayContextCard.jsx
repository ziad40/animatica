import { createContext, useContext, useState } from "react";

const OverlayContext = createContext();

export const OverlayProvider = ({ children }) => {
  const [overlay, setOverlay] = useState(null);

  // Show overlay for a few seconds
  const showOverlay = (content, duration = 2000) => {
    setOverlay(content);
    setTimeout(() => setOverlay(null), duration);
  };

  return (
    <OverlayContext.Provider value={{ showOverlay }}>
      {children}

      {/* Overlay display */}
      {overlay && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          {/* Blurred background */}
          <div className="absolute inset-0 bg-black/30 backdrop-blur-sm"></div>

          {/* Card content */}
          <div className="relative bg-white shadow-2xl rounded-2xl p-6 text-center animate-fade-in">
            {overlay}
          </div>
        </div>
      )}
    </OverlayContext.Provider>
  );
};

export const useOverlay = () => useContext(OverlayContext);
