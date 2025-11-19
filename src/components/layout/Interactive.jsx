import  { useState, useEffect } from "react";
import TwoDInteractive from "./TwoDInteractive";
import ThreeDInteractive from "./ThreeDInteractive";

// Interactive component wraps Playground (top) and Solution (bottom) with a horizontal splitter
const Interactive = ({ problem, isMobile, threeDMode }) => {
  const [hasOpened3D, setHasOpened3D] = useState(false);

  useEffect(() => {
    if (threeDMode) setHasOpened3D(true);
  }, [threeDMode]);

  return (
    <div className="h-full">
      {/* 2D */}
      <div className={`${threeDMode ? "hidden" : "block"} w-full h-full flex-1 min-w-0`}>
        <TwoDInteractive problem={problem} isMobile={isMobile} />
      </div>

      {/* 3D (mount only after entering 3D the 1st time) */}
      {hasOpened3D && (
        <div className={`${threeDMode ? "block" : "hidden"} w-full h-full flex-1 min-w-0`} >
          <ThreeDInteractive problem={problem} threeDMode={threeDMode}/>
        </div>
      )}
    </div>
  );
};

export default Interactive;
