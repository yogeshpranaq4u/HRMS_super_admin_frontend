import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom"; // For navigation
import VideoFile from "../Assets/NewImage/Splash.mp4";

const SplashScreen = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/login");
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div
      style={{
        // position: 'fixed',
        width: "100%",
        height: "100%",
        background: "black",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <video
        src={VideoFile}
        autoPlay
        // loop
        muted
        playsInline
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
        }}
        // onEnded={() => {
     
        //   navigate("/login");
        // }}
      />
    </div>
  );
};

export default SplashScreen;
