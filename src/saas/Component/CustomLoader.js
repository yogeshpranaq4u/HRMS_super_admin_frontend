import React from "react";
import { Hourglass } from "react-loader-spinner";
import "./CustomLoader.css"; // Import custom styles if needed

const CustomLoader = () => {
  return (
    <div className="loader-overlay">
      <div className="loader-content">
        <Hourglass
          visible={true}
          height="80"
          width="80"
          ariaLabel="hourglass-loading"
          wrapperStyle={{}}
          wrapperClass=""
          colors={["#306cce", "#72a1ed"]}
        />
        <div className="loader-text">
          <h2>Loading...</h2>
        </div>
      </div>
    </div>
  );
};

export default CustomLoader;
