import React, { useEffect, useState } from 'react'
import { Api, BaseUrl, ImagePath } from '../config/apiEndPoints';
import { callApi } from '../config/apiCall';
import { useDispatch, useSelector } from 'react-redux';
import { addCompany, getAllPlans, updateCompany } from '../redux/actions/dashBoardActions';
import { getFirstErrorMessage, hasValidationError, validatedFields, validationError } from '../helpers/frontend';
import { toast } from 'react-toastify';

function AddPolices({ handleData }) {
    const dispatch = useDispatch()
    const plansData = useSelector((state) => state.commenData.allPlans)
    const details = JSON.parse(sessionStorage.getItem("userDetails")) || {}
    const [errors, setErrors] = useState({});
    const [formData, setFormData] = useState({
        admin_name: "",
        admin_email: "",
        company_email: "",
        company_name: " ",
        company_domain: "",
        team_size: "",
        contact_no: "",
        demo_status: "",
        config: "",
        service_type: [],
        status: "",//active ,inactive
        plan_id: "",
        company_logo: ""//type will be file (binary)
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
            setFormData((prev) => ({
                ...prev,
                service_type: checked
                    ? [...prev.service_type, value]
                    : prev.service_type.filter((s) => s !== value),
            }));
        } else if (type == "file") {
            setFormData((prev) => ({ ...prev, [name]: e.target.files[0] }));
        } else {
            setFormData((prev) => ({ ...prev, [name]: value }));
        }
        console.log("formData", formData);
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
        setFormData({
            admin_name: "",
            admin_email: "",
            company_email: "",
            company_name: " ",
            company_domain: "",
            team_size: "",
            contact_no: "",
            demo_status: "",
            config: "",
            service_type: [],
            status: "",//active ,inactive
            plan_id: "",
            company_logo: ""
        })
    }


    return (
        <div
            style={handleData?.isOpen ? { display: "block" } : {}}
            className={`modal fade ${handleData?.isOpen ? "show" : ""} `}
            id="edit_company" >
            <div className="modal-dialog modal-dialog-centered shadow modal-lg">
                <div className="modal-content">
                    <div className="modal-header">
                        <h4 className="modal-title">{handleData?.type == "edit" ? "Edit Policy" : "Add New Policy"} </h4>
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
                                <div className="col-md-12">
                                    <div className="mb-3">
                                        <label className="form-label">Select Company <span className="text-danger"> *</span></label>
                                        <div className="pass-group">
                                            <select value={formData?.company_id}
                                                name='company_id'
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
                                        {hasValidationError(errors, "company_id") && (
                                            <small className="text-danger pt-1">{validationError(errors, "company_id")}</small>
                                        )}
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="mb-3">
                                        <label className="form-label">Probation Period</label>
                                        <input type="text" className="form-control"
                                            value={formData.company_name}
                                            name='company_name'
                                            onChange={onTextChange} />

                                        {hasValidationError(errors, "company_name") && (
                                            <small className="text-danger pt-1">{validationError(errors, "company_name")}</small>
                                        )}
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="mb-3">
                                        <label className="form-label" >Holiday <span className="text-danger"> *</span></label>
                                        <input type="text"
                                            value={formData.company_email}
                                            name='company_email'
                                            onChange={onTextChange}
                                            className="form-control" />
                                        {hasValidationError(errors, "company_email") && (
                                            <small className="text-danger pt-1">{validationError(errors, "company_email")}</small>
                                        )}
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="mb-3">
                                        <label className="form-label">Email </label>
                                        <input type="email" className="form-control"
                                            value={formData.admin_email}
                                            name='admin_email'
                                            onChange={onTextChange} />
                                        {hasValidationError(errors, "admin_email") && (
                                            <small className="text-danger pt-1">{validationError(errors, "admin_email")}</small>
                                        )}
                                    </div>
                                </div>


                                <div className="col-md-6">
                                    <div className="mb-3">
                                        <label className="form-label">Phone Number <span className="text-danger"> *</span></label>
                                        <input type="number" className="form-control"
                                            value={formData.contact_no}
                                            name='contact_no'
                                            maxLength={12}
                                            onChange={onTextChange} />
                                        {hasValidationError(errors, "contact_no") && (
                                            <small className="text-danger pt-1">{validationError(errors, "contact_no")}</small>
                                        )}
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="mb-3">
                                        <label className="form-label">Company Domain</label>
                                        <input type="text" className="form-control"
                                            value={formData.company_domain}
                                            name='company_domain'
                                            onChange={onTextChange}
                                        />
                                        {hasValidationError(errors, "company_domain") && (
                                            <small className="text-danger pt-1">{validationError(errors, "company_domain")}</small>
                                        )}
                                    </div>
                                </div>

                                {
                                    handleData.type == "edit" &&
                                    <>
                                        <div className="col-md-6">
                                            <div className="mb-3">
                                                <label className="form-label">Company Id</label>
                                                <input type="text" className="form-control"
                                                    value={formData.company_id}
                                                    disabled
                                                    name='company_id'
                                                    onChange={onTextChange}
                                                />
                                                {hasValidationError(errors, "company_id") && (
                                                    <small className="text-danger pt-1">{validationError(errors, "company_id")}</small>
                                                )}
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                            <div className="mb-3">
                                                <label className="form-label">DB Name</label>
                                                <input type="text" className="form-control"
                                                    value={formData.db_name}
                                                    disabled
                                                    name='db_name'
                                                    onChange={onTextChange}
                                                />
                                                {hasValidationError(errors, "db_name") && (
                                                    <small className="text-danger pt-1">{validationError(errors, "db_name")}</small>
                                                )}
                                            </div>
                                        </div>

                                    </>
                                }

                                <div className="col-md-12">
                                    <div className="mb-3">
                                        <label className="form-label">Address</label>
                                        <input type="text" value={formData.company_address}
                                            name='company_address'
                                            onChange={onTextChange} className="form-control" />
                                        {hasValidationError(errors, "company_address") && (
                                            <small className="text-danger pt-1">{validationError(errors, "company_address")}</small>
                                        )}
                                    </div>
                                </div>

                                <div className="col-md-12">
                                    <div className="mb-3 ">
                                        <label className="form-label">Service Type</label>
                                        <div className="pass-group d-flex gap-2">
                                            <div className="form-check">
                                                <input className="form-check-input" type="checkbox" name="service_type" value="hrms"
                                                    checked={formData.service_type?.includes("hrms")} onChange={onTextChange} />
                                                <label className="form-check-label">HRMS</label>
                                            </div>
                                            <div className="form-check">
                                                <input className="form-check-input" type="checkbox" name="service_type" value="invoice"
                                                    checked={formData.service_type?.includes("invoice")} onChange={onTextChange} />
                                                <label className="form-check-label">Invoice</label>
                                            </div>

                                        </div>
                                        {hasValidationError(errors, "service_type") && (
                                            <small className="text-danger pt-1">{validationError(errors, "service_type")}</small>
                                        )}
                                    </div>
                                </div>

                                <div className="col-md-6">
                                    <div className="mb-3 ">
                                        <label className="form-label">Plan Type <span className="text-danger"> *</span></label>
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

                                <div className="col-md-4">
                                    <div className="mb-3 ">
                                        <label className="form-label">Team Size</label>
                                        <div className="pass-group">

                                            <select value={formData?.team_size}
                                                name='team_size'
                                                onChange={onTextChange}
                                                className="custom-select">
                                                <option value={""}>Select</option>
                                                <option value={"1-10"}>1-10</option>
                                                <option value={"11-50"}>11-50</option>
                                                <option value={"51-100"}>51-100</option>
                                                <option value={"101-500"}>101-500</option>

                                            </select>
                                        </div>
                                        {hasValidationError(errors, "team_size") && (
                                            <small className="text-danger pt-1">{validationError(errors, "team_size")}</small>
                                        )}
                                    </div>
                                </div>
                                <div className="col-md-4">
                                    <div className="mb-3 ">
                                        <label className="form-label">Status</label>
                                        <div className="pass-group">
                                            <select
                                                value={formData?.status}
                                                name='status'
                                                onChange={onTextChange}
                                                className="custom-select">
                                                <option>Select</option>
                                                <option value={"Active"}>Active</option>
                                                <option value={"Inactive"}>In Active</option>
                                                <option value={"Hold"}>Hold</option>
                                                {/* <option value={"Not Connected"}>Not Connected</option>
                                                <option value={"Done"}>Done</option> */}
                                            </select>
                                        </div>
                                        {hasValidationError(errors, "status") && (
                                            <small className="text-danger pt-1">{validationError(errors, "status")}</small>
                                        )}
                                    </div>
                                </div>
                                {
                                    handleData.type == "edit" &&
                                    <>
                                        <div className="col-md-4">
                                            <div className="mb-3">
                                                <label className="form-label">Start Date</label>
                                                <input type="date" value={formData?.plan_start_date}
                                                    name='plan_start_date'
                                                    onChange={onTextChange} className="form-control" />
                                                {hasValidationError(errors, "plan_start_date") && (
                                                    <small className="text-danger pt-1">{validationError(errors, "plan_start_date")}</small>
                                                )}
                                            </div>
                                        </div>
                                        <div className="col-md-4">
                                            <div className="mb-3">
                                                <label className="form-label">End Date</label>
                                                <input type="date" value={formData?.plan_end_date}
                                                    name='plan_end_date'
                                                    onChange={onTextChange} className="form-control" />
                                                {hasValidationError(errors, "plan_end_date") && (
                                                    <small className="text-danger pt-1">{validationError(errors, "plan_end_date")}</small>
                                                )}
                                            </div>
                                        </div>
                                    </>
                                }

                            </div>
                        </div>
                        <div className="modal-footer">
                            <button type="button" onClick={handleData.onClose} className="btn btn-light me-2" >Cancel</button>
                            <button type="submit" className="btn btn-primary">
                                {
                                    isloading ? "Loading..." :
                                        handleData?.type == "edit" ? "Save" :
                                            "Add"
                                }
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default AddPolices
