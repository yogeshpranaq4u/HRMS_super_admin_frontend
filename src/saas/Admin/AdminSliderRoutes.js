import React from "react";
import AdminRootLayout from "./AdminRootLayout";
import { Route, Routes } from "react-router-dom";

import AdminDashbord from "./AdminPage/AdminDashbord";
import AdminLeaves from "./AdminPage/AdminLeaves";
import Attendance from "./AdminPage/Attendance";
import AdminHoliday from "./AdminPage/AdminHoliday";
import AdminProfile from "./AdminPage/AdminProfile";
import AdminDepartment from "./AdminPage/AdminDepartment";

import AdminPasswordUpdate from "./AdminPage/AdminPasswordUpdate";
import AdminLogout from "./AdminPage/AdminLogout";
import Salary from "./AdminPage/Salary";
import AssetManagnment from "./AdminPage/AssetManagnment";
import AdminReminder from "./AdminPage/AdminReminder";
import AdminBilling from "./AdminPage/AdminBilling";
import Customer from "./AdminPage/Billing/Customer";
import Invoice from "./AdminPage/Billing/Invoice";
import PaymentReceived from "./AdminPage/Billing/PaymentReceived";
import AddInvoice from "./AdminPage/Billing/AddInvoice";
import OrganisationTree from "./AdminPage/OrganisationTree";
import DashBoard from "./AdminPage/DashBoard";
import AdminLeaveRequestHistory from "./AdminPage/AdminLeaveRequestHistory";
import NewDashBoard from "./AdminPage/AdminNewPage/NewDashBoard";
import NewAttendancePage from "./AdminPage/AdminNewPage/NewAttendancePage";
import NewSalaryPage from "./AdminPage/AdminNewPage/NewSalaryPage";
import AdminNewProfile from "./AdminPage/AdminNewPage/AdminNewProfile";
import NewLeaveHistory from "./AdminPage/AdminNewPage/NewLeaveHistory";
import NewLeaveRequestPage from "./AdminPage/AdminNewPage/NewLeaveRequestPage";
import EmployeeListPage from "./AdminPage/AdminNewPage/EmployeeListPage";
import AssetManagment from "./AdminPage/AdminNewPage/AssetManagment";

const AdminSliderRoutes = () => {
  return (
    <AdminRootLayout>
      <Routes>
        <Route path="/dashboard" element={<NewDashBoard />} />

        <Route path="/admindashboard" element={<EmployeeListPage />} />
        <Route path="/*" element={<DashBoard />} />
        <Route path="/" element={<DashBoard />} />

        <Route path="/adminleaves" element={<NewLeaveHistory />} />

        <Route
          path="/adminLeaverrequestHistory"
          element={<NewLeaveRequestPage />}
        />
        <Route path="/adminattendance" element={<NewAttendancePage />} />
        <Route path="/adminholiday" element={<AdminHoliday />} />
        <Route path="/adminprofile" element={<AdminNewProfile />} />
        <Route path="/organisationTree" element={<OrganisationTree />} />
        <Route path="/admindepartment" element={<AdminDepartment />} />
        <Route path="/logoutscreen" element={<AdminLogout />} />
        <Route path="/adminpasswordupdate" element={<AdminPasswordUpdate />} />
        <Route path="/Salary" element={<NewSalaryPage />} />

        <Route path="/reminder" element={<AdminReminder />} />
        <Route path="/customer" element={<Customer />} />
        <Route path="/invoice" element={<Invoice />} />
        <Route path="/paymentreceived" element={<PaymentReceived />} />
        <Route path="/AddInvoice" element={<AddInvoice />} />
        <Route
          path="/adminLeaverrequestHistory"
          element={<AdminLeaveRequestHistory />}
        />

        <Route path="/AssetManagement" element={<AssetManagment />} />
        {/* <Route path="/AssetManagement" element={<AssetManagnment />} /> */}
        {/* <Route path="/admindashboard" element={<AdminDashbord />} /> */}
        {/* <Route path="/adminleaves" element={<AdminLeaves />} /> */}
        {/* <Route path="/adminattendance" element={<Attendance />} /> */}
        {/* <Route path="/adminprofile" element={<AdminProfile />} /> */}
        {/* <Route path="/Salary" element={<Salary />} /> */}
        {/* <Route path="/adminbilling" element={<AdminBilling />} /> */}
        {/* <Route path="/dashboard" element={<DashBoard />} /> */}
      </Routes>
    </AdminRootLayout>
  );
};

export default AdminSliderRoutes;
