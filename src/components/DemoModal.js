import React, { useState } from "react";
import axios from "axios"; // For API calls

const baseUrl = "https://development-hrms-services.cvinfotechserver.com/hrms_backend/public/api"
const DemoRequestModal = ({ show, handleClose }) => {
  // Form state
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone_no: "",
    company_name: "",
    company_domain:"democompany.com",
    company_size: "",
    selection: [],
  });

  // Error state
  const [errors, setErrors] = useState({});

  // Handle input change
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === "checkbox") {
      setFormData((prev) => ({
        ...prev,
        selection: checked
          ? [...prev.selection, value]
          : prev.selection.filter((s) => s !== value),
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  // Validate form
  const validateForm = () => {
    let newErrors = {};
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.email.trim()) newErrors.email = "Email is required";
    if (!/^\S+@\S+\.\S+$/.test(formData.email))
      newErrors.email = "Invalid email format";
    if (!formData.phone_no.trim()) newErrors.phone_no = "phone_no is required";
    if (!/^\d{10}$/.test(formData.phone_no))
      newErrors.phone_no = "phone_no must be 10 digits";
    if (!formData.company_name.trim()) newErrors.company_name = "company_name name is required";
    if (!formData.company_size) newErrors.company_size = "Select a team size";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      setLoading(true)
      let data = JSON.stringify(formData);
      
      let config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: `${baseUrl}/request-demo`,
        headers: { 
          'Content-Type': 'application/json'
        },
        data : data
      };
      const response =await axios.request(config)
      alert(response.data?.message||"Form submitted successfully!");
      // console.log(response.data);
      if(response.data?.success){
        setFormData({
          name: "",
          email: "",
          phone_no: "",
          company_name: "",
          company_domain:"democompany.com",
          company_size: "",
          selection: [],
        })
      }
      setLoading(false)
      handleClose(); // Close modal on success
    } catch (error) {
      console.error("Error submitting form", error);
      alert("Submission failed, please try again");
      setLoading(false)
    }
  };

  return (
    <div className={`modal fade ${show ? "show d-block" : ""}`} tabIndex="-1">
      <div className="modal-dialog modal-dialog-centered shadow">
        <div className="modal-content shadow" style={{zIndex:"2"}}>
          <div className="modal-header">
            <h5 className="modal-title fw-bold">Request a Demo</h5>
            <button type="button" className="btn-close" onClick={handleClose}></button>
          </div>

          <div className="modal-body">
            <p className="text-muted text-start">Please fill the form for demo details</p>

            <form onSubmit={(e)=>{
              if(!loading){
                handleSubmit(e)
              }}
              }>
              {/* Name */}
              <div className="mb-3">
                <label className="form-label">Your Name*</label>
                <input type="text" name="name" className="form-control" placeholder="Enter your full name"
                  value={formData.name} onChange={handleChange} />
                {errors.name && <small className="text-danger">{errors.name}</small>}
              </div>

              {/* Email */}
              <div className="mb-3">
                <label className="form-label">Your Email*</label>
                <input type="email" name="email" className="form-control" placeholder="name@email.com"
                  value={formData.email} onChange={handleChange} />
                {errors.email && <small className="text-danger">{errors.email}</small>}
              </div>

              {/* phone_no */}
              <div className="mb-3">
                <label className="form-label">Your Phone No *</label>
                <div className="input-group">
                  <span className="input-group-text">🇮🇳 +91</span>
                  <input type="tel" name="phone_no" className="form-control" placeholder="Enter phone_no number"
                    value={formData.phone_no} onChange={handleChange} />
                </div>
                {errors.phone_no && <small className="text-danger">{errors.phone_no}</small>}
              </div>

              {/* Company & Team Size */}
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label">Company Name</label>
                  <input type="text" name="company_name" className="form-control" placeholder="Enter company name"
                    value={formData.company_name} onChange={handleChange} />
                  {errors.company_name && <small className="text-danger">{errors.company_name}</small>}
                </div>

                <div className="col-md-6 mb-3">
                  <label className="form-label">Team Size</label>
                  <select name="company_size" className="form-select" value={formData.company_size} onChange={handleChange}>
                    <option value="">Select your team size</option>
                    <option value="1-10">1-10</option>
                    <option value="11-50">11-50</option>
                    <option value="51-100">51-100</option>
                    <option value="100+">100+</option>
                  </select>
                  {errors.company_size && <small className="text-danger">{errors.company_size}</small>}
                </div>
              </div>

              {/* selection */}
              <div className="mb-3">
                <label className="form-label">selection</label>
                <div className="form-check">
                  <input className="form-check-input" type="checkbox" name="selection" value="HRMS"
                    checked={formData.selection.includes("HRMS")} onChange={handleChange} />
                  <label className="form-check-label">HRMS</label>
                </div>
                <div className="form-check">
                  <input className="form-check-input" type="checkbox" name="selection" value="Invoice"
                    checked={formData.selection.includes("Invoice")} onChange={handleChange} />
                  <label className="form-check-label">Invoice</label>
                </div>
              </div>

              {/* Submit Button */}
              <button type="submit" className="btn btn-primary w-100">
               {loading ? "Loading..." : "Request Demo"} 
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DemoRequestModal;
