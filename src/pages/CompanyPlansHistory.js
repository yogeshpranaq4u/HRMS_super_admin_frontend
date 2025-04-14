import React, { useEffect, useState } from "react";
import MainLayout from "../layouts/MainLayout";
import BreadCrums from "../components/BreadCrums";
import TableComponent from "../components/TableComponent";
import { useDispatch, useSelector } from "react-redux";
import { getAllPlans, getPlanHistory } from "../redux/actions/dashBoardActions";
import Loader from "../components/Loader";
import Pagination from "../components/Pagination";
import { useLocation } from "react-router-dom";
import UpGradePlan from "../modals/UpGradePlan";
import { formatDate } from "../helpers/frontend";
import { getServiceType } from "../redux/actions/otherActions";
import InvoicePreview from "../modals/InvoicePreview";
import { ImagePath } from "../config/apiEndPoints";

const CompanyPlansHistory = () => {
  const dispatch = useDispatch()
  const { state } = useLocation()
  const [modalData, setModalData] = useState({ isOpen: false, data: "" })
  const isLoading = useSelector((state) => state.commenData.loading)
  const planHistoryData = useSelector((state) => state.commenData?.planHistoryData)
  const [searchText, setSearchText] = useState("")
  const [filters, setFilters] = useState({
    limit: 10,
    page: 1,
    deliver: "",
    status: "",
    sort: "",
    currentPage: 1,
  })
  useEffect(() => {
    dispatch(getPlanHistory(state?.data))
    dispatch(getAllPlans(state?.data))
    dispatch(getServiceType())

  }, [])
  const UpcomingPlans = planHistoryData?.data?.plans?.find((item) => {
    return item?.status == "Upcoming"
  })

  const tableHeader = [
    "Invoice Number",
    "Service",
    "Subscription Plan",
    "Purchase Date",
    "Expiry Date",
    "Plan Status",
    "Amount",
  ];

  const dataKeys = [
    "id",          // Company Name
    "services",          // Service Type (array stored as string)
    "plan_name",
    "start_date",
    "end_date",
    "status",
    "total_price",
  ];


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

  console.log("planHistoryData", planHistoryData);

  return (
    <React.Fragment>
      <MainLayout>
        <div className="page-wrapper">
          <div className="content">
            {/* Breadcrumb */}
            <div className="d-md-flex d-block align-items-center justify-content-between page-breadcrumb mb-3">
              <BreadCrums
                title={"Company Plan History"}
                data={[
                  { path: "/", title: "Superadmin" },
                  { path: "/plans", title: "Plans" },
                  { path: "#", title: "Plan History" },
                ]}
              />
              <div className="d-flex my-xl-auto right-content align-items-center flex-wrap ">
                <div className="me-2 mb-2">

                </div>
                <div className="mb-2">
                  <a
                    onClick={() => {
                      setModalData((prev) => ({
                        ...prev,
                        isOpen: true,
                        type: "renew",
                        onClose: onClose
                      }))
                    }}
                    className="btn btn-primary d-flex align-items-center"
                  >
                    Renew Plan
                  </a>
                </div>
                <div className="ms-2 head-icons"></div>
              </div>
            </div>

            {
              isLoading ?
                <Loader /> :
                <div className="card">
                  <div className="card-header d-flex align-items-center justify-content-between flex-wrap row-gap-3">
                    <div className="d-flex align-items-center gap-2">
                      <span className="avatar">
                      <img src={ImagePath + planHistoryData?.data?.company_logo || ""} alt="logo" className="img-fluid rounded-circle border" />
                      </span>
                      <h5>{planHistoryData?.data?.company_name || ""} </h5>
                    </div>
                    <div className="d-flex my-xl-auto right-content align-items-center flex-wrap row-gap-3">
                      {
                        UpcomingPlans && UpcomingPlans?.start_date &&
                        <div className="dropdown me-3">
                          <p className="d-flex gap-2 align-items-center">
                            <i className="ti ti-clock-hour-3 fs-16" />
                            Upcoming Plan:- {formatDate(UpcomingPlans?.start_date)}</p>
                        </div>
                      }
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
                        dataSource={planHistoryData?.data?.plans?.filter((item) => {
                          if (searchText) {
                            return item.plan_name.toLowerCase().includes(searchText.toLowerCase())
                          }
                          return item
                        }) || []}
                        dataKeys={dataKeys || []}
                        pdfDownload={handleActions}
                        pdfView={handleActions}
                      />
                    </div>
                  </div>
                </div>


            }
            <Pagination pagination={planHistoryData?.pagination} onPageChange={handlePageChange} />
          </div>

        </div>
      </MainLayout>

      {modalData.type == "renew" && modalData.isOpen &&
        <UpGradePlan handleData={{
          ...modalData,
          data: planHistoryData?.data
        }} />
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

export default CompanyPlansHistory;
