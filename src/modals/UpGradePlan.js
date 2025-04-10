import React, { useEffect, useState } from 'react'
import { Api, BaseUrl, ImagePath } from '../config/apiEndPoints';
import { callApi } from '../config/apiCall';
import { useDispatch, useSelector } from 'react-redux';
import { addCompany, getAllPlans, updateCompany } from '../redux/actions/dashBoardActions';
import { getFirstErrorMessage, hasValidationError, validatedFields, validationError } from '../helpers/frontend';
import { toast } from 'react-toastify';

function UpGradePlan({ handleData }) {
    const dispatch = useDispatch()
    const plansData = useSelector((state) => state.commenData.allPlans)
    const details = JSON.parse(sessionStorage.getItem("userDetails")) || {}
    const [errors, setErrors] = useState({});
    const [formData, setFormData] = useState({
        admin_name: "",
        service_type: ["hrms"],
    })
    const [isloading, setLoading] = useState(false)

    useEffect(() => {
        // console.log(handleData);
        if (handleData?.type == "edit") {
            const service_type = Array.isArray(handleData?.data?.service_type)
                ? handleData?.data?.service_type
                : JSON.parse(handleData?.data?.service_type || "[]")
            setFormData((prev) => ({
                ...handleData?.data,
                service_type: Array.isArray(service_type) ? service_type : JSON.parse(service_type),
            }))

        } else {
            const service_type = Array.isArray(handleData?.data?.selection)
                ? handleData?.data?.selection
                : JSON.parse(handleData?.data?.selection || "[]")
            setFormData((prev) => ({
                ...prev, ...handleData?.data,
                team_size: handleData?.data?.company_size,
                contact_no: handleData?.data?.phone_no,
                admin_email: handleData?.data?.email,
                admin_name: handleData?.data?.name,
                service_type: service_type,

            }))
        }
    }, [handleData])

    const onTextChange = (e) => {
        const { name, value, type, checked } = e.target;
        if (type === "checkbox") {
            setFormData((prev) => {
                let finalPrice = checked && value == "invoice" ? parseFloat(prev.price) + 100
                    : !checked && value == "invoice" ? parseFloat(prev.price) - 100 : prev.price
                // console.log("finalPrice" ,finalPrice ,parseFloat(prev.price));
                return ({
                    ...prev,
                    service_type: checked
                        ? [...prev.service_type, value]
                        : prev.service_type.filter((s) => s !== value),
                    price: finalPrice + ".00"

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

    const requiredFields = [
        "admin_email", "company_email", "company_name",
        "company_domain", "team_size", "contact_no", "service_type", "status", "plan_id"
    ]

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validatedFields(formData, requiredFields, setErrors)) return;
        try {
            setLoading(true)
            let data = new FormData()
            Object.entries(formData)?.map(([key, value]) => {
                if (key == "service_type") {
                    data.append(key, JSON.stringify(value))
                } else if (key == "company_logo") {
                    if (typeof formData.company_logo == "string") {
                        data.append(key, "")
                    }
                } else {
                    data.append(key, value)
                }
            })
            const response = await callApi(Api.REGISTERCOMPANY + `${handleData?.type == "edit" ? "/" + handleData.data.id : ""}`, "POST", data, details?.token)
            toast.success(response.data?.message || "Form submitted successfully!");
            // console.log("response", response);
            if (handleData?.type == "Register") {
                if (response?.authenticated && response?.valid) {
                    dispatch(addCompany(response?.data?.company))
                }
            }
            if (handleData?.type == "edit") {
                dispatch(updateCompany(response?.data?.company))
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
                        <h4 className="modal-title">{handleData?.type == "renew" ? "Renew Plan" : "Upgrade Package"} </h4>
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
                                    // handleData?.type == "upgrade" &&
                                    <div className='col-md-12'>
                                        <div className="company-info p-3 mb-3 rounded">
                                            <h3>Current Plan Details</h3>
                                            <div className="row mb-3">
                                                <div className="col-md-6 py-1">
                                                    <strong>Company Name</strong>
                                                    <p>{"NA"}</p>
                                                </div>
                                                <div className="col-md-6 py-1">
                                                    <strong>Plan Name</strong>
                                                    <p>{"NA"}</p>
                                                </div>
                                                <div className="col-md-6 py-1">
                                                    <strong>Price</strong>
                                                    <p>{"NA"}</p>
                                                </div>
                                            </div>

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
                                            <div className="form-check">
                                                <input className="form-check-input" type="checkbox" name="service_type" value="hrms"
                                                    checked={true} onChange={onTextChange} />
                                                <label className="form-check-label">HRMS</label>
                                            </div>
                                            <div className="form-check">
                                                <input className="form-check-input" type="checkbox" name="service_type" value="invoice"
                                                    checked={formData.service_type?.includes("invoice")}
                                                    onChange={(e) => {
                                                        if (!formData.plan_id) {
                                                            toast.warning("Please Select Plan type first !")
                                                            return
                                                        }
                                                        onTextChange(e)
                                                    }} />
                                                <label className="form-check-label">Invoice</label>
                                            </div>

                                        </div>
                                        {hasValidationError(errors, "service_type") && (
                                            <small className="text-danger pt-1">{validationError(errors, "service_type")}</small>
                                        )}
                                    </div>
                                </div>

                                <div className="col-md-12">
                                    <div className="mb-3 flex align-items-center gap-2 ">
                                        <i className='ti ti-info-circle' />
                                        <p className='m-0 p-0'>The plan will be moved to next month</p>
                                    </div>
                                </div>


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
