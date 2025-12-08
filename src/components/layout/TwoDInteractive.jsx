import  { useRef, useState, useEffect } from "react";
import Playground from "./Playground";
import Solution from "./Solution";

const TwoDInteractive = ({ problem, isMobile, currentProblemId, setCurrentProblemId }) => {
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
    <div ref={rightRef} className="flex flex-col flex-1 min-w-0 h-full">
      <div
        style={{
          height: isMobile ? "auto" : `${topHeight}%`,
        }}
        className="bg-blue-50 overflow-auto"
      >
        <Playground problem={problem} currentProblemId={currentProblemId} setCurrentProblemId={setCurrentProblemId} />
      </div>

      {!isMobile && (
        <div
          onMouseDown={handleMouseDown}
          className="h-1 cursor-row-resize bg-transparent hover:bg-gray-200"
        />
      )}

      <div
        style={{
          height: isMobile ? "auto" : `${100 - topHeight}%`,
        }}
        className="bg-green-50 flex-1"
      >
        <Solution problem={problem} />
      </div>
    </div>
  );
};


export default TwoDInteractive;
