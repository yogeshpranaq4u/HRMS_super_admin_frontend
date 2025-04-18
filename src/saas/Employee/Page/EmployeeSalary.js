import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useAuth } from "../../Component/Authentication/AuthContext";
import { MdLaptopChromebook, MdOutlineMailOutline } from "react-icons/md";
import { BiBuildings } from "react-icons/bi";
import { TfiLocationPin } from "react-icons/tfi";
import { LuPhone } from "react-icons/lu";
import { Api, BaseUrl, ImagePath } from "../../Config/Api";
import "./EmployeeSalary.css";
import axios from "axios";
import { toast } from "react-toastify";
import MaterialTable from "material-table";
import Lottie from "lottie-react";
import Animation from "../../Assets/animation.json";
import { FaHospitalUser } from "react-icons/fa";
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
const EmployeeSalary = () => {
  const employeeId = sessionStorage.getItem("employeeId");
  const token = sessionStorage.getItem("authToken");
const setLoading = () => { };
  const logout = () => { };
  const [employeeSalary, setEmployeeSalary] = useState([]);
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
          `${BaseUrl}${Api.GET_EMPLOYEE_SALARY}?employee_id=${employeeId}`,
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
            setEmployeeSalary(responseData?.data?.data);
            setLoading(false);
          } else {
            setEmployeeSalary([]);
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
      title: "SN.",
      field: "sn",

      cellStyle: {
        position: "sticky",
        left: 0,
        backgroundColor: "#fff",
        zIndex: 1,
      },
    },
    { title: "Name", field: "name" },
    { title: "Month", field: "month" },
    {
      title: "Year",
      field: "year",
    },

    {
      title: "Paid Leave",
      field: "paidLeave",
      render: (rowData) => {
        const totalPaidLeave =
          (rowData.paid_full_day || 0) + (rowData.paid_half_day || 0);
        return totalPaidLeave.toString();
      },
    },
    { title: "Total Late", field: "lateCount" },
    {
      title: "UnPaid Leave",
      field: "unPaidLeave",
      render: (rowData) => {
        const totalPaidLeave =
          (rowData.unaprove_full_day || 0) +
          (rowData.unaprove_half_day || 0) +
          (rowData.unpaid_full_day || 0) +
          (rowData.unpaid_half_day || 0);
        return totalPaidLeave.toString();
      },
    },
    { title: "Total Leave", field: "total_Leave" },
    {
      title: "Total Days",
      field: "total_days",
    },
    {
      title: "Total Deduction",
      field: "total_salary_deduction",
      cellStyle: { color: "red" }, // Styling for the 'Total Deduction' column
    },
    {
      title: "Total Salary Days",
      field: "salary_days",
    },
  ];
  const memoizedData = useMemo(() => {
    return employeeSalary?.map((employee, index) => ({
      ...employee,
      sn: index + 1,
    }));
  }, [employeeSalary]);
  return (
    <div className="mainDivleave12">
      <h1
        style={{
          fontWeight: "700",
          fontSize: 30,
          color: "black",
          padding: 15,
          textAlign: "left",
        }}
      >
        Salary Page
      </h1>
      <div className="detailContainer12">
        <div
          style={{
            width: "100%",
            padding: 5,
            display: "flex",
            flexDirection: "row",
            flexWrap: "wrap",
            alignItems: "center",
            borderWidth: 1,
          }}
        >
          <div style={{ width: "93%", flex: 1 }}>
            <div
              style={{
                width: "100%",
                display: "flex",
                flexDirection: "row",
                alignItems: "center",
                paddingLeft: 15,

                flexWrap: "wrap",
              }}
            >
              <h1
                style={{
                  color: "#155596",
                  fontSize: "1.3rem",
                  fontWeight: "700",
                  flex: 1,
                  textAlign: "left",
                }}
              >
                {profileData?.name}
              </h1>
            </div>

            <div
              style={{
                width: "100%",
                display: "flex",
                flexWrap: "wrap",
                alignItems: "center",
                gap: 10, // Added gap for spacing
                paddingLeft: 15,
                paddingTop: 10,
              }}
            >
              <FaHospitalUser color="#155596" size={15} />
              <h3 style={commonTextStyle}>{profileData?.employee_code}</h3>
              <MdLaptopChromebook color="#155596" size={15} />
              <h3 style={commonTextStyle}>{profileData?.designation}</h3>
              <BiBuildings color="#155596" size={15} />
              <h3 style={commonTextStyle}>{profileData?.department}</h3>
              <TfiLocationPin color="#155596" size={15} />
              <h3 style={commonTextStyle}>{profileData?.location}</h3>
              <LuPhone color="#155596" size={15} />
              <h3 style={commonTextStyle}>{profileData?.mobile}</h3>
              <MdOutlineMailOutline color="#155596" size={15} />
              <h3 style={commonTextStyle}>{profileData?.email}</h3>
            </div>
          </div>

          <div
            style={{
              width: "90px",
              height: "90px",
              marginLeft: 10,
              borderRadius: "50%",
              overflow: "hidden",
              flexShrink: 0,
            }}
          >
            {profileData?.image == null || profileData?.image == "undefined" ? (
              <div
                style={{
                  width: "100%",
                  height: "100%",
                  borderRadius: "50%",
                  justifyContent: "center",
                  alignItems: "center",
                  display: "flex",
                  backgroundColor: "#155596", // Added background for initials
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
                  {profileData?.name?.charAt(0)?.toUpperCase()}
                </h1>
              </div>
            ) : (
              <img
                src={ImagePath + profileData?.image}
                alt="profile"
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                }}
              />
            )}
          </div>
        </div>
        <div style={{ width: "100%", marginTop: 20 }}>
          <div
            style={{
              marginBottom: 20,

              flexDirection: "row",
              display: "flex",
            }}
          >
            <h1 style={{ color: "#155596", fontWeight: "700", fontSize: 25 }}>
              Salary Information
            </h1>
          </div>
          <table className="employee-table232">
            {/* <thead>
              <tr>
                {columns.map((col, index) => (
                  <th
                    key={index}
                    style={{ whiteSpace: "nowrap", textAlign: "center" }}
                  >
                    {col.title}
                  </th>
                ))}
              </tr>
            </thead> */}

            <tbody>
              {employeeSalary?.length > 0 ? (
                <tr>
                  <td colSpan={columns.length}>
                    <MaterialTable
                      columns={columns}
                      data={memoizedData}
                      title={null}
                      options={{
                        paging: true,
                        search: false,
                        filtering: false,
                        sorting: true,
                        tableLayout: "fixed",
                        maxBodyHeight: "800px",
                        headerStyle: {
                          whiteSpace: "nowrap",
                          textAlign: "center",
                        },
                        cellStyle: {
                          whiteSpace: "nowrap",
                          textAlign: "center",
                        },
                      }}
                      components={{
                        Toolbar: () => null, // Removes toolbar
                      }}
                      style={{
                        boxShadow: "none",
                      }}
                    />
                  </td>
                </tr>
              ) : (
                <tr>
                  <td
                    colSpan={columns.length}
                    style={{ textAlign: "center", padding: "20px" }}
                  >
                    <Lottie
                      animationData={Animation}
                      loop={true}
                      style={{
                        height: "300px",
                        width: "300px",
                        margin: "0 auto",
                      }}
                    />
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {/* {employeeSalary?.length > 0 ? (
            <>
              <table className="employee-table232">
                <MaterialTable
                  columns={columns}
                  data={memoizedData}
                  title={null}
                  options={{
                    paging: true,
                    search: false,
                    filtering: false,
                    sorting: true,
                    tableLayout: "fixed",
                    maxBodyHeight: "800px",
                    headerStyle: {
                      whiteSpace: "nowrap",
                      textAlign: "center",
                    },
                    cellStyle: {
                      whiteSpace: "nowrap",
                      textAlign: "center",
                    },
                  }}
                  components={{
                  Toolbar: () => null, // Completely removes the toolbar
                }}
                  style={{
                    overflowX: "auto",
                    boxShadow: "none",
                  }}
                />
              </table>
            </>
          ) : (
            <div
              style={{
                width: "100%",
                justifyContent:'center',
                alignItems:'center',
                display:'flex'
              }}
            >
              <Lottie
                animationData={Animation}
                loop={true}
                style={{
                  height: "300px",
                  width: "300px",
       
                }}
              />
            </div>
          )} */}
        </div>
      </div>
    </div>
  );
};

export default EmployeeSalary;
