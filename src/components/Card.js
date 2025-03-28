import React from "react";

const Card = ({
 data
}) => {
  return (
    <div className="col-xl-3 col-sm-6 d-flex">
      <div className="card flex-fill">
        <div className="card-body">
          <div className="d-flex align-items-center justify-content-between">
            <span className="avatar avatar-md bg-dark mb-3">
              <i className={data?.img}></i>
            </span>
            <span className="badge bg-success fw-normal mb-3">+19.01%</span>
          </div>
          <div className="d-flex align-items-center justify-content-between">
            <div>
              <h2 className="mb-1">{data?.value}</h2>
              <p className="fs-13">{data?.title}</p>
            </div>
            {/* <div className="company-bar1">5,10,7,5,10,7,5</div> */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Card;
