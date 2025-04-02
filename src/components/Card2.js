import React from "react";

const Card2 = ({ data }) => {
  // console.log("data", data);

  return (
    <div className="col-xxl-4 col-xl-12 d-flex">
      <div className="card flex-fill">
        <div className="card-header pb-2 d-flex align-items-center justify-content-between flex-wrap">
          <h5 className="mb-2">{data?.title}</h5>
          <a
            href="purchase-transaction.html"
            className="btn btn-light btn-md mb-2"
          >
            View All
          </a>
        </div>
        <div className="card-body pb-2">
          <div className="d-sm-flex justify-content-between flex-wrap mb-3">
            <div className="d-flex align-items-center mb-2">
              <a
                href="javscript:void(0);"
                className="avatar avatar-md bg-gray-100 rounded-circle flex-shrink-0"
              >
                <img
                  src="assets/img/company/company-02.svg"
                  className="img-fluid w-auto h-auto"
                  alt="img"
                />
              </a>
              <div className="ms-2 flex-fill">
                <h6 className="fs-medium text-truncate mb-1">
                  <a href="javscript:void(0);">Stellar Dynamics</a>
                </h6>
                <p className="fs-13 d-inline-flex align-items-center">
                  <span className="text-info">#12457</span>
                  <i className="ti ti-circle-filled fs-4 text-primary mx-1"></i>
                  14 Jan 2025
                </p>
              </div>
            </div>
            <div className="text-sm-end mb-2">
              <h6 className="mb-1">+$245</h6>
              <p className="fs-13">Basic (Monthly)</p>
            </div>
          </div>
          {/* <div className="d-sm-flex justify-content-between flex-wrap mb-3">
            <div className="d-flex align-items-center mb-2">
              <a
                href="javscript:void(0);"
                className="avatar avatar-md bg-gray-100 rounded-circle flex-shrink-0"
              >
                <img
                  src="assets/img/company/company-07.svg"
                  className="img-fluid w-auto h-auto"
                  alt="img"
                />
              </a>
              <div className="ms-2 flex-fill">
                <h6 className="fs-medium text-truncate mb-1">
                  <a href="javscript:void(0);">TerraFusion Energy</a>
                </h6>
                <p className="fs-13 d-inline-flex align-items-center">
                  <span className="text-info">#43412</span>
                  <i className="ti ti-circle-filled fs-4 text-primary mx-1"></i>
                  14 Jan 2025
                </p>
              </div>
            </div>
            <div className="text-sm-end mb-2">
              <h6 className="mb-1">+$145</h6>
              <p className="fs-13">Enterprise (Monthly)</p>
            </div>
          </div>
          <div className="d-sm-flex justify-content-between flex-wrap mb-3">
            <div className="d-flex align-items-center mb-2">
              <a
                href="javscript:void(0);"
                className="avatar avatar-md bg-gray-100 rounded-circle flex-shrink-0"
              >
                <img
                  src="assets/img/company/company-03.svg"
                  className="img-fluid w-auto h-auto"
                  alt="img"
                />
              </a>
              <div className="ms-2 flex-fill">
                <h6 className="fs-medium text-truncate mb-1">
                  <a href="javscript:void(0);">Quantum Nexus</a>
                </h6>
                <p className="fs-13 d-inline-flex align-items-center">
                  <span className="text-info">#65974</span>
                  <i className="ti ti-circle-filled fs-4 text-primary mx-1"></i>
                  14 Jan 2025
                </p>
              </div>
            </div>
            <div className="text-sm-end mb-2">
              <h6 className="mb-1">+$395</h6>
              <p className="fs-13">Enterprise (Yearly)</p>
            </div>
          </div>
          <div className="d-sm-flex justify-content-between flex-wrap mb-3">
            <div className="d-flex align-items-center mb-2">
              <a
                href="javscript:void(0);"
                className="avatar avatar-md bg-gray-100 rounded-circle flex-shrink-0"
              >
                <img
                  src="assets/img/company/company-05.svg"
                  className="img-fluid w-auto h-auto"
                  alt="img"
                />
              </a>
              <div className="ms-2 flex-fill">
                <h6 className="fs-medium text-truncate mb-1">
                  <a href="javscript:void(0);">Aurora Technologies</a>
                </h6>
                <p className="fs-13 d-inline-flex align-items-center">
                  <span className="text-info">#22457</span>
                  <i className="ti ti-circle-filled fs-4 text-primary mx-1"></i>
                  14 Jan 2025
                </p>
              </div>
            </div>
            <div className="text-sm-end mb-2">
              <h6 className="mb-1">+$145</h6>
              <p className="fs-13">Advanced (Monthly)</p>
            </div>
          </div> */}
          {/* <div className="d-sm-flex justify-content-between flex-wrap mb-1">
          <div className="d-flex align-items-center mb-2">
            <a
              href="javscript:void(0);"
              className="avatar avatar-md bg-gray-100 rounded-circle flex-shrink-0"
            >
              <img
                src="assets/img/company/company-08.svg"
                className="img-fluid w-auto h-auto"
                alt="img"
              />
            </a>
            <div className="ms-2 flex-fill">
              <h6 className="fs-medium text-truncate mb-1">
                <a href="javscript:void(0);">Epicurean Delights</a>
              </h6>
              <p className="fs-13 d-inline-flex align-items-center">
                <span className="text-info">#43567</span>
                <i className="ti ti-circle-filled fs-4 text-primary mx-1"></i>
                14 Jan 2025
              </p>
            </div>
          </div>
          <div className="text-sm-end mb-2">
            <h6 className="mb-1">+$977</h6>
            <p className="fs-13">Premium (Yearly)</p>
          </div>
        </div> */}
        </div>
      </div>
    </div>
  );
};

export default Card2;
