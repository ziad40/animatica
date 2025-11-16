import  { useRef, useState, useEffect } from "react";
import Playground from "./Playground";
import Solution from "./Solution";

// Interactive component wraps Playground (top) and Solution (bottom) with a horizontal splitter
const TwoDInteractive = ({ problem, isMobile }) => {
  const [topHeight, setTopHeight] = useState(60);
  const rightRef = useRef(null);
  const isDraggingH = useRef(false);

  const handleMouseDown = () => {
    isDraggingH.current = true;
    document.body.style.cursor = "row-resize";
    document.body.style.userSelect = "none";
  };

  useEffect(() => {
    const onMouseMove = (e) => {
      if (isDraggingH.current && rightRef.current) {
        const rect = rightRef.current.getBoundingClientRect();
        const py = e.clientY - rect.top;
        let percent = (py / rect.height) * 100;
        percent = Math.max(10, Math.min(90, percent));
        setTopHeight(percent);
      }
    };

    const onMouseUp = () => {
      isDraggingH.current = false;
      document.body.style.cursor = "default";
      document.body.style.userSelect = "auto";
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };
  }, []);

  return (
    <div
      ref={rightRef}
      style={{
        flex: 1,
        display: isMobile ? "block" : "flex",
        flexDirection: isMobile ? "unset" : "column",
        minWidth: "0",
        overflow: isMobile ? "visible" : "hidden",
      }}
    >
      {/* Playground (top) */}
      <div
        style={{
          height: isMobile ? "auto" : `${topHeight}%`,
          minHeight: isMobile ? "auto" : "50px",
          overflow: isMobile ? "visible" : "auto",
        }}
        className="bg-blue-50"
      >
        <Playground problem={problem} />
      </div>

      {/* Horizontal splitter - hidden on mobile */}
      {!isMobile && (
        <div
          onMouseDown={handleMouseDown}
          className="h-1 cursor-row-resize bg-transparent hover:bg-gray-200"
          style={{ cursor: "row-resize" }}
        />
      )}

      {/* Solution (bottom) */}
      <div
        style={{
          height: isMobile ? "auto" : `${100 - topHeight}%`,
          minHeight: isMobile ? "auto" : "50px",
          overflow: isMobile ? "visible" : "auto",
        }}
        className="bg-green-50"
      >
        <Solution problem={problem} />
      </div>
    </div>
  );
};

export default TwoDInteractive;
