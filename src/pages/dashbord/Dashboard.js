import React, { useEffect } from "react";
import MainLayout from "../../layouts/MainLayout";
import BreadCrums from "../../components/BreadCrums";
import Card from "../../components/Card";
import Card2 from "../../components/Card2";
import PlanChartCard from "../../components/PlanChartCard";
import { useDispatch, useSelector } from "react-redux";
import {
  getDashBoardData,
  getPendingDemoRequestData,
  getPlantExpireData,
  getPurchaseSummaryData,
  getRecentRegistrationData,
  getRecenttransactionData,
} from "../../redux/actions/dashBoardActions";

function Dashboard() {
  const details = JSON.parse(sessionStorage.getItem("userDetails")) || {};

  const dispatch = useDispatch();
  const error = useSelector((state) => state?.commenData?.error);
  const loading = useSelector((state) => state?.commenData?.loading);
  const profileData = useSelector((state) => state?.commenData?.dashData);
  const purchaseSummaryData = useSelector(
    (state) => state?.commenData?.purchaseSummaryData
  );

  const pendingDemoRequestsData = useSelector(
    (state) => state?.commenData?.pendingDemoRequestsData
  );
  const recentRegistrations = useSelector(
    (state) => state?.commenData?.recentRegistrations
  );
  const planExpireData = useSelector(
    (state) => state?.commenData?.planExpireData
  );
  const recentTransaction = useSelector(
    (state) => state?.commenData?.recentTransaction
  );


  
  
  useEffect(() => {
    dispatch(getDashBoardData("all"));
    dispatch(getPurchaseSummaryData());
    dispatch(getPendingDemoRequestData("all"));
    dispatch(getRecentRegistrationData("all"));
    dispatch(getPlantExpireData("all"));
    dispatch(getRecenttransactionData("all"));
  }, []);

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
                <h2 className="mb-1 text-white">
                  Welcome Back,{details?.user?.name}{" "}
                </h2>
                {/* <p className="text-light">
                  14 New Companies Subscribed Today !!!
                </p> */}
              </div>
              <div className="d-flex align-items-center flex-wrap mb-1">
                <a
                  href="/superadmin/company"
                  className="btn btn-dark btn-md me-2 mb-2"
                >
                  Companies
                </a>
              </div>
            </div>
            <div className="welcome-bg">
              <img
                src="/assets/img/bg/welcome-bg-02.svg"
                alt="img"
                className="welcome-bg-01"
              />
              <img
                src="/assets/img/bg/welcome-bg-03.svg"
                alt="img"
                className="welcome-bg-02"
              />
              <img
                src="/assets/img/bg/welcome-bg-01.svg"
                alt="img"
                className="welcome-bg-03"
              />
            </div>
          </div>

          <div className="row">
  
            <Card
              data={{
                img: "ti ti-building fs-16",
                value: profileData?.totalCompanies,
                title: "Total Companies",
              }}
            />
            <Card
              data={{
                img: "ti ti-carousel-vertical fs-16",
                value: profileData?.activeCompanies,
                title: "Active Companies",

              }}
            />
            <Card
              data={{
                img: "ti ti-chalkboard-off fs-16",
                value: profileData?.totalRequests,
                title: "Total Subscribers",
              }}
            />
            <Card
              data={{
                img: "ti ti-businessplan fs-16",
                value:"₹"+ profileData?.totalEarnings,
                title: "Total Earnings",
              }}
            />
          </div>
          <div className="row">
           

            <Card2
              data={{
                title: "Recently Demo",
                type: "Demo",
                data: pendingDemoRequestsData,
                redirectPath:"/superadmin/demo-requests"
              }}
            />
          
            <Card2
              data={{
                title: "Recently Registered",
                type: "Registered",
                data: recentRegistrations,
                redirectPath:"/superadmin/company"
              }}
            />
            <PlanChartCard data={purchaseSummaryData} />
          </div>
          <div className="row">
            <Card2
              data={{
                title: "Recent Transactions",
                type: "Transactions",
                data: recentTransaction,
              }}
            />
          
            <Card2
              data={{
                title: "Recent Plan Expired",
                type: "Plan Expired",
                data: planExpireData,
                redirectPath:"/superadmin/plans"
              
              }}
            />
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

export default Dashboard;
