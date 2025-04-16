import React, { useEffect, useState } from "react";
import MainLayout from "../layouts/MainLayout";
import BreadCrums from "../components/BreadCrums";
import TableComponent from "../components/TableComponent";
import { useDispatch, useSelector } from "react-redux";
import { getAllPlans, getCompanies } from "../redux/actions/dashBoardActions";
import Loader from "../components/Loader";
import Pagination from "../components/Pagination";
import UpGradePlan from "../modals/UpGradePlan";
import { Api, ImagePath } from "../config/apiEndPoints";
import { callApi } from "../config/apiCall";
import InvoicePreview from "../modals/InvoicePreview";
import { getServiceType } from "../redux/actions/otherActions";

const CompanyPlans = () => {
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
    // console.log("item" ,item);
    return {
      company_name,
      company_logo,
      service_type,
      ...current_plan,
      id,
    }
  })
  useEffect(() => {
    dispatch(getCompanies(filters))

  }, [filters])
  useEffect(() => {
    dispatch(getAllPlans())
    fetchStats()
    dispatch(getServiceType())
  }, [])
  const tableHeader = [
    "Company Name",
    "#invoice",
    "Service Type",
    "Subscription Plan",
    "Purchase Date",
    "Expiry Date",
    // "Plan Status",
    "Amount",
  ];

  const dataKeys = [
    "company_name",          // Company Name
    "invoice",          // Company Name
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
    console.log(data, type);

    if (type == "pdfDownload") {
      const url = `${ImagePath}${data?.invoice?.invoice_url}`;
      if (url) {
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `invoice${data?.end_date}.pdf`); // You can customize the filename
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else {
        console.error("Invoice URL not found.");
      }
    } else {
      setModalData((prev) => ({
        ...prev,
        data: data,
        type: type,
        isOpen: true,
        onConfirm: "",
        onClose: onClose
      }))
    }
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

  return (
    <React.Fragment>
      <MainLayout>
        <div className="page-wrapper">
          <div className="content">
            {/* Breadcrumb */}
            <div className="d-md-flex d-block align-items-center justify-content-between page-breadcrumb mb-3">
              <BreadCrums
                title={"Company Plans"}
                data={[
                  { path: "/", title: "Superadmin" },

                  { path: "#", title: "Plans" },
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
                    <div className="d-flex align-items-center justify-content-between w-100 px-1 overflow-hidden">
                      <div className="ms-2 overflow-hidden">
                        <p className="fs-12 fw-medium mb-1 text-truncate">
                          Total Revenue
                        </p>
                        <h4>₹{pageStats?.total_transactions || 0}</h4>
                      </div>
                      <span className="avatar avatar-lg bg-info flex-shrink-0">
                        <i className="ti ti-location-dollar fs-16"></i>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-lg-3 col-md-6 d-flex">
                <div className="card flex-fill">
                  <div className="card-body d-flex align-items-center justify-content-between">
                    <div className="d-flex align-items-center justify-content-between w-100 px-1 overflow-hidden">
                      <div className="ms-2 overflow-hidden">
                        <p className="fs-12 fw-medium mb-1 text-truncate">
                          Most Used Plan
                        </p>
                        <h4>{pageStats?.most_purchased_plan}</h4>
                      </div>
                      <span className="avatar avatar-lg  flex-shrink-0" style={{ background: "#AF52DE" }}>
                        <i className="ti ti-calendar-week fs-16"></i>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-lg-3 col-md-6 d-flex">
                <div className="card flex-fill">
                  <div className="card-body d-flex align-items-center justify-content-between">
                    <div className="d-flex align-items-center justify-content-between w-100 px-1 overflow-hidden">
                      <div className="ms-2 overflow-hidden">
                        <p className="fs-12 fw-medium mb-1 text-truncate">
                          Total Subscribers
                        </p>
                        <h4>{pageStats?.total_subscribers || 0}</h4>
                      </div>
                      <span className="avatar avatar-lg flex-shrink-0" style={{ background: "#00C7BE" }}>
                        <i className="ti ti-users fs-16" />
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-lg-3 col-md-6 d-flex">
                <div className="card flex-fill">
                  <div className="card-body d-flex align-items-center justify-content-between">
                    <div className="d-flex align-items-center justify-content-between w-100 px-1 overflow-hidden">
                      <div className="ms-2 overflow-hidden">
                        <p className="fs-12 fw-medium mb-1 text-truncate">
                          Active Subscribers
                        </p>
                        <h4>{pageStats?.active_subscribers || 0}</h4>
                      </div>
                      <span className="avatar avatar-lg bg-success flex-shrink-0">
                        <i className="ti ti-user-check fs-16" />
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              {/* Inactive Companies */}
              <div className="col-lg-3 col-md-6 d-flex">
                <div className="card flex-fill">
                  <div className="card-body d-flex align-items-center justify-content-between">
                    <div className="d-flex align-items-center justify-content-between w-100 px-1 overflow-hidden">
                      <div className="ms-2 overflow-hidden">
                        <p className="fs-12 fw-medium mb-1 text-truncate">
                          Expired Subscribers
                        </p>
                        <h4>{pageStats?.expired_subscribers | "0"}</h4>
                      </div>
                      <span className="avatar avatar-lg bg-danger flex-shrink-0">
                        <i className="ti ti-user-x fs-16" />
                      </span>
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
                    {/* <div className="d-flex my-xl-auto right-content align-items-center flex-wrap row-gap-3">
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

                    </div> */}
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
                            return item?.company_name?.toLowerCase().includes(searchText?.toLowerCase()) ||
                              item?.plan_name?.toLowerCase().includes(searchText?.toLowerCase())
                          }
                          return item
                        }) || []}
                        historyLink={"/superadmin/plans-history"}
                        dataKeys={dataKeys || []}
                        pdfDownload={handleActions}
                        pdfView={handleActions}
                        // indexStartFrom={((companiesData?.pagination?.currentPage - 1) * companiesData?.pagination?.limit + 1)||0}
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
        <InvoicePreview handleData={modalData} companyData={modalData?.data} />}
    </React.Fragment>
  );
};

export default CompanyPlans;
