import React, { useEffect, useState } from 'react'
import MainLayout from '../layouts/MainLayout'
import { useDispatch, useSelector } from 'react-redux'
import moment from 'moment'
import BreadCrums from '../components/BreadCrums'
import Loader from '../components/Loader'
import { Api, BaseUrl } from '../config/apiEndPoints'
import { callApi } from '../config/apiCall'
import { toast } from 'react-toastify'
import AddPolices from '../components/AddPolices'
import ViewRequestDetails from '../components/ViewRequestDetails'
import TableComponent from "../components/TableComponent";

function PolicyManage() {
    const dispatch = useDispatch()
    const [searchText, setSearchText] = useState("")
    const [updatedStatus, setUpdatedStatus] = useState({ demo_status: "", disable: false })
    const [modalData, setModalData] = useState({ isOpen: false, data: "" })
    const tableData = [
        {
            company_name: "BrightWave Innovations",
            probation_period: "3 Month",
            office_timing: "10:00 am - 7:00 pm",
            late_limit: 3,
            yearly_leave: 12,
            monthly_leave: 1,
            unapproved_detection: "Double Detection",
            working_days: "6 Days",
            shift_type: "1st Shift",
            wfh: "No",
            half_day_detection: "Yes",
            holiday_leave: 6
        },
        {
            company_name: "Brakke, Rowe and O'Kon",
            probation_period: "3 Month",
            office_timing: "10:00 am - 7:00 pm",
            late_limit: 3,
            yearly_leave: 24,
            monthly_leave: 2,
            unapproved_detection: "Single Detection",
            working_days: "6 Days",
            shift_type: "1st Shift",
            wfh: "Yes",
            half_day_detection: "Yes",
            holiday_leave: 4
        },
        {
            company_name: "Koelpin Group",
            probation_period: "3 Month",
            office_timing: "9:30 am - 7:00 pm",
            late_limit: 3,
            yearly_leave: 24,
            monthly_leave: 2,
            unapproved_detection: "Single Detection",
            working_days: "5 Days",
            shift_type: "1st Shift",
            wfh: "No",
            half_day_detection: "Yes",
            holiday_leave: 6
        },
        {
            company_name: "Prodovic - Writing",
            probation_period: "6 Month",
            office_timing: "10:00 am - 6:00 pm",
            late_limit: 3,
            yearly_leave: 16,
            monthly_leave: 1,
            unapproved_detection: "Single Detection",
            working_days: "5 Days",
            shift_type: "1st Shift",
            wfh: "Yes",
            half_day_detection: "Yes",
            holiday_leave: 5
        }
    ];
    const isLoading = false
    // const details = JSON.parse(sessionStorage.getItem("userDetails")) || {}
    const tableHeader = [
        'Company Name',
        'Probation Period',
        'Office Timing',
        'Late Limit',
        'Yearly Leave',
        'Monthly Leave',
        'Unapproved Detection',
        'Working Days',
        'Shift Type',
        'WFH',
        'Half Day Detection',
        'Holiday Leave',
    ];


    const dataKeys = [
        'company_name',
        'probation_period',
        'office_timing',
        'late_limit',
        'yearly_leave',
        'monthly_leave',
        'unapproved_detection',
        'working_days',
        'shift_type',
        'wfh',
        'half_day_detection',
        'holiday_leave',
    ]

    // console.log(tableHeadings);


    const onClose = () => {
        setModalData((prev) => ({
            ...prev,
            isOpen: false
        }))
    }

    const handleActions = (data, type) => {
        // console.log(data ,type);
        setModalData((prev) => ({
            ...prev,
            data: data,
            type: type,
            isOpen: true,
            onConfirm: "",
            onClose: onClose
        }))
    }
    return (
        <React.Fragment>
            <MainLayout>
                <div className="page-wrapper">
                    {
                        isLoading ?
                            <Loader /> :
                            <div className="content">
                                <div className="d-md-flex d-block align-items-center justify-content-between page-breadcrumb mb-3">
                                    <BreadCrums
                                        title={"Manage Policy"}
                                        data={[
                                            { path: "/", title: "Superadmin" },
                                            { path: "/", title: "Manage Policy" },

                                        ]}
                                    />
                                    <div className="d-flex my-xl-auto right-content align-items-center flex-wrap ">
                                        <div className="mb-2">
                                            <a
                                                to="#"
                                                onClick={() => {
                                                    setModalData((prev) => ({
                                                        ...prev,
                                                        isOpen: true,
                                                        type: "add",
                                                        onClose: onClose
                                                    }))
                                                }}
                                                className="btn btn-primary d-flex align-items-center"
                                            >
                                                <i className="ti ti-circle-plus me-2" />
                                                Add
                                            </a>
                                        </div>
                                        <div className="ms-2 head-icons"></div>
                                    </div>
                                </div>

                                <div className="card">
                                    <div className="card-header d-flex align-items-center justify-content-between flex-wrap row-gap-3">
                                        <h5>All Companies Policy List</h5>
                                        {/* filters  */}
                                        <div className="d-flex my-xl-auto right-content align-items-center flex-wrap row-gap-3">
                                            <div className="dropdown me-3">
                                                <a href="javascript:void(0);" className="dropdown-toggle btn btn-white d-inline-flex align-items-center" data-bs-toggle="dropdown">
                                                    Select Plan
                                                </a>
                                                <ul className="dropdown-menu  dropdown-menu-end p-3">
                                                    <li>
                                                        <a href="javascript:void(0);" className="dropdown-item rounded-1">Advanced</a>
                                                    </li>
                                                    <li>
                                                        <a href="javascript:void(0);" className="dropdown-item rounded-1">Basic</a>
                                                    </li>
                                                    <li>
                                                        <a href="javascript:void(0);" className="dropdown-item rounded-1">Enterprise</a>
                                                    </li>
                                                </ul>
                                            </div>
                                            <div className="dropdown me-3">
                                                <a href="javascript:void(0);" className="dropdown-toggle btn btn-white d-inline-flex align-items-center" data-bs-toggle="dropdown">
                                                    Select Status
                                                </a>
                                                <ul className="dropdown-menu  dropdown-menu-end p-3">
                                                    <li>
                                                        <a href="javascript:void(0);" className="dropdown-item rounded-1">Active</a>
                                                    </li>
                                                    <li>
                                                        <a href="javascript:void(0);" className="dropdown-item rounded-1">Inactive</a>
                                                    </li>
                                                </ul>
                                            </div>
                                            <div className="dropdown">
                                                <a href="javascript:void(0);" className="dropdown-toggle btn btn-white d-inline-flex align-items-center" data-bs-toggle="dropdown">
                                                    Sort By : Last 7 Days
                                                </a>
                                                <ul className="dropdown-menu  dropdown-menu-end p-3">
                                                    <li>
                                                        <a href="javascript:void(0);" className="dropdown-item rounded-1">Recently Added</a>
                                                    </li>
                                                    <li>
                                                        <a href="javascript:void(0);" className="dropdown-item rounded-1">Ascending</a>
                                                    </li>
                                                    <li>
                                                        <a href="javascript:void(0);" className="dropdown-item rounded-1">Desending</a>
                                                    </li>
                                                    <li>
                                                        <a href="javascript:void(0);" className="dropdown-item rounded-1">Last Month</a>
                                                    </li>
                                                    <li>
                                                        <a href="javascript:void(0);" className="dropdown-item rounded-1">Last 7 Days</a>
                                                    </li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="card-header d-flex align-items-center justify-content-between flex-wrap row-gap-3">
                                        <div className="row align-items-center">
                                            <div className="col-sm-12 col-md-6">
                                                <div className="dataTables_length" >
                                                    <label>Entries <select aria-controls="DataTables_Table_0" className="form-select form-select-sm">
                                                        <option value="10">10</option><option value="25">25</option><option value="50">50</option><option value="100">100</option></select> </label>
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
                                        <div className="card-body sv-card-body p-0">
                                            <div className="custom-datatable-filter table-responsive">
                                                <TableComponent
                                                    tableHeader={tableHeader}
                                                    dataSource={tableData?.filter((item) => {
                                                        if (searchText) {
                                                            return item.company_name.toLowerCase().includes(searchText.toLowerCase()) ||
                                                                item.company_domain.toLowerCase().includes(searchText.toLowerCase()) ||
                                                                item.admin_email.toLowerCase().includes(searchText.toLowerCase())
                                                        }
                                                        return item
                                                    }) || []}
                                                    // historyLink={"#"}//here will be the history page link
                                                    dataKeys={dataKeys || []}
                                                    onEdit={handleActions}
                                                    onView={handleActions}
                                                // handleDelete={handleActions}
                                                />
                                            </div>
                                        </div>

                                    </div>
                                    {/* pagination will hare */}
                                </div>

                            </div>
                    }
                </div>
            </MainLayout>
            {
                modalData.isOpen && (modalData.type == "add" || modalData.type == "edit") &&
                <AddPolices handleData={modalData} />
            }
        </React.Fragment>
    )
}

export default PolicyManage
