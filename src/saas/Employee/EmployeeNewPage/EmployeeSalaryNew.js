import React, { useCallback, useEffect, useState } from "react";
import { useAuth } from "../../Component/Authentication/AuthContext";
import axios from "axios";
import { Api, BaseUrl, ImagePath } from "../../Config/Api";
import { toast } from "react-toastify";
import { COLOR, FONT, IMAGE } from "../../Config/Color";
import { Table, Avatar, Select, Button, Pagination } from "antd";
import MainLayout from "../../../layouts/MainLayout";
const EmployeeSalaryNew = () => {
  const employeeId = sessionStorage.getItem("employeeId");
  const token = sessionStorage.getItem("authToken");
  // const { setLoading, logout } = useAuth();
  const setLoading = () => { };
  const logout = () => { };
  const [profileData, setProfileData] = useState([]);
  const [employeeSalary, setEmployeeSalary] = useState([]);

  const fetchEmployeProfile = useCallback(async () => {
    setLoading(true);

    try {
      const responseData = await axios.get(
        `${BaseUrl}${Api.GET_EMPLOYEE_PROFILE}?employee_id=${employeeId}`,
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
          setLoading(false);
          toast.error(responseData?.data?.mssg[0], {
            position: "top-center",
            autoClose: 1000,
          });
        } else {
          setProfileData(responseData?.data?.data);
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
  }, [token, setLoading, logout]);
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
    fetchEmployeProfile();
    getEmployeeSalaryDetails();
  }, []);
  const columns = [
    {
      title: "S.NO",
      dataIndex: "sn",

      key: "sn",
      render: (_, record, index) => (
        <div
          style={{
            flexDirection: "row",
            display: "flex",
            alignItems: "center",
          }}
        >

          {index + 1}
        </div>
      ),
    },
    {
      title: "NAME",
      dataIndex: "name",
      filterMultiple: true,
      key: "name",
      render: (text) => (
        <span
          style={{
            fontFamily: "Inter",
            fontWeight: "600",
            fontSize: "14px",
            lineHeight: "20px",
            color: COLOR.GRAY4,
          }}
        >
          {text}
        </span>
      ),
    },
    {
      title: "MONTH",
      dataIndex: "month",
      key: "month",
      render: (text) => (
        <span
          style={{
            fontFamily: "Inter",
            fontWeight: "500",
            fontSize: "14px",
            lineHeight: "22px",
            color: COLOR.GRAY3,
          }}
        >
          {text}
        </span>
      ),
    },
    {
      title: "YEAR",
      dataIndex: "year",
      key: "year",
      render: (text) => (
        <span
          style={{
            fontFamily: "Inter",
            fontWeight: "500",
            fontSize: "14px",
            lineHeight: "22px",
            color: COLOR.GRAY3,
          }}
        >
          {text}
        </span>
      ),
    },
    {
      title: "PAID LEAVE",
      dataIndex: "paid_leave",
      key: "paid_leave",
      render: (_, record) => {
        const totalPaidLeave = (Number(record.paid_full_day) || 0) + (Number(record.paid_half_day) || 0);
        return (
          <span
            style={{
              fontFamily: "Inter",
              fontWeight: "500",
              fontSize: "14px",
              lineHeight: "22px",
              color: COLOR.GRAY3,
            }}
          >
            {totalPaidLeave}
          </span>
        );
      },
    },
    {
      title: "UNPAID LEAVE",
      dataIndex: "unPaidLeave",
      key: "unPaidLeave",
      render: (_, record) => {
        const totalPaidLeave =
          (record.unaprove_full_day || 0) +
          (record.unaprove_half_day || 0) +
          (record.unpaid_full_day || 0) +
          (record.unpaid_half_day || 0);

        return (
          <span
            style={{
              fontFamily: "Inter",
              fontWeight: "500",
              fontSize: "14px",
              lineHeight: "22px",
              color: COLOR.GRAY3,
            }}
          >
            {totalPaidLeave.toString()}
          </span>
        );
      },
    },
    {
      title: "TOTAL LATE",
      dataIndex: "lateCount",
      key: "lateCount",
      render: (text) => (
        <span
          style={{
            fontFamily: "Inter",
            fontWeight: "500",
            fontSize: "14px",
            lineHeight: "22px",
            color: COLOR.GRAY3,
          }}
        >
          {text}
        </span>
      ),
    },


    {
      title: "TOTAL LEAVE",
      dataIndex: "total_Leave",
      key: "total_Leave",
      render: (text) => (
        <span
          style={{
            fontFamily: "Inter",
            fontWeight: "500",
            fontSize: "14px",
            lineHeight: "22px",
            color: COLOR.GRAY3,
          }}
        >
          {text}
        </span>
      ),
    },
    {
      title: "TOTAL DAYS",
      dataIndex: "total_days",
      key: "total_days",
      render: (text) => (
        <span
          style={{
            fontFamily: "Inter",
            fontWeight: "500",
            fontSize: "14px",
            lineHeight: "22px",
            color: COLOR.GRAY3,
          }}
        >
          {text}
        </span>
      ),
    },
    {
      title: "TOTAL DEDUCTION",
      dataIndex: "total_salary_deduction",
      key: "total_salary_deduction",
      render: (text) => (
        <span
          style={{
            fontFamily: "Inter",
            fontWeight: "500",
            fontSize: "14px",
            lineHeight: "22px",
            color: COLOR.GRAY3,
          }}
        >
          {text}
        </span>
      ),
    },
    {
      title: "TOTAL SALARY DAYS",
      dataIndex: "salary_days",
      key: "salary_days",
      render: (text) => (
        <span
          style={{
            fontFamily: "Inter",
            fontWeight: "500",
            fontSize: "14px",
            lineHeight: "22px",
            color: COLOR.GRAY3,
          }}
        >
          {text}
        </span>
      ),
    },
  ];

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
            Salary Page
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
                    Salary Details History
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
                    dataSource={employeeSalary}
                    pagination={{ pageSize: 8 }}
                    rowClassName={() => "custom-row"}
                    bordered={false}
                    style={{ tableLayout: "fixed" }}
                    rowKey="key"
                    locale={{
                      emptyText: (
                        <div className="custom-no-data">
                          No Salary History Data Found
                        </div>
                      ),
                    }}
                  />
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default EmployeeSalaryNew;
