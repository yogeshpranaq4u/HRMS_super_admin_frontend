import React, { useState } from "react";
import ReactApexChart from "react-apexcharts";
import { Link } from "react-router-dom";

const PlanChartCard = ({ data }) => {
  console.log("data", data?.planSummary);
  const [PlanChart] = useState({
    chart: {
      height: 240,
      type: "donut",
      toolbar: {
        show: false,
      },
    },
    colors: ["#1B84FF","#F26522", "#FFC107", ],
    series: data?.planSummary?.map((plan) => plan?.purchase_percentage),
    labels: data?.planSummary?.map((plan) => plan?.plan_name),
    plotOptions: {
      pie: {
        donut: {
          size: "50%",
          labels: {
            show: false,
          },
          borderRadius: 30,
        },
      },
    },
    stroke: {
      lineCap: "round",
      show: true,
      width: 0, // Space between donut sections
      colors: "#fff",
    },
    dataLabels: {
      enabled: false,
    },
    legend: { show: false },
    responsive: [
      {
        breakpoint: 480,
        options: {
          chart: {
            height: 180,
          },
          legend: {
            position: "bottom",
          },
        },
      },
    ],
  });
  return (
    <div className="col-xxl-4 col-xl-12 d-flex">
      <div className="card flex-fill">
        <div className="card-header pb-2 d-flex align-items-center justify-content-between flex-wrap">
          <h5 className="mb-2">Top Plans</h5>
          {/* <div className="dropdown mb-2">
            <Link
              to="#"
              className="btn btn-white border btn-sm d-inline-flex align-items-center"
              data-bs-toggle="dropdown"
            >
              <i className="ti ti-calendar me-1" />
              This Month
            </Link>
            <ul className="dropdown-menu  dropdown-menu-end p-3">
              <li>
                <Link to="#" className="dropdown-item rounded-1">
                  This Month
                </Link>
              </li>
              <li>
                <Link to="#" className="dropdown-item rounded-1">
                  This Week
                </Link>
              </li>
              <li>
                <Link to="#" className="dropdown-item rounded-1">
                  Today
                </Link>
              </li>
            </ul>
          </div> */}
        </div>
        <div className="card-body">
          <ReactApexChart
            options={PlanChart}
            series={PlanChart.series}
            type="donut"
            height={240}
          />
          {data?.planSummary?.map((plan, index) => (
            <div className="d-flex align-items-center justify-content-between mb-2">
              <p className="f-13 mb-0">
                <i
                  className={`ti ti-circle-filled me-1 ${
                    plan.plan_name === "Basic"
                      ? "text-blue-500"
                      : plan.plan_name === "Advance"
                      ? "text-orange-500"
                      : plan.plan_name === "Pro"
                      ? "text-yellow-500"
                      : "text-gray-400"
                  }`}
                />
                {plan?.plan_name}
              </p>
              <p className="f-13 fw-medium text-gray-9">
                {" "}
                {Number(plan.purchase_percentage.toFixed(2))}%
              </p>
            </div>
          ))}

          {/* <div className="d-flex align-items-center justify-content-between mb-2">
            <p className="f-13 mb-0">
              <i className="ti ti-circle-filled text-warning me-1" />
              {data?.planSummary[1]?.plan_name}
            </p>
            <p className="f-13 fw-medium text-gray-9">20%</p>
          </div>
          <div className="d-flex align-items-center justify-content-between mb-0">
            <p className="f-13 mb-0">
              <i className="ti ti-circle-filled text-info me-1" />
              {data?.planSummary[2]?.plan_name}
            </p>
            <p className="f-13 fw-medium text-gray-9">20%</p>
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default PlanChartCard;
