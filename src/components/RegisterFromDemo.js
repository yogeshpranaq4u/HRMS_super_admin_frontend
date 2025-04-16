import React, { useEffect, useState } from 'react'
import { Api, BaseUrl, ImagePath } from '../config/apiEndPoints';
import { callApi } from '../config/apiCall';
import { useDispatch, useSelector } from 'react-redux';
import { addCompany, getAllPlans, updateCompany } from '../redux/actions/dashBoardActions';
import { getFirstErrorMessage, hasValidationError, validatedFields, validationError } from '../helpers/frontend';
import { toast } from 'react-toastify';
import { getServiceType } from '../redux/actions/otherActions';

function RegisterFromDemo({ handleData }) {
    const dispatch = useDispatch()
    const serviceTypeData = useSelector((state) => state.data?.serviceTypeData)
    const plansData = useSelector((state) => state.commenData.allPlans)
    const details = JSON.parse(sessionStorage.getItem("userDetails")) || {}
    const [errors, setErrors] = useState({});
    const [formData, setFormData] = useState({
        admin_name: "",
        admin_email: "",
        // company_email: "",
        company_name: " ",
        company_domain: "",
        team_size: "",
        contact_no: "",
        demo_status: "",
        config: "",
        service_ids: ["1"],
        status: "",//active ,inactive
        plan_id: "",
        company_logo: ""//type will be file (binary)
    })
    const [isloading, setLoading] = useState(false)

     useEffect(() => {
        console.log(handleData);
        if (handleData?.type == "edit") {
            const ids = handleData?.data?.current_plan?.services?.map((item)=>item?.id.toString())
            // console.log("services ids " , ids);
            const service_ids = ids.length > 0 ?ids :["1"]
            // Array.isArray(handleData?.data?.service_ids)
            //     ? handleData?.data?.service_ids
            //     : JSON.parse(handleData?.data?.service_ids || "[]")
            setFormData((prev) => ({
                ...handleData?.data,
                service_ids: Array.isArray(service_ids) ? service_ids : JSON.parse(service_ids),
            }))

        } else {
            const service_ids = Array.isArray(handleData?.data?.selection)
                ? handleData?.data?.selection
                : JSON.parse(handleData?.data?.selection || "[]")
            // console.log(`"["1"]"`, service_ids);
            setFormData((prev) => ({
                ...prev, ...handleData?.data,
                team_size: handleData?.data?.company_size,
                contact_no: handleData?.data?.phone_no,
                admin_email: handleData?.data?.email,
                admin_name: handleData?.data?.name,
                service_ids: ["1"]
                // service_ids.length > 0 ? service_ids : ["1"],
            }))
        }
    }, [handleData])

    const onTextChange = (e) => {
        const { name, value, type, checked } = e.target;
        if (type === "checkbox") {
            // console.log(name, value, type, checked);
            setFormData((prev) => ({
                ...prev,
                service_ids: checked
                    ? [...prev.service_ids, value]
                    : prev.service_ids.filter((s) => s !== value),
            }));
        } else if (type == "file") {
            setFormData((prev) => ({ ...prev, [name]: e.target.files[0] }));
        } else {
            setFormData((prev) => ({ ...prev, [name]: value }));
        }
        // console.log("formData", formData);
    }

    const requiredFields = [
        "admin_email", "company_name",
        "company_domain", "team_size", "contact_no", "service_ids", "status", "plan_id"
    ]

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log("formData", errors);
        if (!validatedFields(formData, requiredFields, setErrors)) return;
        try {

            setLoading(true)
            let data = new FormData()
            Object.entries(formData)?.map(([key, value]) => {
                if(key == "service_ids"){
                    data.append("service_type", JSON.stringify(value))
                }
                if (key == "service_ids" || key == "current_plan") {
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
            // company_email: "",
            company_name: " ",
            company_domain: "",
            team_size: "",
            contact_no: "",
            demo_status: "",
            config: "",
            service_ids: [],
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
            <div className="modal-dialog modal-dialog-centered modal-lg">
                <div className="modal-content shadow">
                    <div className="modal-header">
                        <h4 className="modal-title">{handleData?.type == "edit" ? "Edit" : "Register"} Company</h4>
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
                                    <div className="d-flex align-items-center flex-wrap row-gap-3 bg-light w-100 rounded p-3 mb-4">
                                        <div className="d-flex align-items-center justify-content-center avatar avatar-xxl rounded-circle border border-dashed me-2 flex-shrink-0 text-dark frames">
                                            <img
                                                src={
                                                    formData.company_logo
                                                        ? formData.company_logo instanceof File
                                                            ? URL.createObjectURL(formData.company_logo) // Preview uploaded file
                                                            : ImagePath + formData.company_logo // Assume it's a URL
                                                        : "assets/img/profiles/avatar-30.jpg" // Default image
                                                } alt="img" className="rounded-circle" />
                                        </div>
                                        <div className="profile-upload">
                                            <div className="mb-2">
                                                <h6 className="mb-1">Upload Profile Image</h6>
                                                <p className="fs-12">Image should be below 4 mb</p>
                                            </div>
                                            <div className="profile-uploader d-flex align-items-center">
                                                <div className="drag-upload-btn btn btn-sm btn-primary me-2">
                                                    Upload
                                                    <input type="file"
                                                        //  value={formData.company_logo}
                                                        name='company_logo'
                                                        onChange={onTextChange}
                                                        className="form-control image-sign" multiple="" />
                                                </div>
                                                {/* <a href="javascript:void(0);" className="btn btn-light btn-sm">Cancel</a> */}
                                            </div>

                                        </div>
                                    </div>
                                </div>
                                <div className="col-md-6">
                                    <div className="mb-3">
                                        <label className="form-label">Company Name</label>
                                        <input type="text" className="form-control"
                                            value={formData.company_name}
                                            name='company_name'
                                            onChange={onTextChange} />

                                        {hasValidationError(errors, "company_name") && (
                                            <small className="text-danger pt-1">{validationError(errors, "company_name")}</small>
                                        )}
                                    </div>
                                </div>
                                {/* <div className="col-md-6">
                                    <div className="mb-3">
                                        <label className="form-label" >Admin Email <span className="text-danger"> *</span></label>
                                        <input type="text"
                                            value={formData.company_email}
                                            name='company_email'
                                            onChange={onTextChange}
                                            className="form-control" />
                                        {hasValidationError(errors, "company_email") && (
                                            <small className="text-danger pt-1">{validationError(errors, "company_email")}</small>
                                        )}
                                    </div>
                                </div> */}
                                <div className="col-md-6">
                                    <div className="mb-3">
                                        <label className="form-label">Email Address</label>
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
                                                    value={formData.database_name}
                                                    disabled
                                                    name='database_name'
                                                    onChange={onTextChange}
                                                />
                                                {hasValidationError(errors, "database_name") && (
                                                    <small className="text-danger pt-1">{validationError(errors, "database_name")}</small>
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
                                            {
                                                serviceTypeData?.data?.map((item, index) => {
                                                    // console.log(formData.service_ids);
                                                    return (
                                                        <div className="form-check" key={index}>
                                                            <input className="form-check-input" type="checkbox"
                                                                name="service_ids" value={item?.id}
                                                                disabled={item?.id == "1"}
                                                                checked={formData.service_ids.includes(String(item?.id))}
                                                                onChange={(e) => {
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
                                            <div className="mb-3 ">
                                                <label className="form-label">Config <span className="text-danger"> *</span></label>
                                                <div className="pass-group">

                                                    <select value={formData.config}
                                                        name='config'
                                                        onChange={onTextChange} className="custom-select">
                                                        <option>Select</option>
                                                        <option value={"Yes"}>Yes</option>
                                                        <option value={"No"}>No</option>
                                                    </select>
                                                </div>
                                                {hasValidationError(errors, "config") && (
                                                    <small className="text-danger pt-1">{validationError(errors, "config")}</small>
                                                )}
                                            </div>
                                        </div>
                                        <div className="col-md-4">
                                            <div className="mb-3 ">
                                                <label className="form-label">Deliver <span className="text-danger"> *</span></label>
                                                <div className="pass-group">

                                                    <select value={formData.delivered}
                                                        name='delivered'
                                                        onChange={onTextChange} className="custom-select">
                                                        <option>Select Deliver</option>
                                                        <option value={"Pending"}>Pending </option>
                                                        <option value={"Delivered"}>Delivered</option>
                                                    </select>
                                                </div>
                                                {hasValidationError(errors, "config") && (
                                                    <small className="text-danger pt-1">{validationError(errors, "config")}</small>
                                                )}
                                            </div>
                                        </div>

                                        <div className="col-md-4">
                                            <div className="mb-3">
                                                <label className="form-label">Start Date</label>
                                                <input type="date"
                                                    min={new Date().toISOString().split("T")[0]}
                                                    value={formData?.plan_start_date}
                                                    name='plan_start_date'
                                                    onChange={onTextChange} className="form-control" />
                                                {hasValidationError(errors, "plan_start_date") && (
                                                    <small className="text-danger pt-1">{validationError(errors, "plan_start_date")}</small>
                                                )}
                                            </div>
                                        </div>
                                        {/* <div className="col-md-4">
                                            <div className="mb-3">
                                                <label className="form-label">End Date</label>
                                                <input type="date" value={formData?.plan_end_date}
                                                    name='plan_end_date'
                                                    onChange={onTextChange} className="form-control" />
                                                {hasValidationError(errors, "plan_end_date") && (
                                                    <small className="text-danger pt-1">{validationError(errors, "plan_end_date")}</small>
                                                )}
                                            </div>
                                        </div> */}
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
                                            "Submit"
                                }
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default RegisterFromDemo
