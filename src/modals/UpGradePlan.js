import React, { useEffect, useState } from 'react'
import { Api, BaseUrl, ImagePath } from '../config/apiEndPoints';
import { callApi } from '../config/apiCall';
import { useDispatch, useSelector } from 'react-redux';
import { addCompany, getAllPlans, getCompanies, getPlanHistory, updateCompany } from '../redux/actions/dashBoardActions';
import { formatDate, getFirstErrorMessage, hasValidationError, validatedFields, validationError } from '../helpers/frontend';
import { toast } from 'react-toastify';
import Select from "react-select";
import { getServiceType } from '../redux/actions/otherActions';

function UpGradePlan({ handleData }) {
    const dispatch = useDispatch()
    const plansData = useSelector((state) => state.commenData.allPlans)
    const details = JSON.parse(sessionStorage.getItem("userDetails")) || {}
    const serviceTypeData = useSelector((state) => state.data?.serviceTypeData)
    const currentPlan = handleData?.data?.plans?.find((item) => item?.status == "Active")
    const companiesData = useSelector((state) => state.commenData?.companiesData)
    const [selectedCompany, setSelectedCompany] = useState()
    const [errors, setErrors] = useState({});
    const requiredFields = ["plan_id", "service_ids"]
    const [formData, setFormData] = useState({
        plan_id: "",
        service_ids: ["1"],
    })
    const [isloading, setLoading] = useState(false)

    useEffect(() => {
         dispatch(getServiceType())
        dispatch(getCompanies({
            limit: 10,
            page: 1,
            only_without_plan: true
        }))
    }, []
    )

    useEffect(() => {
        if (handleData?.type == "edit") {
            const service_ids = Array.isArray(handleData?.data?.service_ids)
                ? handleData?.data?.service_ids
                : JSON.parse(handleData?.data?.service_ids || "[]")
            // setFormData((prev) => ({
            //     ...handleData?.data,
            // }))

        } else {
            const service_ids = Array.isArray(handleData?.data?.selection)
                ? handleData?.data?.selection
                : JSON.parse(handleData?.data?.selection || "[]")
            // setFormData((prev) => ({
            //     ...prev, ...handleData?.data,
            // }))
        }
    }, [handleData])

    const onTextChange = (e) => {
        const { name, value, type, checked } = e.target;
        if (type === "checkbox") {
            setFormData((prev) => {
                let finalPrice = checked && value == 2 ? parseFloat(prev.price) + 100
                    : !checked && value == 2 ? parseFloat(prev.price) - 100 : prev.price
                return ({
                    ...prev,
                    service_ids: checked
                        ? [...prev.service_ids, value]
                        : prev.service_ids.filter((s) => s !== value),
                    price: finalPrice.toFixed(2)

                })
            });
        } else {
            if (name == "plan_id") {
                const findPlan = plansData?.data?.find((item) => {
                    return item?.id == value
                })
                setFormData((prev) => ({
                    ...prev,
                    [name]: value,
                    ["price"]: findPlan?.price,
                }));

            } else {
                setFormData((prev) => ({ ...prev, [name]: value }));
            }
        }
        // console.log("formData", formData);
    }


    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validatedFields(formData, requiredFields, setErrors)) return;
        try {
            setLoading(true)
            let data = new FormData()
            data.append("service_ids", JSON.stringify(formData.service_ids))
            data.append("plan_id", formData.plan_id)
            const apiEndPoint = formData?.company_id? `super-admin/companies/${formData?.company_id}/plans`: `${handleData?.type == "renew" ? `super-admin/companies/${handleData.data.id}/plans` : ""}`
            const response = await callApi(apiEndPoint, "POST", data, details?.token)
            toast.success(response.data?.message || "Form submitted successfully!");
            // console.log("response", response);
            if (handleData?.type == "renew") {
                if (response?.authenticated && response?.valid) {
                   dispatch(getPlanHistory(handleData.data.id))
                }
            }
            
            setLoading(false)
            reSetForm()
            handleData.onClose()

        } catch (error) {
            console.error("Error submitting form", error);
            if (error.response.data.errors) {
                toast.error(error.response.data.errors[0] || getFirstErrorMessage(error.response.data.errors))
            } else {
                toast.error(error.response.data.message || error.message || "server error");
            }
            setLoading(false)
        }
    };

    const reSetForm = () => {
        setFormData({})
    }

    return (
        <div
            style={handleData?.isOpen ? { display: "block" } : {}}
            className={`modal fade ${handleData?.isOpen ? "show" : ""} `}
            id="edit_company" >
            <div className="modal-dialog modal-dialog-centered modal-md">
                <div className="modal-content">
                    <div className="modal-header">
                        <h4 className="modal-title">{
                            handleData?.type == "addPlan" ? "Add New Plan" :
                                handleData?.type == "renew" ? "Renew Plan" : "Upgrade Package"} </h4>
                        <button type="button"
                            className="btn-close custom-btn-close"
                            onClick={() => {
                                reSetForm()
                                handleData.onClose()
                            }}>
                            <i className="ti ti-x"></i>
                        </button>
                    </div>
                    <form onSubmit={(e) => {
                        if (!isloading) {
                            handleSubmit(e)
                        }
                    }}>
                        <div className="modal-body pb-0">
                            <div className="row">
                                {
                                    handleData?.type == "addPlan" &&
                                    <div className='col-md-12'>
                                        <div className='mb-3'>
                                            <label className="form-label">Select Company <span className="text-danger">*</span></label>
                                            <Select
                                                options={companiesData?.data} // use your original data directly
                                                getOptionLabel={(e) => e.company_name} // show company_name as label
                                                getOptionValue={(e) => e.id} // use id as the internal value
                                                // value={selected}
                                                onChange={(option) => {
                                                    // console.log(option);
                                                    setSelectedCompany(option)
                                                    setFormData((prev) => ({ ...prev, ["company_id"]: option?.id }));
                                                }}
                                                placeholder="Select a company..."
                                                isSearchable
                                            />
                                        </div>
                                    </div>
                                }

                                {
                                    selectedCompany &&
                                    <div className='col-md-12'>
                                        <div className="company-info p-3 mb-3 rounded">
                                            <h5>Company Basic Details</h5>
                                            <div className="row mb-3">
                                                <div className="col-md-6 py-2">
                                                    <strong>Company Name</strong>
                                                    <p>{selectedCompany?.company_name || "NA"}</p>
                                                </div>
                                                <div className="col-md-6 py-2">
                                                    <strong>Team Size</strong>
                                                    <p>{selectedCompany?.team_size || "NA"}</p>
                                                </div>
                                                <div className="col-md-4 py-2">
                                                    <strong>Mobile Number</strong>
                                                    <p>{selectedCompany?.contact_no || "NA"}</p>
                                                </div>

                                                <div className="col-md-6 py-2">
                                                    <strong>Company Domain</strong>
                                                    <p>{selectedCompany?.company_domain || "NA"}</p>
                                                </div>
                                            </div>

                                        </div>
                                    </div>
                                }

                                {
                                    handleData?.type == "addPlan" ? "" :
                                        <div className='col-md-12'>
                                            <div className="company-info p-3 mb-3 rounded">
                                                <h3>Current Plan Details</h3>
                                                <div className="row mb-3">
                                                    <div className="col-md-6 py-1">
                                                        <strong>Company Name</strong>
                                                        <p>{handleData?.data?.company_name || "NA"}</p>
                                                    </div>
                                                    <div className="col-md-6 py-1">
                                                        <strong>Plan Name</strong>
                                                        <p>{currentPlan?.plan_name || "NA"}</p>
                                                    </div>
                                                    <div className="col-md-6 py-1">
                                                        <strong>Price</strong>
                                                        <p>₹{currentPlan?.total_price || "NA"}</p>
                                                    </div>
                                                    <div className="col-md-6 py-1">
                                                        <strong>Expiry Date</strong>
                                                        <p>{formatDate(currentPlan?.end_date) || "NA"}</p>
                                                    </div>
                                                </div>

                                            </div>
                                        </div>
                                }
                                {
                                    handleData?.type == "addPlan" ?
                                        <div className="col-md-12">
                                            <div className="mb-3 ">
                                                <h5>Add on</h5>
                                            </div>
                                        </div> :
                                        <div className="col-md-12">
                                            <div className="mb-3 ">
                                                <h4>Upgrade Plan</h4>
                                            </div>
                                        </div>
                                }

                                <div className="col-md-6">
                                    <div className="mb-3 ">
                                        <label className="form-label">Plan Type <span className="text-danger">*</span></label>
                                        <div className="pass-group">
                                            <select value={formData.plan_id}
                                                name='plan_id'
                                                onChange={onTextChange} className="custom-select">
                                                <option>Select</option>
                                                {
                                                    plansData?.data?.map((item, index) => {
                                                        return (
                                                            <option key={index} value={item?.id}>{item?.name || ""}</option>
                                                        )
                                                    })
                                                }

                                            </select>
                                        </div>
                                        {hasValidationError(errors, "plan_id") && (
                                            <small className="text-danger pt-1">{validationError(errors, "plan_id")}</small>
                                        )}
                                    </div>
                                </div>

                                <div className="col-md-6">
                                    <div className="mb-3 ">
                                        <label className="form-label">Amount</label>
                                        <input type="text" className="form-control"
                                            value={formData.price}
                                            name='price'
                                            disabled
                                            onChange={onTextChange} />

                                    </div>
                                </div>
                                <div className="col-md-12">
                                    <div className="mb-3 ">
                                        <label className="form-label">Service</label>
                                        <div className="pass-group d-flex gap-2">
                                            {
                                                serviceTypeData?.data?.map((item, index) => {
                                                    return (
                                                        <div className="form-check" key={index}>
                                                            <input className="form-check-input" type="checkbox"
                                                                name="service_ids" value={item?.id}
                                                                disabled={item?.id == "1"}
                                                                checked={formData.service_ids.includes(String(item?.id))}
                                                                onChange={(e) => {
                                                                    if (!formData?.plan_id) {
                                                                        toast.warning("Please Select Plan Type first ! ")
                                                                        return
                                                                    }
                                                                    onTextChange(e)
                                                                }} />
                                                            <label className="form-check-label">{item?.name}</label>
                                                        </div>
                                                    )
                                                })
                                            }
                                        </div>
                                        {hasValidationError(errors, "service_ids") && (
                                            <small className="text-danger pt-1">{validationError(errors, "service_ids")}</small>
                                        )}
                                    </div>
                                </div>

                                {
                                    handleData?.type == "addPlan" ? "" :
                                        <div className="col-md-12">
                                            <div className="mb-3 flex align-items-center gap-2 ">
                                                <i className='ti ti-info-circle' />
                                                <p className='m-0 p-0'>The plan will be moved to next month</p>
                                            </div>
                                        </div>
                                }


                            </div>
                        </div>
                        <div className="modal-footer">
                            <button type="button" onClick={handleData.onClose} className="btn btn-light me-2" >Cancel</button>
                            <button type="submit" className="btn btn-primary">
                                {
                                    isloading ? "Loading..." : "Submit"
                                }
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default UpGradePlan
