import React, { useEffect, useState } from "react";
import "../../Admin/AdminPage/OrganisationTree.css"
import { useAuth } from "../../Component/Authentication/AuthContext";
import axios from "axios";
import { Api, BaseUrl, ImagePath } from "../../Config/Api";
import { toast } from "react-toastify";
import Link from "../../Assets/link.png";
import NoImage from "../../Assets/imageno.png";
import Gmail from "../../Assets/gmail.png";
import Start from "../../Assets/Star.png";
import Dots from "../../Assets/dot.png";
import MainLayout from "../../../layouts/MainLayout";


const ProfileCard = ({ title, data, image }) => {
  return (
    <div
      style={{
        width: "100%",
        flexDirection: "row",
        padding: 10,
        marginTop: -5,
        paddingRight: 20,
        justifyContent: "space-between",
        display: "flex",
        alignItems: "center",
        // marginBottom: "5px",
      }}
    >
      <div
        style={{
          width: "100%",
          flexDirection: "row",
          display: "flex",
          alignItems: "center",
        }}
      >
        <img
          // key={item?.id || index}
          src={image ? ImagePath + image : NoImage}
          alt="Leader 1"
          style={{ width: 35, height: 35, borderRadius: 35 }}
        />
        <h3 style={{ fontWeight: "600", color: "#888888", marginLeft: 10 }}>
          {title}
        </h3>
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          alignItems: "flex-end",

          width: "10%",
        }}
      >
        <img
          src={Link}
          onClick={() => {
            // openLinkedIn();
          }}
          alt="Leader 1"
          style={{
            width: 20,
            height: 20,
            marginRight: 5,
            borderRadius: 5,
          }}
        />
        <img
          src={Gmail}
          onClick={() => {
            // openGmail();
          }}
          alt="Leader 1"
          style={{
            width: 20,
            height: 20,
            borderRadius: 5,
          }}
        />
      </div>
    </div>
  );
};
const EmployeeOrganisationTree = () => {
  const token = sessionStorage.getItem("authToken");

  const [adminList, setAdminList] = useState([]);
  const [employeeDetails, setEmployeeDetails] = useState([]);
  // const { setLoading, logout } = useAuth();
  const setLoading = () => { };
  const logout = () => { };
  const [recipientEmail, setRecipientEmail] = useState(
    "yogeshrana@cvinfotech.com"
  );

  useEffect(() => {
    getAdminList();
    getEMployeeList();
  }, []);

  const getAdminList = async () => {
    setLoading(true);

    try {
      const responseData = await axios.get(`${BaseUrl}${Api.GET_EMP_ADMIN}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (responseData?.data?.authenticated === false) {
        toast.error(responseData?.data?.mssg[0], {
          position: "top-center",
          autoClose: 1000,
        });
        logout();
      } else {
        if (responseData?.data?.valid === false) {
          toast.error(responseData?.data?.mssg[0], {
            position: "top-center",
            autoClose: 1000,
          });
          setLoading(false);
        } else {
          setAdminList(responseData?.data?.data);
          setLoading(false);
        }
      }
    } catch (error) {
      setLoading(false);
      console.error("API call failed:", error);
      toast.error("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  const getEMployeeList = async () => {
    setLoading(true);

    try {
      const responseData = await axios.get(`${BaseUrl}${Api.GET_EMP_USER}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (responseData?.data?.authenticated === false) {
        toast.error(responseData?.data?.mssg[0], {
          position: "top-center",
          autoClose: 1000,
        });
        logout();
      } else {
        if (responseData?.data?.valid === false) {
          toast.error(responseData?.data?.mssg[0], {
            position: "top-center",
            autoClose: 1000,
          });
          setLoading(false);
        } else {
          setEmployeeDetails(responseData?.data?.data);
          setLoading(false);
        }
      }
    } catch (error) {
      setLoading(false);
      console.error("API call failed:", error);
      toast.error("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  const openLinkedIn = () => {
    window.open(
      "https://www.linkedin.com/in/rakesh-rao-135a8190?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=android_app"
    );
  };

  const openGmail = () => {
    const senderEmail = "your-email@gmail.com"; // This will be the logged-in Gmail account, cannot be set programmatically
    const mailtoLink = `https://mail.google.com/mail/?view=cm&fs=1&tf=1&to=${encodeURIComponent(
      recipientEmail
    )}`;
    window.open(mailtoLink, "_blank");
  };
  return (
    <MainLayout>
      <div className="page-wrapper">
        <div className="content">
          <div className="org-chart">
            <div className="row leadership">
              <div className="node">
                {adminList
                  ?.filter((item) => item?.designation === "CEO & Co-Founder")
                  .map((item, index) => (
                    <>
                      <span
                        key={index}
                        style={{
                          marginLeft: -52,
                          color: "#1E1E1E",
                          fontWeight: "600",
                        }}
                      >
                        {item?.name}
                      </span>
                      <div style={{ alignItems: "center", justifyContent: "center" }}>
                        <div
                          style={{
                            display: "flex", // Added flexbox
                            justifyContent: "center",
                            alignItems: "center",
                            paddingLeft: 10,
                            paddingRight: 10,
                            background: "#DBEAFE",
                            borderRadius: 20,
                            marginRight: 10,
                            marginLeft: 10,
                            marginTop: 30,
                            paddingTop: 5,
                            paddingBottom: 2,
                            color: "#1E40AF",
                            fontWeight: "600",
                          }}
                        >
                          <span style={{ lineHeight: "normal", textAlign: "center" }}>
                            {item?.designation}
                          </span>
                        </div>
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "flex-end",
                            alignItems: "center",
                            // marginRight:10,
                            marginTop: 10,
                          }}
                        >
                          <img
                            src={Link}
                            alt="Leader 1"
                            style={{
                              width: 20,
                              height: 20,
                              borderRadius: 5,
                              marginRight: 10,
                            }}
                          />
                          <img
                            src={Gmail}
                            alt="Leader 1"
                            style={{
                              width: 20,
                              height: 20,
                              borderRadius: 5,
                              marginRight: 20,
                            }}
                          />
                        </div>
                      </div>

                      <img
                        key={item?.id || index}
                        src={item?.image ? ImagePath + item.image : NoImage}
                        alt="Leader 1"
                        className="profile-img"
                      />
                    </>
                  ))}
              </div>
              <div>
                <div className="connector">
                  <span>Leadership</span>
                </div>
                <div className="vertical-line2" style={{ marginTop: 20 }}></div>
                <div
                  style={{
                    justifyContent: "center",
                    alignItems: "center",
                    display: "flex",
                  }}
                >
                  <img
                    src={Start}
                    alt="Leader 1"
                    style={{ width: 35, height: 35, marginTop: -20 }}
                  />
                </div>
              </div>

              <div className="node">
                {adminList
                  ?.filter((item) => item?.designation === "CTO & Co-Founder")
                  .map((item, index) => (
                    <>
                      <img
                        key={item?.id || index}
                        src={item?.image ? ImagePath + item.image : NoImage}
                        alt="Leader 1"
                        className="profile-img"
                      />
                      <span
                        style={{
                          color: "#1E1E1E",
                          fontWeight: "600",
                        }}
                      >
                        {item?.name}
                      </span>
                      <div>
                        <div
                          style={{
                            display: "flex", // Added flexbox
                            justifyContent: "center",
                            alignItems: "center",
                            paddingLeft: 10,
                            paddingRight: 10,
                            background: "#DBEAFE",
                            borderRadius: 20,
                            marginRight: 10,
                            marginLeft: 10,
                            marginTop: 30,
                            paddingTop: 5,
                            paddingBottom: 2,
                            color: "#1E40AF",
                            fontWeight: "600",
                          }}
                        >
                          <span style={{ lineHeight: "normal", textAlign: "center" }}>
                            {item?.designation}
                          </span>
                        </div>
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "flex-start",
                            alignItems: "center",
                            marginTop: 10,
                          }}
                        >
                          <img
                            src={Link}
                            alt="Leader 1"
                            style={{
                              width: 20,
                              height: 20,
                              borderRadius: 5,
                              marginLeft: 20,
                            }}
                          />
                          <img
                            src={Gmail}
                            alt="Leader 1"
                            style={{
                              width: 20,
                              height: 20,
                              borderRadius: 5,
                              marginLeft: 10,
                            }}
                          />
                        </div>
                      </div>
                    </>
                  ))}
              </div>
            </div>

            <div className="connector-line">
              <div className="vertical-line"></div>
            </div>

            <div
              style={{
                width: "100%",
                height: 100,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                marginTop: -35,
              }}
            >
              <div
                style={{
                  width: "49%",
                  height: "100%",
                  alignItems: "center",
                  justifyContent: "flex-end",
                  display: "flex",
                }}
              >
                <div>
                  {adminList
                    ?.filter((item) => item?.designation === "Senior Human Resources")
                    .map((item, index) => (
                      <div
                        key={index}
                        style={{ display: "flex", alignItems: "center" }}
                      >
                        <span
                          style={{
                            marginLeft: 10,
                            color: "#1E1E1E",
                            fontWeight: "600",
                            whiteSpace: "nowrap", // Prevents wrapping
                          }}
                        >
                          {item?.name}
                        </span>
                        <div
                          style={{ alignItems: "center", justifyContent: "center" }}
                        >
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              paddingLeft: 10,
                              paddingRight: 10,
                              background: "#DBEAFE",
                              borderRadius: 20,
                              marginLeft: 10,
                              paddingTop: 5,
                              paddingBottom: 2,
                              color: "#1E40AF",
                              fontWeight: "600",
                              marginTop: 30,
                              // whiteSpace: "nowrap", // Ensures it stays inline
                            }}
                          >
                            <span
                              style={{ lineHeight: "normal", textAlign: "center" }}
                            >
                              {item?.designation}
                            </span>
                          </div>
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "flex-end",
                              alignItems: "center",

                              marginTop: 10,
                            }}
                          >
                            <img
                              src={Link}
                              alt="Leader 1"
                              style={{
                                width: 20,
                                height: 20,
                                borderRadius: 5,
                                marginRight: 10,
                              }}
                            />
                            <img
                              src={Gmail}
                              alt="Leader 1"
                              style={{
                                width: 20,
                                height: 20,
                                borderRadius: 5,
                                marginRight: 20,
                              }}
                            />
                          </div>
                        </div>
                        <img
                          key={item?.id || index}
                          src={item?.image ? ImagePath + item.image : NoImage}
                          alt="Leader 1"
                          className="profile-img"
                        />
                      </div>
                    ))}
                </div>

                <div className="vertical-line24"></div>

                <div
                  // className="label"
                  style={{
                    fontSize: 15,
                    padding: 10,
                    fontWeight: "600",
                    borderRadius: 30,
                    borderColor: "#3D3D3D",
                    borderWidth: 2,
                    background: "white",
                  }}
                >
                  Management
                </div>

                <div className="vertical-line25"></div>
              </div>

              <div
                style={{
                  width: "2%",
                  height: "100%",
                  justifyContent: "center",
                  alignItems: "center",
                  display: "flex",
                }}
              >
                <img src={Dots} alt="Manager 1" style={{ width: 30, height: 30 }} />
              </div>
              <div
                style={{
                  width: "49%",
                  height: "100%",
                  alignItems: "center",

                  display: "flex",
                }}
              >
                <div className="vertical-line24"></div>

                <div
                  style={{
                    fontSize: 15,
                    padding: 10,
                    fontWeight: "600",
                    borderRadius: 30,
                    borderColor: "#3D3D3D",
                    borderWidth: 2,
                    background: "white",
                  }}
                >
                  Management
                </div>

                <div className="vertical-line25"></div>
                <div>
                  {adminList
                    ?.filter((item) => item?.designation === "Accountant")
                    .map((item, index) => (
                      <div
                        key={index}
                        style={{ display: "flex", alignItems: "center" }}
                      >
                        <img
                          key={item?.id || index}
                          src={item?.image ? ImagePath + item.image : NoImage}
                          alt="Leader 1"
                          className="profile-img"
                        />
                        <span
                          style={{
                            marginLeft: 10,
                            color: "#1E1E1E",
                            fontWeight: "600",
                            whiteSpace: "nowrap", // Prevents wrapping
                          }}
                        >
                          {item?.name}
                        </span>
                        <div
                          style={{ alignItems: "center", justifyContent: "center" }}
                        >
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              paddingLeft: 10,
                              paddingRight: 10,
                              background: "#DBEAFE",
                              borderRadius: 20,
                              marginLeft: 10,
                              paddingTop: 5,
                              paddingBottom: 2,
                              color: "#1E40AF",
                              fontWeight: "600",
                              marginTop: 30,
                              whiteSpace: "nowrap", // Ensures it stays inline
                            }}
                          >
                            <span
                              style={{ lineHeight: "normal", textAlign: "center" }}
                            >
                              {item?.designation}
                            </span>
                          </div>
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "flex-end",
                              alignItems: "center",

                              marginTop: 10,
                            }}
                          >
                            <img
                              src={Link}
                              onClick={() => {
                                openLinkedIn();
                              }}
                              alt="Leader 1"
                              style={{
                                width: 20,
                                height: 20,
                                borderRadius: 5,
                                marginRight: 10,
                              }}
                            />
                            <img
                              src={Gmail}
                              onClick={() => {
                                openGmail();
                              }}
                              alt="Leader 1"
                              style={{
                                width: 20,
                                height: 20,
                                borderRadius: 5,
                                marginRight: 20,
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
            <div className="connector-line">
              <div className="vertical-line" style={{ height: 70 }}></div>
            </div>
            <div className="vertical-line3"></div>
            <div
              style={{
                width: "90%",
                height: 21,
                justifyContent: "space-between",
                display: "flex",
              }}
            >
              <div
                style={{
                  width: 2,
                  height: "100%",
                  background: "#00000033",
                }}
              ></div>
              <div
                style={{
                  width: 2,
                  height: "100%",
                  background: "#00000033",
                }}
              ></div>
              <div
                style={{
                  width: 2,
                  height: "100%",
                  background: "#00000033",
                }}
              ></div>
              <div
                style={{
                  width: 2,
                  height: "100%",
                  background: "#00000033",
                }}
              ></div>
            </div>
            <div
              style={{
                width: "90%",
                height: 450,
                marginLeft: 50,
                justifyContent: "space-between",
                display: "flex",
              }}
            >
              <div
                style={{
                  width: "24%",
                  height: "100%",
                  marginLeft: -50,
                  background: "#fff",
                  borderRadius: 10,
                  borderWidth: 1,
                  borderColor: "#00000033",
                  display: "flex",
                  flexDirection: "column",
                }}
              >
                <div
                  style={{
                    width: "100%",
                    flexDirection: "row",
                    padding: 10,
                    paddingRight: 20,
                    justifyContent: "space-between",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <h3 style={{ fontWeight: "600", color: "#888888" }}>WEB TEAM</h3>
                  <h3 style={{ fontWeight: "600", color: "#888888" }}>
                    (
                    {
                      employeeDetails?.filter(
                        (item) => item?.department === "Web Dept"
                      ).length
                    }
                    )
                  </h3>
                </div>
                <div style={{ width: "100%", height: 2, background: "#0000001F" }} />

                <div
                  style={{
                    flex: 1,
                    overflowY: "auto",
                    maxHeight: "calc(100% - 50px)",
                    padding: "10px",
                  }}
                >
                  {employeeDetails
                    ?.filter((item) => item?.department === "Web Dept")
                    .map((item, index) => (
                      <ProfileCard
                        key={index}
                        title={item?.name}
                        data={"Rakesh"}
                        image={item.image}
                      />
                    ))}
                </div>
              </div>

              <div
                style={{
                  width: "24%",
                  height: "100%",
                  background: "#fff",
                  borderRadius: 10,
                  borderWidth: 1,
                  borderColor: "#00000033",
                }}
              >
                <div
                  style={{
                    width: "100%",
                    flexDirection: "row",
                    padding: 10,
                    paddingRight: 20,
                    justifyContent: "space-between",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <h3 style={{ fontWeight: "600", color: "#888888" }}>APP TEAM</h3>
                  <h3 style={{ fontWeight: "600", color: "#888888" }}>
                    (
                    {
                      employeeDetails?.filter(
                        (item) => item?.department === "App Dept"
                      ).length
                    }
                    )
                  </h3>
                </div>
                <div style={{ width: "100%", height: 2, background: "#0000001F" }} />

                <div
                  style={{
                    flex: 1,
                    overflowY: "auto",
                    maxHeight: "calc(100% - 50px)",
                    padding: "10px",
                  }}
                >
                  {employeeDetails
                    ?.filter((item) => item?.department === "App Dept")
                    .map((item, index) => (
                      <ProfileCard
                        key={index}
                        title={item?.name}
                        data={"Rakesh"}
                        image={item.image}
                      />
                    ))}
                </div>
              </div>

              <div
                style={{
                  width: "24%",
                  height: "100%",
                  background: "#fff",
                  borderRadius: 10,
                  borderWidth: 1,
                  borderColor: "#00000033",
                }}
              >
                <div
                  style={{
                    width: "100%",
                    flexDirection: "row",
                    padding: 10,
                    paddingRight: 20,
                    justifyContent: "space-between",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <h3 style={{ fontWeight: "600", color: "#888888" }}>
                    PROJECT MANAGERS
                  </h3>
                  <h3 style={{ fontWeight: "600", color: "#888888" }}>
                    (
                    {
                      employeeDetails?.filter(
                        (item) => item?.department === "Project Management Dept"
                      ).length
                    }
                    )
                  </h3>
                </div>
                <div style={{ width: "100%", height: 2, background: "#0000001F" }} />

                <div
                  style={{
                    flex: 1,
                    overflowY: "auto",
                    maxHeight: "calc(100% - 50px)", // Adjust as needed
                    padding: "10px",
                  }}
                >
                  {employeeDetails
                    ?.filter((item) => item?.department === "Project Management Dept")
                    .map((item, index) => (
                      <ProfileCard
                        key={index}
                        title={item?.name}
                        data={"Rakesh"}
                        image={item.image}
                      />
                    ))}
                </div>
              </div>

              <div
                style={{
                  width: "24%",
                  height: "100%",
                  background: "#fff",
                  borderRadius: 10,
                  borderWidth: 1,
                  borderColor: "#00000033",
                }}
              >
                <div
                  style={{
                    width: "100%",
                    flexDirection: "row",
                    padding: 10,
                    paddingRight: 20,
                    justifyContent: "space-between",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <h3 style={{ fontWeight: "600", color: "#888888" }}>DESIGN TEAM</h3>
                  <h3 style={{ fontWeight: "600", color: "#888888" }}>
                    (
                    {
                      employeeDetails?.filter(
                        (item) => item?.department === "Design Dept"
                      ).length
                    }
                    )
                  </h3>
                </div>
                <div style={{ width: "100%", height: 2, background: "#0000001F" }} />

                <div
                  style={{
                    flex: 1,
                    overflowY: "auto",
                    maxHeight: "calc(100% - 50px)",
                    padding: "10px",
                  }}
                >
                  {employeeDetails
                    ?.filter((item) => item?.department === "Design Dept")
                    .map((item, index) => (
                      <ProfileCard
                        key={index}
                        title={item?.name}
                        data={"Rakesh"}
                        image={item.image}
                      />
                    ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default EmployeeOrganisationTree;
