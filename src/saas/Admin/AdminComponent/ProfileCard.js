import React from "react";

const ProfileCard = ({ title, data }) => {
  // const getdata = () => {
  //   if (title == "Experience") {
  //     if (data > 1) {
  //       return " years";
  //     }else{
  //       return " year";
  //     }
  //   } else {
  //     return "";
  //   }
  // };
  return (
    <div
      style={{
        width: "100%",
        flexDirection: "row",
        padding: 10,
        paddingRight: 20,
        justifyContent: "space-between",
        display: "flex",
        alignItems: "center",
        marginBottom: "5px",
      }}
    >
      <h3 style={{ fontWeight: "600", color: "#888888" }}>{title}</h3>
      <h3 style={{ fontWeight: "600", color: "#888888" }}>
        {data}
        {/* {getdata()} */}
      </h3>
    </div>
  );
};

export default ProfileCard;
