import React, { useMemo } from "react";

import ReactApexChart from "react-apexcharts";

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
      colors: data?.planSummary?.map((plan) => plan?.color),
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

  // const [PlanChart] = useState({
  //   chart: {
  //     height: 240,
  //     type: "donut",
  //     toolbar: {
  //       show: false,
  //     },
  //   },
  //   colors: data?.planSummary?.map((plan) => plan?.color),
  //   series: data?.planSummary?.map((plan) => plan?.purchase_percentage),
  //   labels: data?.planSummary?.map((plan) => plan?.plan_name),
  //   plotOptions: {
  //     pie: {
  //       donut: {
  //         size: "50%",
  //         labels: {
  //           show: false,
  //         },
  //         borderRadius: 30,
  //       },
  //     },
  //   },
  //   stroke: {
  //     lineCap: "round",
  //     show: true,
  //     width: 0, // Space between donut sections
  //     colors: "#fff",
  //   },
  //   dataLabels: {
  //     enabled: false,
  //   },
  //   legend: { show: false },
  //   responsive: [
  //     {
  //       breakpoint: 480,
  //       options: {
  //         chart: {
  //           height: 180,
  //         },
  //         legend: {
  //           position: "bottom",
  //         },
  //       },
  //     },
  //   ],
  // });
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
                    color: plan?.color,
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
