
import React, { useState, useEffect, useMemo } from "react";
import ReactApexChart from "react-apexcharts";
import { Link } from "react-router-dom";

const PlanChartCard = ({ data }) => {
 
  const planSummary = useMemo(() => {
    if (!data) return [];
    if (Array.isArray(data.planSummary)) return data.planSummary;
    if (typeof data.planSummary === "object")
      return Object.values(data.planSummary);
    return [];
  }, [data]);

  const chartOptions = useMemo(() => {
    return {
      chart: {
        height: 240,
        type: "donut",
        toolbar: {
          show: false,
        },
      },
      colors: ["#1B84FF", "#F26522", "#FFC107"],
      labels: planSummary.map((plan) => plan?.plan_name),
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
        width: 0,
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
    };
  }, [planSummary]);

  const chartSeries = useMemo(
    () =>
      planSummary.map((plan) =>
        typeof plan?.purchase_percentage === "number"
          ? plan.purchase_percentage
          : 0
      ),
    [planSummary]
  );

  return (
    <div className="col-xxl-4 col-xl-12 d-flex">
      <div className="card flex-fill">
        <div className="card-header pb-2 d-flex align-items-center justify-content-between flex-wrap">
          <h5 className="mb-2">Top Plans</h5>
        </div>
        <div className="card-body">
          {chartSeries.length > 0 ? (
            <ReactApexChart
              options={chartOptions}
              series={chartSeries}
              type="donut"
              height={240}
            />
          ) : (
            <p>No plan data available</p>
          )}

          {planSummary?.map((plan, index) => (
            <div
              key={index}
              className="d-flex align-items-center justify-content-between mb-2"
            >
              <p className="f-13 mb-0">
                <i
                  className="ti ti-circle-filled me-1"
                  style={{
                    color:
                      plan?.plan_name === "Basic"
                        ? "#1B84FF"
                        : plan?.plan_name === "Advance"
                        ? "#F26522"
                        : plan?.plan_name === "Pro"
                        ? "#FFC107"
                        : "#9CA3AF", // Tailwind's gray-400
                  }}
                />
                {plan?.plan_name}
              </p>
              <p className="f-13 fw-medium text-gray-9">
                {Number(plan?.purchase_percentage?.toFixed(2))}%
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PlanChartCard;
