import React, { useState } from "react";
import MainLayout from "../../layouts/MainLayout";
import BreadCrums from "../../components/BreadCrums";
import { Link } from "react-router-dom";
import TableComponent from "../../components/TableComponent";

const Company = () => {
  const companies_details = [
    {
      key: "1",
      CompanyName: "BrightWave Innovations",
      Email: "michael@example.com",
      AccountURL: "bwi.example.com",
      Plan: "Advanced (Monthly)",
      CreatedDate: "12 Sep 2024",
      Image: "company-01.svg",
      Status: "Active",
    },
    {
      key: "2",
      CompanyName: "Stellar Dynamics",
      Email: "sophie@example.com",
      AccountURL: "sd.example.com",
      Plan: "Basic (Yearly)",
      CreatedDate: "24 Oct 2024",
      Image: "company-02.svg",
      Status: "Active",
    },
    {
      key: "3",
      CompanyName: "Quantum Nexus",
      Email: "cameron@example.com",
      AccountURL: "qn.example.com",
      Plan: "Advanced (Monthly)",
      CreatedDate: "18 Feb 2024",
      Image: "company-03.svg",
      Status: "Active",
    },
    {
      key: "4",
      CompanyName: "EcoVision Enterprises",
      Email: "doris@example.com",
      AccountURL: "eve.example.com",
      Plan: "Advanced (Monthly)",
      CreatedDate: "17 Oct 2024",
      Image: "company-04.svg",
      Status: "Active",
    },
    {
      key: "5",
      CompanyName: "Aurora Technologies",
      Email: "thomas@example.com",
      AccountURL: "at.example.com",
      Plan: "Enterprise (Monthly)",
      CreatedDate: "20 Jul 2024",
      Image: "company-05.svg",
      Status: "Active",
    },
    {
      key: "6",
      CompanyName: "BlueSky Ventures",
      Email: "kathleen@example.com",
      AccountURL: "bsv.example.com",
      Plan: "Advanced (Monthly)",
      CreatedDate: "10 Apr 2024",
      Image: "company-06.svg",
      Status: "Active",
    },
    {
      key: "7",
      CompanyName: "TerraFusion Energy",
      Email: "bruce@example.com",
      AccountURL: "tfe.example.com",
      Plan: "Enterprise (Yearly)",
      CreatedDate: "29 Aug 2024",
      Image: "company-07.svg",
      Status: "Active",
    },
    {
      key: "8",
      CompanyName: "UrbanPulse Design",
      Email: "estelle@example.com",
      AccountURL: "upd.example.com",
      Plan: "Basic (Monthly)",
      CreatedDate: "22 Feb 2024",
      Image: "company-08.svg",
      Status: "Inactive",
    },
    {
      key: "9",
      CompanyName: "Nimbus Networks",
      Email: "stephen@example.com",
      AccountURL: "nn.example.com",
      Plan: "Basic (Yearly)",
      CreatedDate: "03 Nov 2024",
      Image: "company-09.svg",
      Status: "Active",
    },
    {
      key: "10",
      CompanyName: "Epicurean Delights",
      Email: "angela@example.com",
      AccountURL: "ed.example.com",
      Plan: "Advanced (Monthly)",
      CreatedDate: "17 Dec 2024",
      Image: "company-10.svg",
      Status: "Active",
    },
  ];
  const data = companies_details;
  const columns = [
    {
      title: "Company Name",
      dataIndex: "CompanyName",
      render: (text, record) => (
        <div className="d-flex align-items-center file-name-icon">
          <Link to="#" className="avatar avatar-md border rounded-circle">
            {/* <ImageWithBasePath
              src={`assets/img/company/${record.Image}`}
              className="img-fluid"
              alt="img"
            /> */}
          </Link>
          <div className="ms-2">
            <h6 className="fw-medium">
              <Link to="#">{record.CompanyName}</Link>
            </h6>
          </div>
        </div>
      ),
      sorter: (a, b) => a.CompanyName.length - b.CompanyName.length,
    },
    {
      title: "Email",
      dataIndex: "Email",
      sorter: (a, b) => a.Email.length - b.Email.length,
    },
    {
      title: "Account URL",
      dataIndex: "AccountURL",
      sorter: (a, b) => a.AccountURL.length - b.AccountURL.length,
    },
    {
      title: "Plan",
      dataIndex: "Plan",
      render: (text, record) => (
        <div className="d-flex align-items-center justify-content-between">
          <p className="mb-0 me-2">{record.Plan}</p>
          <Link
            to="#"
            data-bs-toggle="modal"
            className="badge badge-purple badge-xs"
            data-bs-target="#upgrade_info"
          >
            Upgrade
          </Link>
        </div>
      ),
      sorter: (a, b) => a.Plan.length - b.Plan.length,
    },
    {
      title: "Created Date",
      dataIndex: "CreatedDate",
      sorter: (a, b) => a.CreatedDate.length - b.CreatedDate.length,
    },
    {
      title: "Status",
      dataIndex: "Status",
      render: (text, record) => (
        <span
          className={`badge ${text === "Active" ? "badge-success" : "badge-danger"
            } d-inline-flex align-items-center badge-xs`}
        >
          <i className="ti ti-point-filled me-1" />
          {text}
        </span>
      ),
      sorter: (a, b) => a.Status.length - b.Status.length,
    },
    {
      title: "Action",
      dataIndex: "actions",
      render: () => (
        <div className="action-icon d-inline-flex">
          <Link
            to="#"
            className="me-2"
            data-bs-toggle="modal"
            data-bs-target="#company_detail"
          >
            <i className="ti ti-eye" />
          </Link>
          <Link
            to="#"
            className="me-2"
            data-bs-toggle="modal"
            data-bs-target="#edit_company"
          >
            <i className="ti ti-edit" />
          </Link>
          <Link to="#" data-bs-toggle="modal" data-bs-target="#delete_modal">
            <i className="ti ti-trash" />
          </Link>
        </div>
      ),
    },
  ];
  return (
    <MainLayout>
      <div className="page-wrapper">
        <div className="content">
          {/* Breadcrumb */}
          <div className="d-md-flex d-block align-items-center justify-content-between page-breadcrumb mb-3">
            <BreadCrums
              title={"Companies"}
              data={[
                { path: "/", title: "Superadmin" },

                { path: "/company", title: "Company" },
              ]}
            />
            <div className="d-flex my-xl-auto right-content align-items-center flex-wrap ">
              <div className="me-2 mb-2">
                <div className="dropdown">
                  <Link
                    to="#"
                    className="dropdown-toggle btn btn-white d-inline-flex align-items-center"
                    data-bs-toggle="dropdown"
                  >
                    <i className="ti ti-file-export me-1" />
                    Export
                  </Link>
                  <ul className="dropdown-menu  dropdown-menu-end p-3">
                    <li>
                      <Link to="#" className="dropdown-item rounded-1">
                        <i className="ti ti-file-type-pdf me-1" />
                        Export as PDF
                      </Link>
                    </li>
                    <li>
                      <Link to="#" className="dropdown-item rounded-1">
                        <i className="ti ti-file-type-xls me-1" />
                        Export as Excel{" "}
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="mb-2">
                <Link
                  to="#"
                  data-bs-toggle="modal"
                  data-bs-target="#add_company"
                  className="btn btn-primary d-flex align-items-center"
                >
                  <i className="ti ti-circle-plus me-2" />
                  Add Company
                </Link>
              </div>
              <div className="ms-2 head-icons"></div>
            </div>
          </div>
          {/* /Breadcrumb */}
          <div className="row">
            {/* Total Companies */}
            <div className="col-lg-3 col-md-6 d-flex">
              <div className="card flex-fill">
                <div className="card-body d-flex align-items-center justify-content-between">
                  <div className="d-flex align-items-center overflow-hidden">
                    <span className="avatar avatar-lg bg-primary flex-shrink-0">
                      <i className="ti ti-building fs-16" />
                    </span>
                    <div className="ms-2 overflow-hidden">
                      <p className="fs-12 fw-medium mb-1 text-truncate">
                        Total Companies
                      </p>
                      <h4>950</h4>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* /Total Companies */}
            {/* Total Companies */}
            <div className="col-lg-3 col-md-6 d-flex">
              <div className="card flex-fill">
                <div className="card-body d-flex align-items-center justify-content-between">
                  <div className="d-flex align-items-center overflow-hidden">
                    <span className="avatar avatar-lg bg-success flex-shrink-0">
                      <i className="ti ti-building fs-16" />
                    </span>
                    <div className="ms-2 overflow-hidden">
                      <p className="fs-12 fw-medium mb-1 text-truncate">
                        Active Companies
                      </p>
                      <h4>920</h4>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* /Total Companies */}
            {/* Inactive Companies */}
            <div className="col-lg-3 col-md-6 d-flex">
              <div className="card flex-fill">
                <div className="card-body d-flex align-items-center justify-content-between">
                  <div className="d-flex align-items-center overflow-hidden">
                    <span className="avatar avatar-lg bg-danger flex-shrink-0">
                      <i className="ti ti-building fs-16" />
                    </span>
                    <div className="ms-2 overflow-hidden">
                      <p className="fs-12 fw-medium mb-1 text-truncate">
                        Inactive Companies
                      </p>
                      <h4>30</h4>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* /Inactive Companies */}
            {/* Company Location */}
            <div className="col-lg-3 col-md-6 d-flex">
              <div className="card flex-fill">
                <div className="card-body d-flex align-items-center justify-content-between">
                  <div className="d-flex align-items-center overflow-hidden">
                    <span className="avatar avatar-lg bg-skyblue flex-shrink-0">
                      <i className="ti ti-map-pin-check fs-16" />
                    </span>
                    <div className="ms-2 overflow-hidden">
                      <p className="fs-12 fw-medium mb-1 text-truncate">
                        Company Location
                      </p>
                      <h4>180</h4>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* /Company Location */}
          </div>
          <div className="card">
            <div className="card-header d-flex align-items-center justify-content-between flex-wrap row-gap-3">
              <h5>Companies List</h5>
              <div className="d-flex my-xl-auto right-content align-items-center flex-wrap row-gap-3">
                <div className="me-3">
                  <div className="input-icon-end position-relative">
                    <span className="input-icon-addon">
                      <i className="ti ti-chevron-down" />
                    </span>
                  </div>
                </div>
                <div className="dropdown me-3">
                  <Link
                    to="#"
                    className="dropdown-toggle btn btn-white d-inline-flex align-items-center"
                    data-bs-toggle="dropdown"
                  >
                    Select Plan
                  </Link>
                  <ul className="dropdown-menu  dropdown-menu-end p-3">
                    <li>
                      <Link to="#" className="dropdown-item rounded-1">
                        Advanced
                      </Link>
                    </li>
                    <li>
                      <Link to="#" className="dropdown-item rounded-1">
                        Basic
                      </Link>
                    </li>
                    <li>
                      <Link to="#" className="dropdown-item rounded-1">
                        Enterprise
                      </Link>
                    </li>
                  </ul>
                </div>
                <div className="dropdown me-3">
                  <Link
                    to="#"
                    className="dropdown-toggle btn btn-white d-inline-flex align-items-center"
                    data-bs-toggle="dropdown"
                  >
                    Select Status
                  </Link>
                  <ul className="dropdown-menu  dropdown-menu-end p-3">
                    <li>
                      <Link to="#" className="dropdown-item rounded-1">
                        Active
                      </Link>
                    </li>
                    <li>
                      <Link to="#" className="dropdown-item rounded-1">
                        Inactive
                      </Link>
                    </li>
                  </ul>
                </div>
                <div className="dropdown">
                  <Link
                    to="#"
                    className="dropdown-toggle btn btn-white d-inline-flex align-items-center"
                    data-bs-toggle="dropdown"
                  >
                    Sort By : Last 7 Days
                  </Link>
                  <ul className="dropdown-menu  dropdown-menu-end p-3">
                    <li>
                      <Link to="#" className="dropdown-item rounded-1">
                        Recently Added
                      </Link>
                    </li>
                    <li>
                      <Link to="#" className="dropdown-item rounded-1">
                        Ascending
                      </Link>
                    </li>
                    <li>
                      <Link to="#" className="dropdown-item rounded-1">
                        Desending
                      </Link>
                    </li>
                    <li>
                      <Link to="#" className="dropdown-item rounded-1">
                        Last Month
                      </Link>
                    </li>
                    <li>
                      <Link to="#" className="dropdown-item rounded-1">
                        Last 7 Days
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="card-body sv-card-body p-3">
            <div className="custom-datatable-filter table-responsive">
              <TableComponent
                tableHeader={[]}
                dataSource={[]}
                dataKeys={[]}
              />
            </div>
            </div>
          </div>
        </div>
       
      </div>
    </MainLayout>
  );
};

export default Company;
