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
    <>
      {/* 2D */}
      <div className={threeDMode ? "hidden" : "block"}>
        <TwoDInteractive problem={problem} isMobile={isMobile} />
      </div>

      {/* 3D (mount only after entering 3D the 1st time) */}
      {hasOpened3D && (
        <div className={threeDMode ? "block" : "hidden"}>
          <ThreeDInteractive problem={problem} />
        </div>
      )}
    </>
  );
};

export default Interactive;
