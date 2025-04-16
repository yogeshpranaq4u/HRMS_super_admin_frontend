import React from "react";
import "./Card.css";
import Modal from "react-responsive-modal";

import "react-responsive-modal/styles.css";
import NoImage from "../Assets/imageno.png";
import { ImagePath } from "../Config/Api";
import Confetti from "./Confetti";
import { IMAGE } from "../Config/Color";
const customStyles = {
  content: {
    background: "black", // Transparent content background
    border: "none", // No border
    boxShadow: "none", // Remove shadow
    padding: 0, // Remove padding
  },
  overlay: {
    background: "#FFFF00", // Transparent overlay background
  },
};

const Card = ({ open, onClose, data, type }) => {
  return (
    <Modal
      open={open}
      onClose={onClose}
      center
      showCloseIcon={false}
      closeOnOverlayClick={false}
      style={customStyles}
      classNames={{ modal: "custom-modagift" }}
    >
      <div className="container12">
        <div className="cardgift neon">
          <h1>
            {type == "BIRTHDAY"
              ? type
              : type == "Work Anniversary"
              ? "Work Anniversary"
              : "Holiday"}
            {type == "BIRTHDAY" || (type == "Work Anniversary" && "🎉")}{" "}
          </h1>

          <div
            style={{
              alignSelf: "center",
              alignContent: "center",
              justifyContent: "center",
              display: "flex",
            }}
          >
          
            <img
              src={
                type == "BIRTHDAY" || type == "Work Anniversary"
                  ? data?.image
                    ? ImagePath + data?.image
                    : IMAGE.NOIMAGE
                  : data?.image
                  ? ImagePath + data?.image
                  : IMAGE.NOIMAGE
              }
              alt="Profile"
              style={{
                width: "200px",
                height: "200px",
                borderRadius: 10,
                objectFit: "contain",
              }}
            />
          </div>
          <p style={{ marginTop: 10 }}>
            {type == "BIRTHDAY"
              ? `Happy Birthday,${data?.name} !`
              : type == "Work Anniversary"
              ? `Happy Work Anniversary,${data?.name} !`
              : "We wish you a"}
          </p>
          <p style={{ marginTop: -20 }}>
            {type == "BIRTHDAY" || type == "Work Anniversary"
              ? `Congratulations on this special day!`
              : `Happy ${type}, to all!`}
          </p>
          <div className="redirect-buttons">
            <a
              className="button"
              onClick={() => {
                onClose();
              }}
            >
              OK
            </a>
          </div>
        </div>
        <Confetti />
      </div>
    </Modal>
  );
};

export default Card;
