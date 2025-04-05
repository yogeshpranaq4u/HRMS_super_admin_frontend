import React, { useState } from "react";
import moment from "moment";
import { formatDate } from "../helpers/DateFormate";
import { Link } from "react-router-dom";

const Card2 = ({ data }) => {
  const [selectedTab, setSelectedTab] = useState("Expired"); // default
  const handleSelect = (value) => {
    setSelectedTab(value);
  };

  return (
    <div className="col-xxl-4 col-xl-12 d-flex">
      <div className="card flex-fill  ">
        <div className="card-header pb-2 d-flex align-items-center justify-content-between flex-wrap">
          <h5 className="mb-2">{data?.title}</h5>

          {data?.type !== "Plan Expired" ? (
            <a
              href="purchase-transaction.html"
              className="btn btn-light btn-md mb-2"
            >
              View All
            </a>
          ) : (
            <div className="dropdown mb-2">
              <Link
                to="#"
                className="dropdown-toggle btn btn-white border btn-sm d-inline-flex align-items-center fs-13"
                data-bs-toggle="dropdown"
              >
                {selectedTab}
              </Link>
              <div className="dropdown-menu dropdown-menu-end p-3">
                <ul className="nav d-block">
                  <li>
                    <Link
                      to="#"
                      className="dropdown-item d-block rounded-1"
                      data-bs-toggle="tab"
                      data-bs-target="#expired"
                      onClick={() => handleSelect("Expired")}
                    >
                      Expired
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="#"
                      className="dropdown-item d-block rounded-1"
                      data-bs-toggle="tab"
                      data-bs-target="#expiry"
                      onClick={() => handleSelect("Expiry")}
                    >
                      Expiry
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          )}
        </div>
        <div
          className="card-body pb-2"
          style={{ maxHeight: "400px", overflowY: "auto" }}
        >
          {data?.type !== "Plan Expired" ? (
            data?.data?.map((item, index) =>
              data?.type == "Demo" ? (
                <div
                  key={index}
                  className="d-sm-flex justify-content-between flex-wrap mb-3"
                >
                  <div className="d-flex align-items-center mb-2">
                    <a className="avatar avatar-md bg-gray-100 rounded-circle flex-shrink-0">
                      <img
                        src="assets/img/company/company-02.svg"
                        className="img-fluid w-auto h-auto"
                        alt="img"
                      />
                      {/* <i className="ti ti-report fs-24 text-primary"></i> */}
                    </a>
                    <div className="ms-2 flex-fill">
                      <h6 className="fs-medium text-truncate mb-1">
                        <a href="javscript:void(0);">{item?.company_name}</a>
                      </h6>
                      <p className="fs-13 d-inline-flex align-items-center">
                        <span className="text-info">
                          {item?.company_domain}
                        </span>
                        <i className="ti ti-circle-filled fs-4 text-primary mx-1"></i>
                        {item?.phone_no}
                      </p>
                    </div>
                  </div>
                  <div className="text-sm-end mb-2">
                    <h6 className="mb-1">Demo Status</h6>
                    <p className="fs-13">{item?.demo_status}</p>
                  </div>
                </div>
              ) : data?.type == "Registered" ? (
                <div
                  key={index}
                  className="d-sm-flex justify-content-between flex-wrap mb-3"
                >
                  <div className="d-flex align-items-center mb-2">
                    <a className="avatar avatar-md bg-gray-100 rounded-circle flex-shrink-0">
                      <img
                        src="assets/img/company/company-02.svg"
                        className="img-fluid w-auto h-auto"
                        alt="img"
                      />
                      {/* <i className="ti ti-report fs-24 text-primary"></i> */}
                    </a>
                    <div className="ms-2 flex-fill">
                      <h6 className="fs-medium text-truncate mb-1">
                        <a href="javscript:void(0);">{item?.company_name}</a>
                      </h6>
                      <p className="fs-13 d-inline-flex align-items-center">
                        <span className="text-info">
                          {item?.plan?.name ? item?.plan?.name : ""}
                        </span>
                        {item?.plan ? (
                          <i className="ti ti-circle-filled fs-4 text-primary mx-1"></i>
                        ) : (
                          ""
                        )}
                        {item?.plan?.duration ? `(${item.plan.duration})` : ""}
                      </p>
                    </div>
                  </div>
                  <div className="text-sm-end mb-2">
                    <h6 className="mb-1">{item?.team_size} Users</h6>
                    <p className="fs-13">{item?.company_id}</p>
                  </div>
                </div>
              ) : data?.type == "Transactions" ? (
                <div
                  key={index}
                  className="d-sm-flex justify-content-between flex-wrap mb-3"
                >
                  <div className="d-flex align-items-center mb-2">
                    <a className="avatar avatar-md bg-gray-100 rounded-circle flex-shrink-0">
                      <img
                        src="assets/img/company/company-02.svg"
                        className="img-fluid w-auto h-auto"
                        alt="img"
                      />
                      {/* <i className="ti ti-report fs-24 text-primary"></i> */}
                    </a>
                    <div className="ms-2 flex-fill">
                      <h6 className="fs-medium text-truncate mb-1">
                        <a href="javscript:void(0);">
                          {item?.company?.company_name}
                        </a>
                      </h6>
                      <p className="fs-13 d-inline-flex align-items-center">
                        <span className="text-info">
                          #{item?.invoice_number}
                        </span>
                        <i className="ti ti-circle-filled fs-4 text-primary mx-1"></i>
                        {formatDate(item?.invoice_date)}
                      </p>
                    </div>
                  </div>
                  <div className="text-sm-end mb-2">
                    <h6 className="mb-1">{item?.amount}</h6>
                    <p className="fs-13">
                      {item?.plan?.name}{" "}
                      {item?.plan?.duration ? `(${item.plan.duration})` : ""}
                    </p>
                  </div>
                </div>
              ) : (
                <>
                  <div
                    key={index}
                    className="d-sm-flex justify-content-between flex-wrap mb-3"
                  >
                    <div className="d-flex align-items-center mb-2">
                      <a className="avatar avatar-md bg-gray-100 rounded-circle flex-shrink-0">
                        <img
                          src="assets/img/company/company-02.svg"
                          className="img-fluid w-auto h-auto"
                          alt="img"
                        />
                        {/* <i className="ti ti-report fs-24 text-primary"></i> */}
                      </a>
                      <div className="ms-2 flex-fill">
                        <h6 className="fs-medium text-truncate mb-1">
                          <a href="javscript:void(0);">{item?.company_name}</a>
                        </h6>
                        <p className="fs-13 d-inline-flex align-items-center">
                          <span className="text-info">
                            {item?.company_domain}
                          </span>
                          <i className="ti ti-circle-filled fs-4 text-primary mx-1"></i>
                          {item?.phone_no}
                        </p>
                      </div>
                    </div>
                    <div className="text-sm-end mb-2">
                      <h6 className="mb-1">Demo Status</h6>
                      <p className="fs-13">{item?.demo_status}</p>
                    </div>
                  </div>
                </>
              )
            )
          ) : (
           data
          )}
        </div>
      </div>
    </div>
  );
};

export default Card2;
