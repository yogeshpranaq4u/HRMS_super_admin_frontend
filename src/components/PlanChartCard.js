import React, { useState } from "react";
import ReactApexChart from "react-apexcharts";
import { Link } from "react-router-dom";

const PlanChartCard = () => {
    const [PlanChart] = useState({
        chart: {
            height: 240,
            type: 'donut',
            toolbar: {
              show: false,
            }
          },
          colors: ['#FFC107', '#1B84FF', '#F26522'],
          series: [20, 60, 20],
          labels: ['Enterprise', 'Premium', 'Basic'],
          plotOptions: {
            pie: {
              donut: {
                size: '50%',
                labels: {
                  show: false
                },
                borderRadius: 30
              }
            }
          },
          stroke: {
            lineCap: 'round',
            show: true,
            width: 0,    // Space between donut sections
            colors: '#fff'
          },
          dataLabels: {
            enabled: false
          },
          legend: { show: false },
          responsive: [{
            breakpoint: 480,
            options: {
              chart: {
                height: 180,
              },
              legend: {
                position: 'bottom'
              }
            }
          }]
      })
  return (
    <div className="col-xxl-4 col-xl-12 d-flex">
      <div className="card flex-fill">
        <div className="card-header pb-2 d-flex align-items-center justify-content-between flex-wrap">
          <h5 className="mb-2">Top Plans</h5>
          <div className="dropdown mb-2">
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
          </div>
        </div>
        <div className="card-body">
          <ReactApexChart
            options={PlanChart}
            series={PlanChart.series}
            type="donut"
            height={240}
          />
          <div className="d-flex align-items-center justify-content-between mb-2">
            <p className="f-13 mb-0">
              <i className="ti ti-circle-filled text-primary me-1" />
              Basic{" "}
            </p>
            <p className="f-13 fw-medium text-gray-9">60%</p>
          </div>
          <div className="d-flex align-items-center justify-content-between mb-2">
            <p className="f-13 mb-0">
              <i className="ti ti-circle-filled text-warning me-1" />
              Premium
            </p>
            <p className="f-13 fw-medium text-gray-9">20%</p>
          </div>
          <div className="d-flex align-items-center justify-content-between mb-0">
            <p className="f-13 mb-0">
              <i className="ti ti-circle-filled text-info me-1" />
              Enterprise
            </p>
            <p className="f-13 fw-medium text-gray-9">20%</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlanChartCard;
