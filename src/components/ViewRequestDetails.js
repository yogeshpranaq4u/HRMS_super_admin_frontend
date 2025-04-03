import moment from 'moment';
import React, { useState } from 'react'

function ViewRequestDetails({ handleData }) {
    console.log("handleData", handleData?.data);
    const d = handleData?.data

    return (
        <div
            style={handleData?.isOpen ? { display: "block" } : {}}
            class={`modal fade ${handleData?.isOpen ? "show" : ""} `}
            id="edit_company" >
            <div class="modal-dialog modal-dialog-centered modal-lg">
                <div class="modal-content">
                    <div class="modal-header">
                        <h4 class="modal-title">Request Demo Details</h4>
                        <button type="button"
                            class="btn-close custom-btn-close"
                            onClick={handleData.onClose}
                        >
                            <i class="ti ti-x"></i>
                        </button>
                    </div>
                    <div className='p-4'>
                        <div className="company-info p-3 mb-3 rounded">
                            <h5 className="mb-1">{d.company_name || "NA"}</h5>
                            <p className="text-muted mb-1">{d.email || "NA"}</p>
                            <span className="status-badge">● {d.deliver || "NA"}</span>
                        </div>

                        <h6 className="section-title">Basic Info</h6>
                        <div className="row mb-3">
                            <div className="col-md-4">
                                <strong>User Name</strong>
                                <p>{d.name || "NA"}</p>
                            </div>
                            <div className="col-md-4">
                                <strong>Company Size</strong>
                                <p>{d.company_size || "NA"}</p>
                            </div>
                            <div className="col-md-4">
                                <strong>Phone Number</strong>
                                <p>{d.phone_no || "NA"}</p>
                            </div>
                            <div className="col-md-12">
                                <strong>Domain Name</strong>
                                <p>{d.company_domain || "NA"}</p>
                            </div>
                        </div>

                        <h6 className="section-title">Demo Details</h6>
                        <div className="row">
                            <div className="col-md-4">
                                <strong>Selection Type</strong>
                                <p>
                                    {
                                        JSON.parse(d?.selection)?.map((item, i) => {
                                            return item + "/"
                                        })
                                    }
                                </p>
                            </div>
                            <div className="col-md-4">
                                <strong>Demo Status</strong>
                                <p>{d.demo_status || "NA"}</p>
                            </div>
                            <div className="col-md-4">
                                <strong>Config</strong>
                                <p>{d.config || "NA"}</p>
                            </div>
                            <div className="col-md-12">
                                <strong>Meeting Time</strong>
                                <p>
                                    {d?.demo_date ? moment(d?.demo_date || "").format("DD/MMM/YYYY") : "NA"}, {d?.demo_time || ""}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ViewRequestDetails
