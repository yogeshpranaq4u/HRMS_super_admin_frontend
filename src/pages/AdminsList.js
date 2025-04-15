import React, { useEffect, useState } from "react";
import MainLayout from "../layouts/MainLayout";
import BreadCrums from "../components/BreadCrums";
import TableComponent from "../components/TableComponent";
import { useDispatch, useSelector } from "react-redux";
import { getAllPlans, getCompanies } from "../redux/actions/dashBoardActions";
import RegisterFromDemo from "../components/RegisterFromDemo";
import ConfirmDelete from "../modals/ConfirmDelete";
import Loader from "../components/Loader";
import Pagination from "../components/Pagination";
import CompanyDetails from "../components/CompanyDetails";
import UpGradePlan from "../modals/UpGradePlan";
import { getServiceType } from "../redux/actions/otherActions";
import { Api } from "../config/apiEndPoints";
import { callApi } from "../config/apiCall";
import InvoicePreview from "../modals/InvoicePreview";

const AdminsList = () => {
  const dispatch = useDispatch()
  const [modalData, setModalData] = useState({ isOpen: false, data: "" })
  const isLoading = useSelector((state) => state.commenData.loading)
  const companiesData = useSelector((state) => state.commenData?.companiesData)
  const [searchText, setSearchText] = useState("")
  const [pageStats, setPageStats] = useState()
  const details = JSON.parse(sessionStorage.getItem("userDetails")) || {}

  const [filters, setFilters] = useState({
    limit: 10,
    page: 1,
    deliver: "",
    status: "",
    sort: "",
    currentPage: 1,
  })

  const formateForPlans = companiesData?.data?.map((item) => {
    const { company_name, company_logo,
      current_plan, service_type, id, ...rest } = item
    return {
      company_name,
      company_logo,
      service_type,
      id,
      ...current_plan
    }
  })
  useEffect(() => {
    dispatch(getCompanies(filters))
  }, [filters])
  useEffect(() => {
    dispatch(getAllPlans())
    fetchStats()
  }, [])
  const tableHeader = [
    "Company Name",
    "Service Type",
    "Subscription Plan",
    "Purchase Date",
    "Expiry Date",
    // "Plan Status",
    "Amount",
  ];

  const dataKeys = [
    "company_name",          // Company Name
    "services",          // Service Type (array stored as string)
    "plan_name",
    "start_date",
    "end_date",
    // "status",       
    "total_price",
  ];
  // console.log("companiesData ₹",formateForPlans,companiesData?.data);

  const onClose = () => {
    setModalData((prev) => ({
      ...prev,
      type: "",
      isOpen: false,
    }))
  }
  const handleActions = (data, type) => {
    setModalData((prev) => ({
      ...prev,
      data: data,
      type: type,
      isOpen: true,
      onConfirm: "",
      onClose: onClose
    }))
  }

  const fetchStats = async () => {
    try {
      const response = await callApi(Api.PLANSSTATS, "GET", "", details?.token)
      if (response.authenticated && response.valid) {
        // console.log(response);
        setPageStats(response.data || {})
      }

    } catch (error) {
      console.log(error);
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

  const changeFilter = (value, key) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value
    }))
  }

  // console.log("pageStats" ,pageStats);
  


  return (
    <React.Fragment>
      <MainLayout>
        <div className="page-wrapper">
          <div className="content">
            {/* Breadcrumb */}
            <div className="d-md-flex d-block align-items-center justify-content-between page-breadcrumb mb-3">
              <BreadCrums
                title={"Super Admin"}
                data={[
                  { path: "/", title: "Superadmin" },

                  { path: "#", title: "Admins List" },
                ]}
              />
              <div className="d-flex my-xl-auto right-content align-items-center flex-wrap ">
                <div className="me-2 mb-2">

                </div>
                <div className="mb-2">
                  <a
                    to="#"
                    onClick={() => {
                      setModalData((prev) => ({
                        ...prev,
                        isOpen: true,
                        type: "addPlan",
                        onClose: onClose
                      }))
                    }}
                    className="btn btn-primary d-flex align-items-center"
                  >
                    Add Payment
                    <i className="ti ti-circle-plus ml-1" />
                  </a>
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
                      <span className="avatar avatar-lg bg-info flex-shrink-0">
                        {/* <i className="ti ti-building fs-16" /> */}
                        <i className="ti ti-location-dollar fs-16"></i>
                      </span>
                      <div className="ms-2 overflow-hidden">
                        <p className="fs-12 fw-medium mb-1 text-truncate">
                          Total Transaction
                        </p>
                        <h4>{pageStats?.total_transactions || 0}</h4>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-lg-3 col-md-6 d-flex">
                <div className="card flex-fill">
                  <div className="card-body d-flex align-items-center justify-content-between">
                    <div className="d-flex align-items-center overflow-hidden">
                      <span className="avatar avatar-lg flex-shrink-0" style={{ background: "#00C7BE" }}>
                        <i className="ti ti-users fs-16" />
                      </span>
                      <div className="ms-2 overflow-hidden">
                        <p className="fs-12 fw-medium mb-1 text-truncate">
                          Total Subscribers
                        </p>
                        <h4>{pageStats?.total_subscribers || 0}</h4>
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
                        <i className="ti ti-user-check fs-16" />
                      </span>
                      <div className="ms-2 overflow-hidden">
                        <p className="fs-12 fw-medium mb-1 text-truncate">
                          Active Subscribers
                        </p>
                        <h4>{pageStats?.active_subscribers || 0}</h4>
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
                        <i className="ti ti-user-x fs-16" />
                      </span>
                      <div className="ms-2 overflow-hidden">
                        <p className="fs-12 fw-medium mb-1 text-truncate">
                          Expired Subscribers
                        </p>
                        <h4>{pageStats?.expired_subscribers| "0"}</h4>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

            </div>
            {
              isLoading ?
                <Loader /> :
                <div className="card">
                  <div className="card-header d-flex align-items-center justify-content-between flex-wrap row-gap-3">
                    <h5>Companies Plans </h5>
                    
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
                        dataSource={formateForPlans?.filter((item) => {
                          if (searchText) {
                            return item.company_name.toLowerCase().includes(searchText.toLowerCase()) ||
                              item.plan_name.toLowerCase().includes(searchText.toLowerCase())
                          }
                          return item
                        }) || []}
                        historyLink={"/plans-history"}//here will be the history page link
                        dataKeys={dataKeys || []}
                        // pdfDownload={handleActions}
                        pdfView={handleActions}
                      />
                    </div>
                  </div>
                </div>


            }
            <Pagination pagination={companiesData?.pagination} onPageChange={handlePageChange} />
          </div>

        </div>
      </MainLayout>

      {modalData.type == "addPlan" && modalData.isOpen &&
        <UpGradePlan handleData={modalData} />
      }
      {modalData.type == "upgrade" && modalData.isOpen &&
        <UpGradePlan handleData={modalData} />
      }
      {modalData.type == "pdfView" && modalData.isOpen &&
        <InvoicePreview handleData={modalData} invoiceData={{
          invoiceNo: 'INV-001',
          invoiceDate: '2025-04-14',
          dueDate: '2025-05-14',
          placeOfSupply: 'Haryana (06)',
          customer: {
            name: 'Yogesh Rana',
            company: 'Yogesh Pvt Ltd',
            address: 'New Delhi 110059 Delhi',
            email: 'sadqrfdv@kk.com'
          },
          items: [{ description: 'Mobile', qty: 1, rate: 599 }],
          signatureName: 'Akash Singh'
        }} /> }
      
    </React.Fragment>
  );
};

export default AdminsList;
