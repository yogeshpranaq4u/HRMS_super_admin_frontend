import React, { useEffect, useState } from "react";
import MainLayout from "../../layouts/MainLayout";
import BreadCrums from "../../components/BreadCrums";
import { Link } from "react-router-dom";
import TableComponent from "../../components/TableComponent";
import { useDispatch, useSelector } from "react-redux";
import { getAllPlans, getCompanies } from "../../redux/actions/dashBoardActions";
import RegisterFromDemo from "../../components/RegisterFromDemo";
import ConfirmDelete from "../../modals/ConfirmDelete";
import Loader from "../../components/Loader";
import Pagination from "../../components/Pagination";

const Company = () => {
  const dispatch = useDispatch()
  const [modalData, setModalData] = useState({ isOpen: false, data: "" })
  const isLoading = useSelector((state) => state.commenData.loading)
  const companiesData = useSelector((state) => state.commenData?.companiesData)
  const [searchText, setSearchText] = useState("")
  const [filters, setFilters] = useState({
    limit: 10,
    page: 1,
    deliver: "",
    status: "",
    sort: "",
    currentPage: 1,
  })
  const plansData = useSelector((state) => state.commenData.allPlans)

  useEffect(() => {
    dispatch(getAllPlans())
  }, [])
  const tableHeader = [
    "Company Name",
    "Domain Name",
    "Company Id",
    "Company Size",
    "DB Name",
    // "Redirect URL",
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
    // "redirect_url",          // Redirect URL
    "admin_email",           // Admin Email
    "contact_no",            // Contact Number
    "plan_id",               // Subscription Plan (can be replaced with actual plan name if needed)
    "plan_dates",            // Start & End Date (combine `plan_start_date` & `plan_end_date`)
           // Start & End Date (combine `plan_start_date` & `plan_end_date`)
    "status",                // Status
    "service_type"           // Service Type (array stored as string)
  ];


  // console.log("companiesData", companiesData);

  useEffect(() => {
    dispatch(getCompanies(filters))
  }, [filters])
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

  const handlePageChange = (page) => {
    // Call your API here to fetch data for the new page
    setFilters(prev => ({
      ...prev,
      currentPage: page,
      page: page
    }));
  };

  const sortOptions = [
    { title: "Recently Added", value: "recent_added" },
    { title: "Descending", value: "descending" },
    { title: "Ascending", value: "ascending" },
    { title: "Last Month", value: "last_month" },
    { title: "Last 7 Days", value: "last_7_days" },
  ];
  const changeFilter = (value, key) => {
    console.log(value, key);
    setFilters((prev) => ({
      ...prev,
      [key]: value
    }))
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
                      <div className="dropdown me-3">
                        <select value={filters?.status} onChange={(e) => {
                          changeFilter(e.target.value, "status")
                        }} className='select border py-2 px-2 rounded'>
                          <option value={""}> Select Status</ option>
                          {
                            ["Active", "Hold", "Inactive"]?.map((item, i) => {
                              return (
                                <option key={i} value={item}> {item}</ option>
                              )
                            })
                          }
                        </select>
                      </div>
                      <div className="dropdown me-3">
                        <select value={filters?.plan_id} onChange={(e) => {
                          changeFilter(e.target.value, "plan_id")
                        }} className='select border py-2 px-2 rounded'>
                          <option value={""}> Sort By :Plan</ option>
                          {
                            plansData?.data?.map((item, index) => {
                              return (
                                <option key={index} value={item?.id}>{item?.name || ""}</option>
                              )
                            })
                          }
                        </select>

                      </div>
                      <div className="dropdown ">
                        <select value={filters?.sort} onChange={(e) => {
                          changeFilter(e.target.value, "sort")
                        }} className='select border py-2 px-2 rounded'>
                          <option value={""}> Sort</ option>
                          {
                            sortOptions?.map((item, i) => {
                              return (
                                <option key={i} value={item.value}> {item.title}</ option>
                              )
                            })
                          }
                        </select>
                      </div>

                    </div>
                  </div>
                  <div className="row align-items-center px-3">
                    <div className="col-sm-12 col-md-6">
                      <div className="dataTables_length" >
                        <label>Entries
                          <select value={filters?.limit} onChange={(e) => {
                            changeFilter(e.target.value, "limit")
                          }} className="form-select form-select-sm">
                            <option value="10">10</option>
                            <option value="25">25</option>
                            <option value="50">50</option>
                            <option value="100">100</option>
                          </select>
                        </label>
                      </div>
                    </div>
                    <div className="col-sm-12 col-md-6">
                      <div className="dataTables_filter m-0 text-end">
                        <label>
                          <input type="search"
                            className="form-control form-control-sm"
                            placeholder="Search"
                            value={searchText}
                            onChange={(e) => {
                              setSearchText(e.target.value)
                            }}
                          />
                        </label></div>
                    </div>
                  </div>
                  <div className="card-body sv-card-body p-3">
                    <div className="custom-datatable-filter table-responsive">
                      <TableComponent
                        tableHeader={tableHeader}
                        dataSource={companiesData?.data?.filter((item) => {
                          if (searchText) {
                            return item.company_name.toLowerCase().includes(searchText.toLowerCase()) ||
                              item.company_domain.toLowerCase().includes(searchText.toLowerCase()) ||
                              item.admin_email.toLowerCase().includes(searchText.toLowerCase())
                          }
                          return item
                        }) || []}
                        historyLink={"#"}//here will be the history page link
                        dataKeys={dataKeys || []}
                        onEdit={handleActions}
                        onView={handleActions}
                        handleDelete={handleActions}
                      />
                    </div>
                  </div>
                </div>


            }
            <Pagination pagination={companiesData?.pagination} onPageChange={handlePageChange} />
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
