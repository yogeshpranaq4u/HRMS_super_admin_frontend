import React from 'react'

function BreadCrums({
    title, data
}) {
    return (
        <div className="d-md-flex d-block align-items-center justify-content-between page-breadcrumb mb-3">
            <div className="my-auto mb-2">
                <h2 className="mb-1">{title || "Dashboard"}</h2>
                <nav>
                    <ol className="breadcrumb mb-0">
                        <li className="breadcrumb-item">
                            <a href="index.html"><i className="ti ti-smart-home"></i></a>
                        </li>
                        {
                            data?.map((item, index) => {
                                return (
                                    <li className="breadcrumb-item">
                                        {item?.title||"test"}
                                    </li>
                                )
                            })
                        }
                    </ol>
                </nav>
            </div>
            {/* show this conditionaly */}
            {/* <div className="d-flex my-xl-auto right-content align-items-center flex-wrap ">
                <div className="input-icon mb-2 position-relative">
                    <span className="input-icon-addon">
                        <i className="ti ti-calendar text-gray-9"></i>
                    </span>
                    <input type="text" className="form-control date-range bookingrange" placeholder="dd/mm/yyyy - dd/mm/yyyy" />
                </div>
                <div className="ms-2 head-icons">
                    <a href="javascript:void(0);" className="" data-bs-toggle="tooltip" data-bs-placement="top" data-bs-original-title="Collapse" id="collapse-header">
                        <i className="ti ti-chevrons-up"></i>
                    </a>
                </div>
            </div> */}
        </div>
    )
}

export default BreadCrums
