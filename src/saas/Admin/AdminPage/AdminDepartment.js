import React, { useEffect, useState } from "react";
import "./AdminDepartment.css";
import { FaTrash } from "react-icons/fa";
import { useSelector } from "react-redux";
import AddDepartment from "../AdminComponent/AddDepartment";
import axios from "axios";
import { Api, BaseUrl } from "../../Config/Api";
import { toast } from "react-toastify";
import { useAuth } from "../../Component/Authentication/AuthContext";
import { useDispatch } from "react-redux";
import {
  setDepartement,
  setManagerData,
  setUserDetails,
} from "../../Redux/Action";
import SubAdminAccess from "../AdminComponent/SubAdminAccess";
import Pencile from "../../Assets/pencil.png";
import Delete from "../../Assets/Color.png";
import EditSubAdminAccess from "../AdminComponent/EditSubAdminAccess";
import { GoPlusCircle } from "react-icons/go";
const AdminDepartment = () => {
  const token = sessionStorage.getItem("authToken");
  const getEmployeeDetails = useSelector((state) => state.getEmployeeDetails);
  const [AddType, setAddType] = useState();
  const [modalOpen, setModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [accessModalOpen, setAccessModalOpen] = useState(false);
  const { setLoading, logout } = useAuth();
  const [adminList, setAdminList] = useState();
  const getReportingManager = useSelector((state) => state.getReportingManager);
  const getDepartement = useSelector((state) => state.getDepartement);
  const [showDialog, setShowDialog] = useState(false);
  const [subAdminData, setSubAdminData] = useState();
  const dispatch = useDispatch();
  useEffect(() => {
    getAdminList();
    getManagerList();
    getDepartmentList();
  }, [modalOpen]);

  const handleClick = (data) => {
    setAddType(data);
    setTimeout(() => {
      setModalOpen(true);
    }, 1000);
  };
  const getManagerList = async (data) => {
    setLoading(true);

    try {
      const responseData = await axios.get(
        `${BaseUrl}${Api.GET_ROPORTING_MANAGER}`,
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
        } else {
          dispatch(setManagerData(responseData?.data?.data));
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
  const getDepartmentList = async (data) => {
    setLoading(true);

    try {
      const responseData = await axios.get(`${BaseUrl}${Api.GET_DEPARTMENT}`, {
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
          dispatch(setDepartement(responseData?.data?.data));
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
  const deleteEmployeeDetails = async (type, data) => {
    setLoading(true);
    try {
      const response = await axios(
        `${BaseUrl}${
          type === "Department"
            ? Api.DELETE_DEPARTMENT
            : Api.DELETE_REPORT_MANAGER
        }`,
        {
          method: "POST",
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
          data: {
            auto_gen_id: data?.id,
          },
        }
      );

      if (response?.data?.authenticated === false) {
        toast.error(response?.data?.mssg[0], {
          position: "top-center",
          autoClose: 1000,
        });
        logout();
      } else {
        if (response?.data?.valid === false) {
          toast.error(response?.data?.mssg[0], {
            position: "top-center",
            autoClose: 1000,
          });
        } else {
          getManagerList();
          getDepartmentList();
          toast.success(response?.data?.mssg, {
            position: "top-center",
            autoClose: 1000,
          });
        }
      }
    } catch (error) {
      console.error("API call failed:", error);
      alert("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  const getAdminList = async () => {
    setLoading(true);

    try {
      const responseData = await axios.get(`${BaseUrl}${Api.GET_ADMIN}`, {
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
  const addSubAdmin = () => {
    setAccessModalOpen(true);
  };
  const subAdminEdit = () => {
    setEditModalOpen(true);
  };
  const deleteSubAdmin = async () => {
    setLoading(true);

    try {
      const response = await axios(`${BaseUrl}${Api.DELETE_ACCESS}`, {
        method: "POST",
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
        data: {
          employee_id: subAdminData?.id,
        },
      });

      if (response?.data?.authenticated === false) {
        toast.error(response?.data?.mssg[0], {
          position: "top-center",
          autoClose: 1000,
        });
        logout();
      } else {
        if (response?.data?.valid === false) {
          toast.error(response?.data?.mssg[0], {
            position: "top-center",
            autoClose: 1000,
          });
        } else {
          fetchEmployees();
          toast.success(response?.data?.mssg, {
            position: "top-center",
            autoClose: 1000,
          });
        }
      }
    } catch (error) {
      console.error("API call failed:", error);
      alert("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  const fetchEmployees = async () => {
    setLoading(true);

    try {
      const responseData = await axios.get(`${BaseUrl}${Api.GET_EMPLOYEE}`, {
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
          const employeeData = JSON.parse(
            JSON.stringify(responseData.data.data)
          );
          dispatch(setUserDetails(responseData?.data?.data));

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

  return (
    <div className="mainDetartment">
      <h1
        style={{
          fontWeight: "700",
          fontSize: 30,
          color: "black",
          marginTop:'15px',
          marginBottom:'15px',
          textAlign: "left",
        }}
      >
        Manage Department
      </h1>

      <div className="container">
        <div className="left-part">
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              width: "100%",
            }}
          >
            <span className="text">Department Name</span>

            <div
              style={{
                display: "flex",
                paddingLeft: 10,
                paddingRight: 10,
                height: 40,
                fontSize: 16,
                background: "#2A2C34",
                color: "white",
                borderRadius: 5,
                alignItems: "center",
                justifyContent: "center",
                gap: 10,
              }}
            >
              <GoPlusCircle />
              <button
                style={{
                  background: "transparent",
                  border: "none",
                  color: "white",
                  fontSize: 16,
                  cursor: "pointer",

                  fontWeight: "500",
                }}
                onClick={() => handleClick("department")}
              >
                Add Department
              </button>
            </div>
          </div>
          <div className="department-table-container">
            <table className="employee-table">
              <thead>
                <tr>
                  <th>S.N</th>
                  <th style={{ textAlign: "left" }}>Department Name</th>
                  <th style={{ width: "100px" }}>Action</th>
                </tr>
              </thead>
              {getDepartement?.map((name, index) => {
                return (
                  <tbody>
                    <td>{index + 1}</td>
                    <td style={{ textAlign: "left" }}>{name?.department}</td>
                    <td style={{ width: "100px" }}>
                      <img
                        src={Delete}
                        onClick={() => {
                          deleteEmployeeDetails("Department", name);
                        }}
                        alt="Mail Sent"
                        style={{
                          width: 25,
                          height: 25,
                          marginLeft: 25,
                          alignSelf: "center",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      />
                    </td>
                  </tbody>
                );
              })}
            </table>
          </div>
        </div>
        <div className="right-part">
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              width: "100%",
            }}
          >
            <span className="text">Reporting Manager</span>

            <div
              style={{
                display: "flex",
                paddingLeft: 10,
                paddingRight: 10,
                height: 40,
                fontSize: 16,
                background: "#2A2C34",
                color: "white",
                borderRadius: 5,
                alignItems: "center",
                justifyContent: "center",
                gap: 10,
              }}
            >
              <GoPlusCircle />
              <button
                style={{
                  background: "transparent",
                  border: "none",
                  color: "white",
                  fontSize: 16,
                  fontWeight: "500",
                  cursor: "pointer",
                 
                }}
                onClick={() => handleClick("manager")}
              >
                Add Manager
              </button>
            </div>
          </div>
          <div className="department-table-container">
            <table className="employee-table">
              <thead>
                <tr>
                  <th>S.N</th>
                  <th style={{ textAlign: "left" }}>Manager Name</th>

                  <th
                    style={{
                      width: "100px",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    Action
                  </th>
                </tr>
              </thead>

              {getReportingManager?.map((name, index) => {
                return (
                  <tbody>
                    <td>{index + 1}</td>
                    <td style={{ textAlign: "left" }}>{name?.name}</td>
                    <td
                      style={{
                        width: "100px",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <img
                        src={Delete}
                        onClick={() => {
                          deleteEmployeeDetails("Manager", name);
                        }}
                        alt="Mail Sent"
                        style={{
                          width: 25,
                          height: 25,
                          marginLeft: 25,
                          alignSelf: "center",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      />
                    </td>
                  </tbody>
                );
              })}
            </table>
          </div>
        </div>
      </div>
      <div className="container" style={{ marginTop: 30 }}>
        <div className="left-part">
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              width: "100%",
            }}
          >
            <span className="text">Admin Details</span>
          </div>
          <div className="department-table-container">
            <table className="employee-table">
              <thead>
                <tr>
                  <th>S.N</th>
                  <th style={{ textAlign: "left", width: 200 }}>Name</th>
                  <th>Email ID</th>
                  <th style={{ textAlign: "left", width: 150 }}>Designation</th>
                </tr>
              </thead>
              {adminList?.map((emp, index) => (
                <tr key={emp.id}>
                  <td>{index + 1}</td>
                  <td style={{ textAlign: "left", width: 200 }}>{emp?.name}</td>
                  <td style={{ textAlign: "left" }}>{emp?.email}</td>
                  <td style={{ textAlign: "left", width: 150 }}>
                    {emp?.designation}
                  </td>
                </tr>
              ))}
            </table>
          </div>
        </div>
        <div className="right-part">
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-between",
              width: "100%",
            }}
          >
            <span className="text">Sub Admin</span>

            <div
              style={{
                display: "flex",
                paddingLeft: 10,
                paddingRight: 10,
                height: 40,
                fontSize: 16,
                background: "#2A2C34",
                color: "white",
                borderRadius: 5,
                alignItems: "center",
                justifyContent: "center",
                gap: 10,
              }}
            >
              <GoPlusCircle />
              <button
                style={{
                  background: "transparent",
                  border: "none",
                  color: "white",
                  fontSize: 16,
                  fontWeight: "500",
                  cursor: "pointer",
                }}
                onClick={() => addSubAdmin()}
              >
                Add Sub Admin
              </button>
            </div>
          </div>
          <div className="department-table-container">
            <table className="employee-table">
              <thead>
                <tr>
                  <th>S.N</th>
                  <th style={{ textAlign: "left", width: 200 }}>Name</th>
                  <th style={{ textAlign: "left", width: 250 }}>
                    Page Access
                  </th>
                  <th>Action</th>
                </tr>
              </thead>

              {getEmployeeDetails
                ?.filter((item) => item?.page_access === 1)
                .map((item, index) => (
                  <tbody>
                    <td>{index + 1}</td>
                    <td style={{ textAlign: "left", width: 200 }}>
                      {item?.name}
                    </td>
                    <td style={{ textAlign: "left", width: 250 }}>
                      {item?.pages
                        ? JSON.parse(item.pages).join(", ")
                        : "No Pages Available"}{" "}
                    </td>
                    <td>
                      <div
                        style={{ display: "flex", justifyContent: "center" }}
                      >
                        <img
                          src={Pencile}
                          alt="Mail Sent"
                          style={{ width: 25, height: 25 }}
                          onClick={() => {
                            setSubAdminData(item);
                            subAdminEdit();
                          }}
                        />

                        <img
                          src={Delete}
                          onClick={() => {
                            setSubAdminData(item);
                            setShowDialog(true);
                          }}
                          alt="Mail Sent"
                          style={{
                            width: 25,
                            height: 25,
                            marginLeft: 10,
                            alignSelf: "center",
                            alignItems: "center",
                            justifyContent: "center",
                          }}
                        />
                      </div>
                    </td>
                  </tbody>
                ))}
            </table>
          </div>
        </div>
      </div>

      {showDialog && (
        <div className="dialog-backdrop">
          <div className="dialog">
            <p>Alert!</p>
            <p>Are you sure you want to remove this user?</p>
            <div className="dialog-buttons">
              <button
                onClick={() => {
                  setShowDialog(false);
                  deleteSubAdmin();
                }}
                className="confirm-btn"
              >
                Yes
              </button>
              <button
                onClick={() => {
                  setShowDialog(false);
                }}
                className="cancel-btn"
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}

      <AddDepartment
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        user={getEmployeeDetails}
        AddType={AddType}
      />
      <SubAdminAccess
        open={accessModalOpen}
        onClose={() => setAccessModalOpen(false)}
      />
      <EditSubAdminAccess
        open={editModalOpen}
        onClose={() => setEditModalOpen(false)}
        data={subAdminData}
      />
    </div>
  );
};

export default AdminDepartment;
