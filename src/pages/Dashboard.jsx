import React, { useEffect, useRef, useState } from "react";
import Problem from "@/components/layout/Problem";
import Interactive from "@/components/layout/Interactive";

const Dashboard = () => {
  const [problem, setProblem] = useState(null);
  const [currentProblemId, setCurrentProblemId] = useState(null);
  const [threeDMode, setThreeDMode] = useState(false);
  // left column width in percent (0-100)
  const [leftWidth, setLeftWidth] = useState(40);
  // top area height in percent inside right column
  const [topHeight, setTopHeight] = useState(60);

  const containerRef = useRef(null);
  const rightRef = useRef(null);
  const isDraggingV = useRef(false);
  const isDraggingH = useRef(false);

  useEffect(() => {
    const onMouseMove = (e) => {
      if (isDraggingV.current && containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const px = e.clientX - rect.left;
        let percent = (px / rect.width) * 100;
        percent = Math.max(10, Math.min(90, percent));
        setLeftWidth(percent);
      }

      if (isDraggingH.current && rightRef.current) {
        const rect = rightRef.current.getBoundingClientRect();
        const py = e.clientY - rect.top;
        let percent = (py / rect.height) * 100;
        percent = Math.max(10, Math.min(90, percent));
        setTopHeight(percent);
      }
    };

    const onMouseUp = () => {
      isDraggingV.current = false;
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

  // mobile breakpoint detection (simple)
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  return (
    <div className="h-full">
      {/* Responsive layout: desktop/tablet -> two columns with right split; mobile -> stacked */}
      <div
        ref={containerRef}
        className="w-full h-[calc(100vh-80px)] bg-transparent"
        style={{ display: "flex", flexDirection: isMobile ? "column" : "row" }}
      >
        {/* LEFT: Problem pane */}
        <div
          style={{
            flexBasis: isMobile ? "auto" : `${leftWidth}%`,
            flexGrow: 0,
            flexShrink: 0,
            minWidth: isMobile ? "100%" : "200px",
            overflow: "auto",
          }}
          className="border-r border-gray-200 bg-white"
        >
          <Problem problem = {problem} setProblem={setProblem}
           threeDMode={threeDMode} setThreeDMode={setThreeDMode}
           currentProblemId={currentProblemId} setCurrentProblemId={setCurrentProblemId}/>
        </div>

        {/* Vertical splitter - hidden on mobile */}
        {!isMobile && (
          <div
            onMouseDown={(e) => {
              isDraggingV.current = true;
              document.body.style.cursor = "col-resize";
              document.body.style.userSelect = "none";
            }}
            className="w-1 cursor-col-resize bg-transparent hover:bg-gray-200"
            style={{ cursor: "col-resize" }}
          />
        )}

        {/* RIGHT: Interactive (Playground + Solution with splitter / 3D) */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <Interactive problem={problem} isMobile={isMobile} threeDMode={threeDMode} currentProblemId={currentProblemId} setCurrentProblemId={setCurrentProblemId}/>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
