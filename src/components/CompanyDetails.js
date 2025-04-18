import moment from 'moment';
import React, { useState } from 'react'
import { formatDate } from '../helpers/frontend';
import { useSelector } from 'react-redux';
import { ImagePath } from '../config/apiEndPoints';

function CompanyDetails({ handleData }) {
    const d = handleData?.data
    const plansData = useSelector((state) => state.commenData.allPlans)
    const validSelection = Array.isArray(d?.service_type)
        ? d?.service_type
        : JSON.parse(d?.service_type || "[]");
    const reVlidate = !Array.isArray(validSelection) ? JSON.parse(validSelection || "[]") : validSelection
    const findPlan = plansData?.data?.find((item) => {
        return item?.id == d?.plan_id
    })
    console.log("handleData", d);

    return (
        <div
            style={handleData?.isOpen ? { display: "block" } : {}}
            class={`modal fade ${handleData?.isOpen ? "show" : ""} `}
            id="edit_company" >
            <div class="modal-dialog modal-dialog-centered shadow modal-lg  bg-white">
                <div class="modal-content">
                    <div class="modal-header">
                        <h4 class="modal-title">Company Details</h4>
                        <button type="button"
                            class="btn-close custom-btn-close"
                            onClick={handleData.onClose}
                        >
                            <i class="ti ti-x"></i>
                        </button>
                    </div>
                    <div className='p-4'>
                        <div className="company-info p-3 mb-3 flex gap-2 align-items-center rounded">
                            <span className='avatar  '>
                                <img className='img-fluid rounded-circle' src={ImagePath + d.company_logo} alt='profile'  />
                            </span>
                            <div>
                                <h5 className="mb-1">{d.company_name || "NA"}</h5>
                                <p className="text-muted mb-1">{d.company_email || d?.admin_email || "NA"}</p>
                                <span className={`status-badge ${d.status == "Active" ? "":"badge badge-danger"} `}>● {d.status || "NA"}</span>
                            </div>
                        </div>

                        <h6 className="section-title">Basic Info</h6>
                        <div className="row mb-3">
                            <div className="col-md-4 pb-2">
                                <strong>Company Name</strong>
                                <p>{d.company_name || "NA"}</p>
                            </div>
                            <div className="col-md-4 pb-2">
                                <strong>Company Id</strong>
                                <p>{d.company_id || "NA"}</p>
                            </div>
                            <div className="col-md-4 pb-2">
                                <strong>Company Size</strong>
                                <p>{d.team_size || "NA"}</p>
                            </div>
                            <div className="col-md-4 pb-2">
                                <strong>Phone Number</strong>
                                <p>{d.contact_no || "NA"}</p>
                            </div>
                            <div className="col-md-4 pb-2">
                                <strong>Domain Name</strong>
                                <p>{d.company_domain || "NA"}</p>
                            </div>
                            <div className="col-md-4 pb-2">
                                <strong>Admin Email</strong>
                                <p>{d.admin_email || "NA"}</p>
                            </div>
                            <div className="col-md-12">
                                <strong>Address</strong>
                                <p>{d.company_address || "NA"}</p>
                            </div>
                            <div className="col-md-4 pb-2">
                                <strong>Status</strong>
                                <p>{d.status || "NA"}</p>
                            </div>
                        </div>

                        <h6 className="section-title">Plan Details</h6>
                        <div className="row">
                            <div className="col-md-4 pb-2">
                                <strong>Plan Name</strong>
                                <p>{findPlan?.name || "NA"}</p>
                            </div>
                            <div className="col-md-4 pb-2">
                                <strong>Plan Type</strong>
                                <p>{findPlan?.duration || "NA"} ({findPlan?.price})</p>
                            </div>
                            <div className="col-md-4 pb-2">
                                <strong>Plan Start Date</strong>
                                <p>{d?.plan_start_date ? formatDate(d?.plan_start_date) : "NA"}</p>
                            </div>
                            <div className="col-md-4 pb-2">
                                <strong>Plan End Date</strong>
                                <p>{d?.plan_end_date ? formatDate(d?.plan_end_date) : "NA"}</p>
                            </div>
                            <div className="col-md-4 pb-2">
                                <strong>Service Type</strong>
                                <p className='text-capitalize '>
                                    {
                                        reVlidate?.map((item, i) => {
                                            return item + (i == 0 && reVlidate?.length > 1 ? "/" : "")
                                        })
                                    }
                                </p>
                            </div>


                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CompanyDetails
