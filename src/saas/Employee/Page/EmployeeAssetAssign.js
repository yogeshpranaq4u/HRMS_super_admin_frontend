import React, { useCallback, useEffect, useMemo, useState } from "react";
import "./EmployeeAssetAssign.css";
import { Table} from "antd";
import { Api, BaseUrl, ImagePath } from "../../Config/Api";
import { toast } from "react-toastify";
import axios from "axios";
// import NoImage from "../../Assets/imageno.png";
// import { IoCaretBackCircleSharp } from "react-icons/io5";
// import { IoCaretForwardCircle } from "react-icons/io5";
// import { Dialog, DialogContent } from "@material-ui/core";
import { COLOR, FONT, IMAGE } from "../../Config/Color";
import MainLayout from "../../../layouts/MainLayout";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { getEmployeeProfile } from "../../../redux/actions/employeeActions";
const commonTextStyle = {
  fontWeight: "500",
  fontSize: "13px",
  textAlign: "center",
  // marginLeft: 10,
  marginTop: 5,
  color: "#155596",
};
const EmployeeAssetAssign = () => {
  const employeeId = sessionStorage.getItem("employeeId");
  const token = sessionStorage.getItem("authToken");
  // const { setLoading, logout } = useAuth();
  const setLoading = () => { };
  const logout = () => { };
  const [employeeAssignAsset, setEmployeeAssignAsset] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(false);
  const [count, setCount] = useState(0);
  const dispatch = useDispatch()
  const profileData = useSelector((state) => state.employeeData?.profile)
  useEffect(() => {
    if (employeeId && (!profileData?.name)) {
      dispatch(getEmployeeProfile(employeeId))
    }
  }, []);
  const getEmployeeSalaryDetails = useCallback(
    async (data) => {
      setLoading(true);
      try {
        const responseData = await axios.get(
          `${BaseUrl}${Api.GET_EMP_ASSIGN_ASSETS}?employee_id=${employeeId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

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
          } else if (responseData?.data?.success == true) {
            setEmployeeAssignAsset(responseData?.data?.data);
            setLoading(false);
          } else {
            setEmployeeAssignAsset([]);
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
    },
    [token, setLoading, logout]
  );
  useEffect(() => {
    getEmployeeSalaryDetails();
  }, []);
  const columns = [
    {
      title: "S.NO",
      dataIndex: "sn",
      width: 80,
      key: "sn",
      render: (_, record, index) => (
        <span
          style={{
            flexDirection: "row",
            display: "flex",
            alignItems: "center",
          }}
        >
          {index + 1}
        </span>
      ),
    },

    // {
    //   title: "Employee Name",
    //   field: "employee_name",

    //   width: "200px",
    //   render: (rowData) => (
    //     <div style={{ display: "flex", alignItems: "center" }}>
    //       <>
    //         <img
    //           src={ImagePath + rowData?.user_image}
    //           style={{
    //             width: 50,
    //             height: 50,
    //             marginRight: 10,

    //             borderRadius: "50%",
    //             borderWidth: 2,

    //             borderColor: "#E2E8F099",
    //           }}
    //         />
    //       </>

    //       <span>{rowData.employee_name}</span>
    //     </div>
    //   ),
    // },

    {
      title: "NAME",
      dataIndex: "employee_name",
      key: "employee_name",
      width: 250,
      fixed: "left",
      render: (_, record) => (
        <div style={{ display: "flex", alignItems: "center", width: 200 }}>
          <img
            src={
              record?.user_image
                ? ImagePath + record?.user_image
                : IMAGE.NOIMAGE
            }
            style={{
              width: 50,
              height: 50,
              marginRight: 10,
              borderRadius: 10,
              border: "2px solid #E2E8F099",
            }}
            alt="Employee"
          />
          <span
            style={{
              fontFamily: FONT.INTER,
              fontSize: "14px",
              fontWeight: "600",
              lineHeight: "20px",
              color: COLOR.GRAY4,
            }}
          >
            {record?.employee_name}
          </span>
        </div>
      ),
    },
    {
      title: "Item Name",
      dataIndex: "itemname",
      key: "itemname",
      width: 200,
      render: (text) => (
        <span
          style={{
            whiteSpace: "pre-wrap",
            wordBreak: "break-word",
            display: "block", // Ensures it takes full width
            overflowWrap: "break-word",
          }}
        >
          {text}
        </span>
      ),
    },

    {
      title: "Item Image",
      dataIndex: "assetName",
      width: 200,
      render: (_, rowData, index) => {
        const images = rowData?.image || [];
        const maxVisible = 2; // Maximum images to show
        const extraCount = images.length - maxVisible; // Number of extra images

        return (
          <div style={{ display: "flex", alignItems: "center" }}>
            {images.slice(0, maxVisible).map((imageObj, index) => (
              <img
                key={index}
                onClick={() => handleImageClick(images)}
                src={imageObj?.image}
                style={{
                  width: 50,
                  height: 50,
                  marginLeft: -5,
                  borderRadius: "50%",
                  borderWidth: 2,
                  borderColor: "#E2E8F099",
                }}
              />
            ))}

            {extraCount > 0 && (
              <div
                style={{
                  width: 50,
                  height: 50,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: "#E2E8F099",
                  borderRadius: "50%",
                  fontSize: "12px",
                  color: "#000",
                  fontWeight: "bold",
                  marginLeft: 5,
                }}
              >
                +{extraCount}
              </div>
            )}
          </div>
        );
      },
    },
    { title: "Category", dataIndex: "categories", width: 150 },
    { title: "Model/Brand", dataIndex: "model", width: 150 },
    { title: "Model Number", dataIndex: "model_number", width: 150 },
    { title: "Serial Number", dataIndex: "serial_number", width: 150 },
    { title: "Assign By", dataIndex: "admin_name", width: 150 },
    { title: "Assign Date", dataIndex: "assigned_date", width: 150 },
    { title: "Return Date", dataIndex: "return_date", width: 150 },
    { title: "Return Status", dataIndex: "return_status", width: 150 },
    { title: "Receiver", dataIndex: "reciver_name", width: 150 },
  ];

  const handleImageClick = (image) => {
    setSelectedImage(image);
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
    setSelectedImage(null);
  };
  return (
    <MainLayout>
    <div className="page-wrapper">
      <div className="content">
      <h2
        style={{
          marginBottom: "10px",
          marginTop: "10px",
          fontSize: "24px",
          fontWeight: "700",
          fontFamily: "Inter",
          color: COLOR.BLACK,
        }}
      >
        Asset Assign Page
      </h2>
      <div
        style={{
          width: "100%",
        }}
      >
        <div
          style={{
            maxHeight: "90vh",
            overflowY: "auto",
            overflowX: "hidden",
          }}
        >
          <div className="p-4 rounded-lg bg-white shadow-sm">
            <div className="flex items-start space-x-6 p-4">
              {profileData?.image == null ? (
                <div
                  style={{
                    width: "60px",
                    height: "50px",
                    borderRadius: 8,
                    justifyContent: "center",
                    alignItems: "center",
                    display: "flex",
                    backgroundColor: "#155596",
                  }}
                >
                  <h1
                    style={{
                      fontSize: 20,
                      fontFamily: "cursive",
                      fontWeight: "bold",
                      color: "white",
                    }}
                  >
                    {profileData?.name
                      ? profileData.name.charAt(0).toUpperCase()
                      : ""}
                  </h1>
                </div>
              ) : (
                <img
                  src={ImagePath + profileData?.image}
                  alt="User"
                  className="w-14 h-14 rounded-md object-cover"
                />
              )}

              <div className="flex flex-col">
                <h2
                  style={{
                    fontSize: "18px",
                    fontFamily: "Inter",
                    fontWeight: "600",
                    lineHeight: "20px",
                    color: COLOR.BLACK,
                  }}
                >
                  {profileData?.name}
                </h2>
                <h2
                  style={{
                    fontSize: "14px",
                    fontFamily: FONT.INTER,
                    fontWeight: "500",
                    lineHeight: "22px",
                    marginTop: "5px",
                    color: COLOR.BLACK1,
                  }}
                >
                  {profileData?.designation}
                </h2>

                <div className="flex flex-wrap mt-2 gap-2">
                  <div className="flex items-center px-2 py-1 border border-dashed rounded-lg text-gray-800 space-x-2">
                    <img src={IMAGE.CONTACT} className="w-4 h-4" alt="icon" />
                    <span
                      style={{
                        fontSize: "14px",
                        fontFamily: FONT.INTER,
                        fontWeight: "500",
                        lineHeight: "22px",

                        color: COLOR.GRAY4,
                      }}
                    >
                      {profileData?.employee_code}
                    </span>
                  </div>
                  <div className="flex items-center px-2 py-1 border border-dashed rounded-lg text-gray-800 space-x-2">
                    <img src={IMAGE.PHONE} className="w-4 h-4" alt="icon" />
                    <span
                      style={{
                        fontSize: "14px",
                        fontFamily: FONT.INTER,
                        fontWeight: "500",
                        lineHeight: "22px",

                        color: COLOR.GRAY4,
                      }}
                    >
                      {" "}
                      {profileData?.mobile}
                    </span>
                  </div>
                  <div className="flex items-center px-2 py-1 border border-dashed rounded-lg text-gray-800 space-x-2">
                    <img src={IMAGE.EMAIL} className="w-4 h-4" alt="icon" />
                    <span
                      style={{
                        fontSize: "14px",
                        fontFamily: FONT.INTER,
                        fontWeight: "500",
                        lineHeight: "22px",

                        color: COLOR.GRAY4,
                      }}
                    >
                      {" "}
                      {profileData?.email}
                    </span>
                  </div>

                  <div className="flex items-center px-2 py-1 border border-dashed rounded-lg text-gray-800 space-x-2">
                    <img src={IMAGE.LOCATION} className="w-4 h-4" alt="icon" />
                    <span
                      style={{
                        fontSize: "14px",
                        fontFamily: FONT.INTER,
                        fontWeight: "500",
                        lineHeight: "22px",

                        color: COLOR.GRAY4,
                      }}
                    >
                      {profileData?.location}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-lg bg-white shadow-sm mt-5">
            <div className="flex items-center justify-between ">
              <h3
                style={{
                  fontSize: "16px",
                  fontWeight: "600",
                  fontFamily: "Inter",
                  color: COLOR.BLACK,
                  lineHeight: "20px",
                }}
              >
                Assets History
              </h3>
            </div>

            <div
              style={{
                marginTop: "20px",
                width: "100%",
                maxHeight: "90vh",
                overflowY: "auto",
                overflowX: "auto",
              }}
            >
              <Table
                className="dotted-border-table"
                columns={columns}
                dataSource={employeeAssignAsset}
                rowClassName={() => "custom-row"}
                bordered={false}
                tableLayout="fixed"
                rowKey="key"
                locale={{
                  emptyText: (
                    <div className="custom-no-data">No Assets Data Found</div>
                  ),
                }}
                pagination={{ pageSize: 8, position: ["bottomRight"] }}
                // style={{ tableLayout: "auto" }}

                scroll={{ x: 1000 }} // Ensures proper scrolling behavior
              />
            </div>
          </div>
        </div>
        {/* <Dialog open={open} onClose={handleClose}>
          <DialogContent style={{ padding: 0, position: "relative" }}>
            {selectedImage && selectedImage.length > 0 ? (
              <>
                <img
                  src={selectedImage[count]?.image}
                  style={{
                    width: 700,
                    height: 700,
                    objectFit: "cover",
                  }}
                  alt="Selected"
                />

                <IoCaretBackCircleSharp
                  size={50}
                  onClick={() => {
                    if (count > 0) {
                      setCount(count - 1);
                    }
                  }}
                  style={{
                    position: "absolute",
                    top: "50%",
                    left: "5px",
                    transform: "translateY(-70%)",
                    cursor: count > 0 ? "pointer" : "not-allowed",
                    opacity: count > 0 ? 1 : 0.5,

                    color: "black",
                  }}
                />

                <IoCaretForwardCircle
                  size={50}
                  onClick={() => {
                    if (count < selectedImage.length - 1) {
                      setCount(count + 1);
                    }
                  }}
                  style={{
                    position: "absolute",
                    top: "50%",
                    right: "5px",
                    transform: "translateY(-70%)",
                    cursor:
                      count < selectedImage.length - 1
                        ? "pointer"
                        : "not-allowed",
                    opacity: count < selectedImage.length - 1 ? 1 : 0.5,

                    color: "black",
                  }}
                />
              </>
            ) : (
              <img
                src={NoImage}
                style={{ width: 500, height: 500 }}
                alt="No image available"
              />
            )}
          </DialogContent>
        </Dialog> */}
      </div>
      </div>
      </div>

    </MainLayout>
  );
};

export default EmployeeAssetAssign;
