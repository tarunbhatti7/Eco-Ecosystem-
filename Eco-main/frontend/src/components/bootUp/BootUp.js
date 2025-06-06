import React, { useState, useEffect } from "react";
import "./BootUp.css"; // Assuming the CSS file exists
import video from "../../assets/video/bootVideo.mp4"


const BootUp = () => {
  const [showComponent, setShowComponent] = useState(true);
  const [loaderTimeOut, setLoaderTimeout] = useState(true);


  useEffect(() => {
   
    // loading screen
    const timeout = setTimeout(() => {
      setShowComponent(false);
    }, 4000); // Set the timeout to 2 seconds
    const timeout2 = setTimeout(() => {
      setLoaderTimeout(false);
    }, 2222);
    return () => {
      clearTimeout(timeout);
      clearTimeout(timeout2);
    };
  }, []);

  return (
    <>
      {showComponent && (
        <div className="boot-up-window" style={{
          opacity: loaderTimeOut ? 1 : 0,
          transition: "opacity 0.5s linear",
        }}>
          <video style={{ width: 300, height: 300, maxWidth: '100%', maxHeight: '100%' }} src={video} autoPlay muted />
        </div>
      )}
    </>
  );
};

export default BootUp;
