import React, { useEffect, useState } from 'react'
import MainLayout from '../layouts/MainLayout'
import { useDispatch, useSelector } from 'react-redux'
import { getAllPlans, getDemoRequestData } from '../redux/actions/dashBoardActions'
import moment from 'moment'
import BreadCrums from '../components/BreadCrums'
import Loader from '../components/Loader'
import { Api, BaseUrl } from '../config/apiEndPoints'
import { callApi } from '../config/apiCall'
import { toast } from 'react-toastify'
import RegisterFromDemo from '../components/RegisterFromDemo'
import ViewRequestDetails from '../components/ViewRequestDetails'
import Pagination from '../components/Pagination'

function DemoRequest() {
    const dispatch = useDispatch()
    const [searchText, setSearchText] = useState("")
    const [updatedStatus, setUpdatedStatus] = useState({ demo_status: "", disable: false })
    const [modalData, setModalData] = useState({ isOpen: false, data: "" })
    const allRequest = useSelector((state) => state.commenData.demoRequestsData)
    const isLoading = useSelector((state) => state.commenData.loading)
    const details = JSON.parse(sessionStorage.getItem("userDetails")) || {}
    const [denoStats, setdenoStats] = useState()
    const [filters, setFilters] = useState({
        limit: 10,
        page: 1,
        deliver: "",
        demo_status: "",
        sort: "",
        currentPage: 1,
    })

    useEffect(() => {
        dispatch(getAllPlans())
        fetchStats()
    }, [])
    useEffect(() => {
        dispatch(getDemoRequestData(filters))
    }, [filters])

    const fetchStats = async () => {
        try {
            const response = await callApi(Api.DEMOSTATS, "GET", "", details?.token)
            if (response.authenticated && response.valid) {
                setdenoStats(response.data || {})
            }

        } catch (error) {
            console.log(error);
        }
    }

    const changeFilter = (value, key) => {
        setFilters((prev) => ({
            ...prev,
            [key]: value
        }))
    }
    // console.log("allRequest", allRequest);
    const updataStatues = async (e, data, type) => {
        try {
            const payload = {
                id: data?.id,
                [type]: e.target.value
            }
            const response = await callApi(Api.UPDATEDEMOSTATUS + `/${data?.id}`, "PUT", payload, details?.token)
            // console.log("response", response);
            if (response.valid || response.authenticated) {
                toast.success(response.message)
                setUpdatedStatus((prev) => ({
                    ...prev,
                    [data?.id]: {
                        [type]: response?.data?.[type] || "",
                        disable: true  // Or your desired logic for enabling/disabling
                    }
                }))
                dispatch(getDemoRequestData(filters))
                fetchStats()
            }

        } catch (error) {
            console.log(error);
            toast.error(error.response.data.message || error.message || "Server error")
        }
    }
    const onClose = () => {
        setModalData((prev) => ({
            ...prev,
            isOpen: false
        }))
    }
    const tableHeadings = [
        "Company Name",
        "Domain Name",
        "Company Size",
        "User Name",
        "Email",
        "Contact Number",
        "Service Type",
        "Demo Status",
        // "Config",
        "Meeting Time"
    ];

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

    return (
        <React.Fragment>
            <MainLayout>
                <div className="page-wrapper">
                    {
                        isLoading ?
                            <Loader /> :
                            <div className="content">
                                <BreadCrums
                                    title={"Request Demo"}
                                    data={[
                                        { path: "/", title: "Superadmin" },
                                        { path: "/", title: "Request Demo" },

                                    ]}
                                />
                                <div className="row">
                                    {/* <!-- Total Companies --> */}
                                    <div className="col-lg-3 col-md-6 d-flex">
                                        <div className="card flex-fill">
                                            <div className="card-body d-flex align-items-center justify-content-between">
                                                <div className="d-flex align-items-center overflow-hidden">
                                                    <span className="avatar avatar-lg flex-shrink-0" style={{ background: "#FF2D55" }}>
                                                        <i className="ti ti-message-circle fs-24"></i>
                                                    </span>
                                                    <div className="ms-2 overflow-hidden">
                                                        <p className="fs-12 fw-medium mb-1 text-truncate">Total Request</p>
                                                        <h4>{denoStats?.total || 0}</h4>
                                                    </div>
                                                </div>

                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-lg-3 col-md-6 d-flex">
                                        <div className="card flex-fill">
                                            <div className="card-body d-flex align-items-center justify-content-between">
                                                <div className="d-flex align-items-center overflow-hidden">
                                                    <span className="avatar avatar-lg flex-shrink-0" style={{ background: "#047EFF" }}>
                                                        <i className="ti ti-building fs-24"></i>
                                                    </span>
                                                    <div className="ms-2 overflow-hidden">
                                                        <p className="fs-12 fw-medium mb-1 text-truncate">Total Demo Done</p>
                                                        <h4>{denoStats?.done || 0}</h4>
                                                    </div>
                                                </div>

                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-lg-3 col-md-6 d-flex">
                                        <div className="card flex-fill">
                                            <div className="card-body d-flex align-items-center justify-content-between">
                                                <div className="d-flex align-items-center overflow-hidden">
                                                    <span className="avatar avatar-lg flex-shrink-0" style={{ background: "#5856D6" }}>
                                                        <i className="ti ti-settings fs-24"></i>
                                                    </span>
                                                    <div className="ms-2 overflow-hidden">
                                                        <p className="fs-12 fw-medium mb-1 text-truncate">Total Config</p>
                                                        <h4>{denoStats?.config || 0}</h4>
                                                    </div>
                                                </div>

                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-lg-3 col-md-6 d-flex">
                                        <div className="card flex-fill">
                                            <div className="card-body d-flex align-items-center justify-content-between">
                                                <div className="d-flex align-items-center overflow-hidden">
                                                    <span className="avatar avatar-lg flex-shrink-0" style={{ background: "#34C759" }}>
                                                        <i className="ti ti-truck fs-24"></i>
                                                    </span>
                                                    <div className="ms-2 overflow-hidden">
                                                        <p className="fs-12 fw-medium mb-1 text-truncate">Total Delivered</p>
                                                        <h4>{denoStats?.delivered || 0}</h4>
                                                    </div>
                                                </div>

                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="card">
                                    <div className="card-header d-flex align-items-center justify-content-between flex-wrap row-gap-3">

                                        <h5>All Request List</h5>
                                        {/* filters  */}
                                        <div className="d-flex my-xl-auto right-content align-items-center flex-wrap row-gap-3">
                                            <div className="dropdown me-3">
                                                <select value={filters?.demo_status} onChange={(e) => {
                                                    changeFilter(e.target.value, "demo_status")
                                                }} className='select border py-2 px-2 rounded'>
                                                    <option value={""}> Select Status</ option>
                                                    {
                                                        ["Pending", "Scheduled", "Done", "Not Connected"]?.map((item, i) => {
                                                            return (
                                                                <option key={i} value={item}> {item}</ option>
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
                                                                <option key={i} value={item?.value}> {item.title}</ option>
                                                            )
                                                        })

                                                    }
                                                </select>

                                            </div>
                                            {
                                                (filters.sort || filters?.demo_status) &&
                                                <div className="dropdown ml-1">
                                                    <button onClick={() => {
                                                        setFilters((prev) => ({
                                                            ...prev,
                                                            deliver: "",
                                                            demo_status: "",
                                                            sort: "",
                                                        }))
                                                    }} className='btn btn-secondary py-1' > Clear</button>
                                                </div>
                                            }


                                        </div>
                                    </div>
                                    <div className="card-header d-flex align-items-center justify-content-between flex-wrap row-gap-3">
                                        <div className="row align-items-center">
                                            <div className="col-sm-12 col-md-6">
                                                <div className="dataTables_length" >
                                                    <label>Entries
                                                        <select value={filters?.limit} onChange={(e) => {
                                                            changeFilter(e.target.value, "limit")
                                                        }} className="form-select form-select-sm">
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
                                                {
                                                    allRequest?.data?.length == 0 ?
                                                        <p>Date not found</p> :
                                                        <table className="table datatable">
                                                            <thead className="thead-light">
                                                                <tr>
                                                                    {
                                                                        tableHeadings?.map((tableHead, index) => {
                                                                            return (
                                                                                <th key={index}>{tableHead}</th>
                                                                            )
                                                                        })
                                                                    }
                                                                    <th></th>
                                                                </tr>

                                                            </thead>
                                                            <tbody>
                                                                {
                                                                    allRequest?.data?.filter((item) => {
                                                                        if (searchText) {
                                                                            return item.company_name.toLowerCase().includes(searchText.toLowerCase()) ||
                                                                                item.company_domain.toLowerCase().includes(searchText.toLowerCase()) ||
                                                                                item.email.toLowerCase().includes(searchText.toLowerCase())
                                                                        }
                                                                        return item
                                                                    })?.map((item, index) => {
                                                                        const validSelection = Array.isArray(item?.selection)
                                                                            ? item.selection
                                                                            : JSON.parse(item?.selection || "[]");
                                                                        // console.log(item?.selection ,validSelection);
                                                                        const isdemoStatus = updatedStatus[item?.id]?.demo_status == "Done" || item.demo_status == "Done"

                                                                        return (
                                                                            <tr key={index}>
                                                                                <td>
                                                                                    <div className="d-flex align-items-center file-name-icon">
                                                                                        {/* <a href="#" className="avatar avatar-md border rounded-circle">
                                                                                            <img src="assets/img/company/company-01.svg" className="img-fluid" alt="img" />
                                                                                        </a> */}
                                                                                        <div className="ms-2">
                                                                                            <h6 className="fw-medium"><a href="#">{item?.company_domain || "NA"}</a></h6>
                                                                                        </div>
                                                                                    </div>
                                                                                </td>
                                                                                <td>{item?.company_domain || "NA"}</td>
                                                                                <td>{item?.company_size || "NA"}</td>
                                                                                <td>{item?.name || "NA"}</td>
                                                                                <td>{item?.email || "NA"}</td>
                                                                                <td>{item?.phone_no || "NA"}</td>
                                                                                <td>
                                                                                    {
                                                                                        validSelection?.map((item, index) => {
                                                                                            return (
                                                                                                <p key={index} className='p-0 m-0 text-capitalize '>{item}
                                                                                                    {index == 0 && validSelection?.length > 1 && "/"}
                                                                                                </p>
                                                                                            )
                                                                                        })
                                                                                    }
                                                                                </td>
                                                                                <td>
                                                                                    <div>
                                                                                        {
                                                                                            isdemoStatus ?
                                                                                                <div className='demo-status done d-flex justify-content-center '>Done</div> :
                                                                                                <>
                                                                                                    <select
                                                                                                        value={updatedStatus[item?.id]?.demo_status || item.demo_status}
                                                                                                        disabled={isdemoStatus}
                                                                                                        onChange={(e) => {
                                                                                                            updataStatues(e, item, "demo_status")
                                                                                                        }}
                                                                                                        className={`demo-status  
                                                                                                        ${item.demo_status == "Not Connected" ? "not-connected"
                                                                                                                : updatedStatus[item?.id]?.demo_status || item.demo_status} `}>
                                                                                                        <option value={"Pending"}>Pending</option>
                                                                                                        <option value={"Scheduled"}>Scheduled</option>
                                                                                                        <option value={"Not Connected"}>Not Connected</option>
                                                                                                        <option value={"Done"}>Done</option>
                                                                                                    </select>
                                                                                                </>

                                                                                        }
                                                                                    </div>

                                                                                </td>

                                                                                <td>
                                                                                    {item?.demo_date ? moment(item?.demo_date || "").format("DD/MMM/YYYY") + "," : "NA"} {item?.demo_time || ""}
                                                                                </td>
                                                                                <td>
                                                                                    <div className="action-icon d-inline-flex">
                                                                                        <a href="#" className="me-2"
                                                                                            onClick={() => {
                                                                                                setModalData((prev) => ({
                                                                                                    ...prev,
                                                                                                    data: item,
                                                                                                    isOpen: true,
                                                                                                    type: "viewDetails",
                                                                                                    onClose: onClose
                                                                                                }))
                                                                                            }}
                                                                                            title='View Details'>
                                                                                            <i className="ti ti-eye"></i>
                                                                                        </a>

                                                                                        <a href={
                                                                                            isdemoStatus
                                                                                                ? "#" : item?.meeting_link} className="me-2" target={isdemoStatus ? "" : '_blank'} >
                                                                                            <i className={`ti ti-device-tv ${isdemoStatus ? "disable-Color" : ""} `} style={{ transform: "rotate(180deg)" }}></i>
                                                                                        </a>

                                                                                        <a href="#" className="me-2"
                                                                                            onClick={() => {
                                                                                                if (!isdemoStatus) {
                                                                                                    setModalData((prev) => ({
                                                                                                        ...prev,
                                                                                                        data: item,
                                                                                                        isOpen: true,
                                                                                                        type: "register",
                                                                                                        onClose: onClose
                                                                                                    }))
                                                                                                }
                                                                                            }}
                                                                                            title='Register' >
                                                                                            <i className={`ti ti-user-edit ${isdemoStatus ? "disable-Color" : ""}`}></i>
                                                                                        </a>

                                                                                        {/* <a href="#" className="me-2" title='Edit' ><i className="ti ti-edit"></i></a> */}
                                                                                        {/* <a href="javascript:void(0);" ><i className="ti ti-trash"></i></a> */}
                                                                                    </div>
                                                                                </td>
                                                                            </tr>
                                                                        )
                                                                    })
                                                                }
                                                            </tbody>

                                                        </table>
                                                }
                                            </div>
                                        </div>

                                    </div>
                                    <Pagination pagination={allRequest?.pagination} onPageChange={handlePageChange} />

                                </div>

                            </div>
                    }
                </div>
            </MainLayout>
            {
                modalData.type == "viewDetails" ?
                    <ViewRequestDetails handleData={modalData} /> :
                    <RegisterFromDemo handleData={modalData} />
            }
        </React.Fragment>
    )
}

export default DemoRequest
