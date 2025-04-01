import React, { useEffect } from "react";
import MainLayout from "../../layouts/MainLayout";
import BreadCrums from "../../components/BreadCrums";
import Card from "../../components/Card";
import Card2 from "../../components/Card2";
import PlanChartCard from "../../components/PlanChartCard";
import { useDispatch, useSelector } from "react-redux";
import { getDashBoardData } from "../../redux/actions/dashBoardActions";

function Dashboard() {
  const details = JSON.parse(sessionStorage.getItem("userDetails")) || {}

  const dispatch = useDispatch();
  const data = useSelector(state => state?.commenData?.dashData);


  useEffect(() => {
    dispatch(getDashBoardData());
  }, []);
  console.log("XZcvxvcxvxcvcxv",data)
  return (
    <MainLayout>
      <div className="page-wrapper">
        <div className="content">
          <BreadCrums
            title={"DashBoard"}
            data={[
              { path: "/", title: "Superadmin" },
              { path: "/", title: "Dashboard" },
            ]}
          />

          <div className="welcome-wrap mb-4">
            <div className=" d-flex align-items-center justify-content-between flex-wrap">
              <div className="mb-3">
                <h2 className="mb-1 text-white">Welcome Back,{details?.user?.name} </h2>
                <p className="text-light">
                  14 New Companies Subscribed Today !!!
                </p>
              </div>
              <div className="d-flex align-items-center flex-wrap mb-1">
                <a
                  href="companies.html"
                  className="btn btn-dark btn-md me-2 mb-2"
                >
                  Companies
                </a>
                <a href="packages.html" className="btn btn-light btn-md mb-2">
                  All Packages
                </a>
              </div>
            </div>
            <div className="welcome-bg">
              <img
                src="assets/img/bg/welcome-bg-02.svg"
                alt="img"
                className="welcome-bg-01"
              />
              <img
                src="assets/img/bg/welcome-bg-03.svg"
                alt="img"
                className="welcome-bg-02"
              />
              <img
                src="assets/img/bg/welcome-bg-01.svg"
                alt="img"
                className="welcome-bg-03"
              />
            </div>
          </div>

          <div className="row">
            {/* <div className="col-xl-3 col-sm-6 d-flex">
              <div className="card flex-fill">
                <div className="card-body">
                  <div className="d-flex align-items-center justify-content-between">
                    <span className="avatar avatar-md bg-dark mb-3">
                      <i className="ti ti-building fs-16"></i>
                    </span>
                    <span className="badge bg-success fw-normal mb-3">
                      +19.01%
                    </span>
                  </div>
                  <div className="d-flex align-items-center justify-content-between">
                    <div>
                      <h2 className="mb-1">5468</h2>
                      <p className="fs-13">Total Companies</p>
                    </div>
                    <div className="company-bar1">5,10,7,5,10,7,5</div>
                  </div>
                </div>
              </div>
            </div> */}
            <Card
              data={{
                img: "ti ti-building fs-16",
                value: "5468",
                title: "Total Companies",
              }}
            />
            <Card
              data={{
                img: "ti ti-carousel-vertical fs-16",
                value: "5468",
                title: "Active Companies",
              }}
            />
            <Card
              data={{
                img: "ti ti-chalkboard-off fs-16",
                value: "5468",
                title: "Total Subscribers",
              }}
            />
            <Card
              data={{
                img: "ti ti-businessplan fs-16",
                value: "5468",
                title: "Total Earnings",
              }}
            />
          </div>
          <div className="row">
            <Card2 data={{ title: "Recent Tickets", type: "Tickets" }} />
            <Card2 data={{ title: "Recently Demo", type: "Demo" }} />
            <PlanChartCard/>
          </div>
          <div className="row">
            <Card2
              data={{ title: "Recent Transactions", type: "Transactions" }}
            />
            <Card2
              data={{ title: "Recently Registered", type: "Registered" }}
            />
            <Card2
              data={{ title: "Recent Plan Expired", type: "Plan Expired" }}
            />
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

export default Dashboard;
