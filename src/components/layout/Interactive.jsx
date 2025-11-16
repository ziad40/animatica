import  { useRef, useState, useEffect } from "react";
import TwoDInteractive from "./TwoDInteractive";
import ThreeDInteractive from "./ThreeDInteractive";

// Interactive component wraps Playground (top) and Solution (bottom) with a horizontal splitter
const Interactive = ({ problem, isMobile, threeDMode }) => {

  return (
    threeDMode ? <ThreeDInteractive problem={problem} /> : <TwoDInteractive problem={problem} isMobile={isMobile} />
  );
};

export default Interactive;
