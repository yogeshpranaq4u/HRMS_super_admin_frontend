import React, { useEffect, useState } from "react";
import MainLayout from "../../layouts/MainLayout";
import BreadCrums from "../../components/BreadCrums";
import { Link } from "react-router-dom";
import TableComponent from "../../components/TableComponent";
import { useDispatch, useSelector } from "react-redux";
import { getCompanies } from "../../redux/actions/dashBoardActions";
import RegisterFromDemo from "../../components/RegisterFromDemo";
import ConfirmDelete from "../../modals/ConfirmDelete";
import Loader from "../../components/Loader";

const Company = () => {
  const dispatch = useDispatch()
  const [modalData, setModalData] = useState({ isOpen: false, data: "" })
  const isLoading = useSelector((state) => state.commenData.loading)
  const companiesData = useSelector((state) => state.commenData?.companiesData)
  const tableHeader = [
    "Company Name",
    "Domain Name",
    "Company Id",
    "Company Size",
    "DB Name",
    "Redirect URL",
    "Admin Email",
    "Contact Number",
    "Subscription Plan",
    "Start & End Date",
    "Status",
    "Service Type"
  ];

  const dataKeys = [
    "company_name",          // Company Name
    "company_domain",        // Domain Name
    "company_id",            // Company Id
    "team_size",             // Company Size
    "id",                    // DB Name (assuming "id" is used for DB name)
    "redirect_url",          // Redirect URL
    "admin_email",           // Admin Email
    "contact_no",            // Contact Number
    "plan_id",               // Subscription Plan (can be replaced with actual plan name if needed)
    "plan_dates",            // Start & End Date (combine `plan_start_date` & `plan_end_date`)
    "status",                // Status
    "service_type"           // Service Type (array stored as string)
  ];


  // console.log("companiesData", companiesData);

  useEffect(() => {
    dispatch(getCompanies("all"))
  }, [])
  const onClose = () => {
    setModalData((prev) => ({
      ...prev,
      type: "",
      isOpen: false,
    }))
  }
  const handleActions = (data, type) => {
    // console.log(data ,type);
    if (type == "view") {
      setModalData((prev) => ({
        ...prev,
        data: data,
        // isOpen: true,
        onConfirm: "",
        onClose: onClose
      }))

    } else if (type == "delete") {
      setModalData((prev) => ({
        ...prev,
        data: data,
        type: "delete",
        isOpen: true,
        onConfirm: "",
        onClose: onClose
      }))
    } else {
      setModalData((prev) => ({
        ...prev,
        data: data,
        type: "edit",
        isOpen: true,
        onClose: onClose
      }))
    }
  }



  return (
    <React.Fragment>
      <MainLayout>
        <div className="page-wrapper">
          <div className="content">
            {/* Breadcrumb */}
            <div className="d-md-flex d-block align-items-center justify-content-between page-breadcrumb mb-3">
              <BreadCrums
                title={"Companies"}
                data={[
                  { path: "/", title: "Superadmin" },

                  { path: "/company", title: "Company" },
                ]}
              />
              <div className="d-flex my-xl-auto right-content align-items-center flex-wrap ">
                <div className="me-2 mb-2">
                  {/* <div className="dropdown">
                    <Link
                      to="#"
                      className="dropdown-toggle btn btn-white d-inline-flex align-items-center"
                      data-bs-toggle="dropdown"
                    >
                      <i className="ti ti-file-export me-1" />
                      Export
                    </Link>
                    <ul className="dropdown-menu  dropdown-menu-end p-3">
                      <li>
                        <Link to="#" className="dropdown-item rounded-1">
                          <i className="ti ti-file-type-pdf me-1" />
                          Export as PDF
                        </Link>
                      </li>
                      <li>
                        <Link to="#" className="dropdown-item rounded-1">
                          <i className="ti ti-file-type-xls me-1" />
                          Export as Excel{" "}
                        </Link>
                      </li>
                    </ul>
                  </div> */}
                </div>
                <div className="mb-2">
                  <Link
                    to="#"
                    onClick={() => {
                      setModalData((prev) => ({
                        ...prev,
                        isOpen: true,
                        type: "Register",
                        onClose: onClose
                      }))
                    }}
                    className="btn btn-primary d-flex align-items-center"
                  >
                    <i className="ti ti-circle-plus me-2" />
                    Add Company
                  </Link>
                </div>
                <div className="ms-2 head-icons"></div>
              </div>
            </div>

            <div className="row">
              {/* Total Companies */}
              <div className="col-lg-3 col-md-6 d-flex">
                <div className="card flex-fill">
                  <div className="card-body d-flex align-items-center justify-content-between">
                    <div className="d-flex align-items-center overflow-hidden">
                      <span className="avatar avatar-lg bg-primary flex-shrink-0">
                        <i className="ti ti-building fs-16" />
                      </span>
                      <div className="ms-2 overflow-hidden">
                        <p className="fs-12 fw-medium mb-1 text-truncate">
                          Total Companies
                        </p>
                        <h4>950</h4>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/* /Total Companies */}
              {/* Total Companies */}
              <div className="col-lg-3 col-md-6 d-flex">
                <div className="card flex-fill">
                  <div className="card-body d-flex align-items-center justify-content-between">
                    <div className="d-flex align-items-center overflow-hidden">
                      <span className="avatar avatar-lg bg-success flex-shrink-0">
                        <i className="ti ti-building fs-16" />
                      </span>
                      <div className="ms-2 overflow-hidden">
                        <p className="fs-12 fw-medium mb-1 text-truncate">
                          Active Companies
                        </p>
                        <h4>920</h4>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/* /Total Companies */}
              {/* Inactive Companies */}
              <div className="col-lg-3 col-md-6 d-flex">
                <div className="card flex-fill">
                  <div className="card-body d-flex align-items-center justify-content-between">
                    <div className="d-flex align-items-center overflow-hidden">
                      <span className="avatar avatar-lg bg-danger flex-shrink-0">
                        <i className="ti ti-building fs-16" />
                      </span>
                      <div className="ms-2 overflow-hidden">
                        <p className="fs-12 fw-medium mb-1 text-truncate">
                          Inactive Companies
                        </p>
                        <h4>30</h4>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/* /Inactive Companies */}
              {/* Company Location */}
              <div className="col-lg-3 col-md-6 d-flex">
                <div className="card flex-fill">
                  <div className="card-body d-flex align-items-center justify-content-between">
                    <div className="d-flex align-items-center overflow-hidden">
                      <span className="avatar avatar-lg bg-skyblue flex-shrink-0">
                        <i className="ti ti-map-pin-check fs-16" />
                      </span>
                      <div className="ms-2 overflow-hidden">
                        <p className="fs-12 fw-medium mb-1 text-truncate">
                          Company Location
                        </p>
                        <h4>180</h4>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/* /Company Location */}
            </div>
            {
              isLoading ?
                <Loader /> :
                <div className="card">
                  <div className="card-header d-flex align-items-center justify-content-between flex-wrap row-gap-3">
                    <h5>Companies List</h5>
                    <div className="d-flex my-xl-auto right-content align-items-center flex-wrap row-gap-3">
                      <div className="me-3">
                        <div className="input-icon-end position-relative">
                          <span className="input-icon-addon">
                            <i className="ti ti-chevron-down" />
                          </span>
                        </div>
                      </div>
                      <div className="dropdown me-3">
                        <Link
                          to="#"
                          className="dropdown-toggle btn btn-white d-inline-flex align-items-center"
                          data-bs-toggle="dropdown"
                        >
                          Select Plan
                        </Link>
                        <ul className="dropdown-menu  dropdown-menu-end p-3">
                          <li>
                            <Link to="#" className="dropdown-item rounded-1">
                              Advanced
                            </Link>
                          </li>
                          <li>
                            <Link to="#" className="dropdown-item rounded-1">
                              Basic
                            </Link>
                          </li>
                          <li>
                            <Link to="#" className="dropdown-item rounded-1">
                              Enterprise
                            </Link>
                          </li>
                        </ul>
                      </div>
                      <div className="dropdown me-3">
                        <Link
                          to="#"
                          className="dropdown-toggle btn btn-white d-inline-flex align-items-center"
                          data-bs-toggle="dropdown"
                        >
                          Select Status
                        </Link>
                        <ul className="dropdown-menu  dropdown-menu-end p-3">
                          <li>
                            <Link to="#" className="dropdown-item rounded-1">
                              Active
                            </Link>
                          </li>
                          <li>
                            <Link to="#" className="dropdown-item rounded-1">
                              Inactive
                            </Link>
                          </li>
                        </ul>
                      </div>
                      <div className="dropdown">
                        <Link
                          to="#"
                          className="dropdown-toggle btn btn-white d-inline-flex align-items-center"
                          data-bs-toggle="dropdown"
                        >
                          Sort By : Last 7 Days
                        </Link>
                        <ul className="dropdown-menu  dropdown-menu-end p-3">
                          <li>
                            <Link to="#" className="dropdown-item rounded-1">
                              Recently Added
                            </Link>
                          </li>
                          <li>
                            <Link to="#" className="dropdown-item rounded-1">
                              Ascending
                            </Link>
                          </li>
                          <li>
                            <Link to="#" className="dropdown-item rounded-1">
                              Desending
                            </Link>
                          </li>
                          <li>
                            <Link to="#" className="dropdown-item rounded-1">
                              Last Month
                            </Link>
                          </li>
                          <li>
                            <Link to="#" className="dropdown-item rounded-1">
                              Last 7 Days
                            </Link>
                          </li>
                        </ul>
                      </div>
                    </div>
                  </div>
                  <div className="card-body sv-card-body p-3">
                    <div className="custom-datatable-filter table-responsive">
                      <TableComponent
                        tableHeader={tableHeader}
                        dataSource={companiesData?.data || []}
                        dataKeys={dataKeys || []}
                        onEdit={handleActions}
                        onView={handleActions}
                        handleDelete={handleActions}
                      />
                    </div>
                  </div>
                </div>

            }
          </div>

        </div>
      </MainLayout>
      {
        modalData.type == "delete" && modalData.isOpen ?
          <ConfirmDelete handleData={modalData} /> :
          modalData.isOpen &&
          <RegisterFromDemo handleData={modalData} />
      }
    </React.Fragment>
  );
};

export default Company;
