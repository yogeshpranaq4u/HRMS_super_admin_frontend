import React, { useEffect } from 'react'
import MainLayout from '../layouts/MainLayout'
import { useDispatch, useSelector } from 'react-redux'
import { getDemoRequestData } from '../redux/actions/dashBoardActions'
import moment from 'moment'
import BreadCrums from '../components/BreadCrums'

function DemoRequest() {
    const dispatch = useDispatch()
    const allRequest = useSelector((state) => state.commenData.demoRequestsData)
    useEffect(() => {
        dispatch(getDemoRequestData("all"))
    }, [])


    const updataStatues = async (type, data) => {
        try {

        } catch (error) {
            console.log(error);
        }
    }

    return (
        <MainLayout>
            <div className="page-wrapper">
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
                                        <span className="avatar avatar-lg flex-shrink-0" style={{ background: "#047EFF" }}>
                                            <i className="ti ti-building fs-24"></i>
                                        </span>
                                        <div className="ms-2 overflow-hidden">
                                            <p className="fs-12 fw-medium mb-1 text-truncate">Total Demo Done</p>
                                            <h4>90</h4>
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
                                            <h4>50</h4>
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
                                            <h4>150</h4>
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
                                {/* <div className="me-3">
                                    <div className="input-icon-end position-relative">
                                        <input type="text" className="form-control date-range bookingrange" placeholder="dd/mm/yyyy - dd/mm/yyyy" />
                                        <span className="input-icon-addon">
                                            <i className="ti ti-chevron-down"></i>
                                        </span>
                                    </div>
                                </div> */}
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
                                        <label> <input type="search" className="form-control form-control-sm" placeholder="Search" aria-controls="DataTables_Table_0" />
                                        </label></div>
                                </div>
                            </div>
                            <div className="card-body sv-card-body p-0">
                                <div className="custom-datatable-filter table-responsive">
                                    <table className="table datatable">
                                        <thead className="thead-light">
                                            <tr>
                                                {/* <th className="no-sort">
                                                    <div className="form-check form-check-md">
                                                        <input className="form-check-input" type="checkbox" id="select-all" />
                                                    </div>
                                                </th> */}
                                                <th>Company Name</th>
                                                <th>Domain Name</th>
                                                <th>Company Size</th>
                                                <th>User Name</th>
                                                <th>Email</th>
                                                <th>Contact Number</th>
                                                <th>Selection Type</th>
                                                <th>Demo Status</th>
                                                <th>Config</th>
                                                <th>Deliver</th>
                                                <th>Meeting Time</th>
                                                <th></th>
                                            </tr>

                                        </thead>
                                        <tbody>
                                            {
                                                allRequest?.data?.map((item, index) => {
                                                    // console.log(JSON.parse( item?.selection));
                                                    const validSelection = JSON.parse(item?.selection)

                                                    return (
                                                        <tr key={index}>
                                                            {/* <td>
                                                                <div className="form-check form-check-md">
                                                                    <input className="form-check-input" type="checkbox" />
                                                                </div>
                                                            </td> */}
                                                            <td>
                                                                <div className="d-flex align-items-center file-name-icon">
                                                                    {/* <a href="#" className="avatar avatar-md border rounded-circle">
                                                                        <img src="assets/img/company/company-01.svg" className="img-fluid" alt="img" />
                                                                    </a> */}
                                                                    <div className="ms-2">
                                                                        <h6 className="fw-medium"><a href="#">{item?.company_name || "NA"}</a></h6>
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
                                                                            <p className='p-0 m-0'>{item}</p>
                                                                        )
                                                                    })
                                                                }
                                                            </td>
                                                            <td>
                                                                <div>
                                                                    <select className='demo-status  not-connected'>
                                                                        <option value={"Pending"}>Pending</option>
                                                                        <option value={"Sheduled"}>Sheduled</option>
                                                                        <option value={"Not Connected"}>Not Connected</option>
                                                                        <option value={"Done"}>Done</option>
                                                                    </select>
                                                                </div>

                                                            </td>
                                                            <td>
                                                                <div>
                                                                    <select defaultValue={item?.config} className='demo-status '>
                                                                        <option value={"yes"}>Yes</option>
                                                                        <option value={"no"}>No</option>

                                                                    </select>
                                                                </div>

                                                            </td>
                                                            <td>
                                                                <span style={item?.deliver.toLowerCase() == "pending" ? { background: "#e4e1e18c", color: "#000000" } : {}} className="badge badge-suucess d-inline-flex align-items-center badge-xs">
                                                                    <i className="ti ti-point-filled me-1"></i>
                                                                    {item?.deliver || ""}
                                                                </span>
                                                            </td>
                                                            <td>
                                                                {item?.demo_date ? moment(item?.demo_date || "").format("DD/MMM/YYYY") : "NA"}, {item?.demo_time || ""}
                                                            </td>
                                                            <td>
                                                                <div className="action-icon d-inline-flex">
                                                                    <a href="#" className="me-2" >
                                                                        <i className="ti ti-device-tv" style={{ transform: "rotate(180deg)" }}></i>
                                                                    </a>
                                                                    <a href="#" className="me-2"  >
                                                                        <i className="ti ti-user-edit"></i>
                                                                    </a>
                                                                    <a href="#" className="me-2" >
                                                                        <i className="ti ti-eye"></i>
                                                                    </a>
                                                                    <a href="#" className="me-2" ><i className="ti ti-edit"></i></a>
                                                                    <a href="javascript:void(0);" ><i className="ti ti-trash"></i></a>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    )
                                                })
                                            }
                                        </tbody>

                                    </table>
                                </div>
                            </div>

                        </div>
                        <div class="row p-3 align-items-center">
                            <div class="col-sm-12 col-md-5">
                                <div class="dataTables_info" role="status" aria-live="polite">
                                    Showing 1 - 10 of 10 entries</div></div>
                            <div class="col-sm-12 col-md-7 sv-dataTables_paginate">
                                <div class="dataTables_paginate paging_simple_numbers mt-0 p-0"
                                    style={{ marginTop: "0px!important" }}
                                ><ul class="pagination"><li class="paginate_button page-item previous disabled" ><a aria-controls="DataTables_Table_0" aria-disabled="true" role="link" data-dt-idx="previous" tabindex="-1" class="page-link"><i class="ti ti-chevron-left"></i> </a></li><li class="paginate_button page-item active"><a href="#" aria-controls="DataTables_Table_0" role="link" aria-current="page" data-dt-idx="0" tabindex="0" class="page-link">1</a></li><li class="paginate_button page-item next disabled" id="DataTables_Table_0_next"><a aria-controls="DataTables_Table_0" aria-disabled="true" role="link" data-dt-idx="next" tabindex="-1" class="page-link"><i class="ti ti-chevron-right"></i></a></li></ul></div></div></div>
                    </div>

                </div>
            </div>
        </MainLayout>
    )
}

export default DemoRequest
