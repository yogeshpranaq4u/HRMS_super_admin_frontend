
import AdminsList from "../pages/AdminsList";
import Company from "../pages/company/Company";
import CompanyPlans from "../pages/CompanyPlans";
import CompanyPlansHistory from "../pages/CompanyPlansHistory";
import CreateInvoice from "../pages/CreateInvoice";
import Dashboard from "../pages/dashbord/Dashboard";
import DemoRequest from "../pages/DemoRequest";
import Login from "../pages/Login";
import NotFound from "../pages/NotFound";
import PolicyManage from "../pages/PolicyManage";
import Tickets from "../pages/Tickets";
import Unauthorized from "../pages/Unauthorized";
import AdminDepartment from "../saas/Admin/AdminPage/AdminDepartment";
import AdminHoliday from "../saas/Admin/AdminPage/AdminHoliday";
import AdminNewProfile from "../saas/Admin/AdminPage/AdminNewPage/AdminNewProfile";
import AssetManagment from "../saas/Admin/AdminPage/AdminNewPage/AssetManagment";
import EmployeeListPage from "../saas/Admin/AdminPage/AdminNewPage/EmployeeListPage";
import NewAttendancePage from "../saas/Admin/AdminPage/AdminNewPage/NewAttendancePage";
import NewDashBoard from "../saas/Admin/AdminPage/AdminNewPage/NewDashBoard";
import NewLeaveHistory from "../saas/Admin/AdminPage/AdminNewPage/NewLeaveHistory";
import NewLeaveRequestPage from "../saas/Admin/AdminPage/AdminNewPage/NewLeaveRequestPage";
import NewSalaryPage from "../saas/Admin/AdminPage/AdminNewPage/NewSalaryPage";
import AdminReminder from "../saas/Admin/AdminPage/AdminReminder";
import Customer from "../saas/Admin/AdminPage/Billing/Customer";
// import Invoice from "../saas/Admin/AdminPage/Billing/Invoice";
import EmployeeAttendance from "../saas/Employee/EmployeeNewPage/EmployeeAttendance";
import EmployeeDashbord from "../saas/Employee/EmployeeNewPage/EmployeeDashbord";
import EmployeeSalaryNew from "../saas/Employee/EmployeeNewPage/EmployeeSalaryNew";
import LeaveWfhRequest from "../saas/Employee/EmployeeNewPage/LeaveWfhRequest";
import EmployeeAssetAssign from "../saas/Employee/Page/EmployeeAssetAssign";
import EmployeePasswordUpdate from "../saas/Employee/Page/EmployeePasswordUpdate";
import Holiday from "../saas/Employee/Page/Holiday";
import LogoutEmployee from "../saas/Employee/Page/LogoutEmployee";
import { LoginForm } from "../saas/LoginForm/LoginForm";


const allRoutes = [
    // these routes are only for testing 
    {
        element: <Dashboard />,
        path: "/superadmin/",
        isPrivate: true,
        isSuperAdmin: true
    },
    {
        element: <Company />,
        path: "/superadmin/company",
        isPrivate: true,
        isSuperAdmin: true
    },
    {
        element: <DemoRequest />,
        path: "/superadmin/demo-requests",
        isPrivate: true,
        isSuperAdmin: true
    },

    {
        element: <Tickets />,
        path: "/superadmin/tickets",
        isPrivate: true,
        isSuperAdmin: true
    },
   
    {
        element: <PolicyManage />,
        path: "/superadmin/manage-policy",
        isPrivate: false,
        isSuperAdmin: true
    },
    {
        element: <CompanyPlans />,
        path: "/superadmin/plans",
        isPrivate: false,
        isSuperAdmin: true
    },
    {
        element: <CompanyPlansHistory />,
        path: "/superadmin/plans-history",
        isPrivate: false,
        isSuperAdmin: true
    },
    {
        element: <CreateInvoice />,
        path: "/superadmin/create-invoice",
        isPrivate: false,
        isSuperAdmin: true
    },
    {
        element: <AdminsList />,
        path: "/superadmin/admin-list",
        isPrivate: false,
        isSuperAdmin: true
    },
   

]

const commonRoutes = [
    {
        element: <LoginForm />,
        path: "/login",
        isPrivate: false,
        isSuperAdmin: true
    },
    {
        element: <LoginForm />,
        path: "/",
        isPrivate: false,
        isSuperAdmin: true
    },
    {
        element: <Login />,
        path: "/superadmin/login",
        isPrivate: false,
        isSuperAdmin: true
    },
    {
        element: <NotFound />,
        path: "*",
        isPrivate: false,
        // isSuperAdmin:true
    },
    {
        element: <Unauthorized />,
        path: "/unauthorized",
        isPrivate: false,
        // isSuperAdmin:true
    },
]
const employeeRoutes = [
    // employee routes
    {
        element: <EmployeeDashbord />,
        path: "/employee/",
        isPrivate: true,
        isSuperAdmin: true
    },
    {
        element: <LeaveWfhRequest />,
        path: "/employee/leaves",
        isPrivate: true,
        isSuperAdmin: true
    },
    {
        element: <EmployeeSalaryNew />,
        path: "/employee/salary",
        isPrivate: true,
        isSuperAdmin: true
    },
    {
        element: <Holiday />,
        path: "/employee/admin-holidays",
        isPrivate: true,
        isSuperAdmin: true
    },
    {
        element: <AdminHoliday />,
        path: "/employee/holidays",
        isPrivate: true,
        isSuperAdmin: true
    },
    {
        element: <EmployeeAssetAssign />,
        path: "/employee/assets",
        isPrivate: true,
        isSuperAdmin: true
    },
    {
        element: <EmployeePasswordUpdate />,
        path: "/employee/update-password",
        isPrivate: true,
        isSuperAdmin: true
    },
    {
        element: <NewSalaryPage />,
        path: "/employee/admin-salary",
        isPrivate: true,
        isSuperAdmin: true
    },
    {
        element: <EmployeeAttendance />,
        path: "/employee/attendance",
        isPrivate: true,
        isSuperAdmin: true
    },
    {
        element: <LogoutEmployee />,
        path: "/employee/logout",
        isPrivate: true,
        isSuperAdmin: true
    },
]
const adminRoutes = [
    // employee routes
    {
        element: <NewDashBoard />,
        path: "/admin/",
        isPrivate: true,
        isSuperAdmin: true
    },
    {
        element: <EmployeeListPage />,
        path: "/admin/employees",
        isPrivate: true,
        isSuperAdmin: true
    },
    {
        element: <Customer />,
        path: "/admin/billing/customers",
        isPrivate: true,
        isSuperAdmin: true
    },
    // {
    //     element: <Invoice />,
    //     path: "/admin/billing/invoice",
    //     isPrivate: true,
    //     isSuperAdmin: true
    // },
    {
        element: <NewLeaveHistory />,
        path: "/admin/leaves/requests",
        isPrivate: true,
        isSuperAdmin: true
    },
    {
        element: <NewLeaveRequestPage />,
        path: "/admin/leaves/history",
        isPrivate: true,
        isSuperAdmin: true
    },
    {
        element: <NewAttendancePage />,
        path: "/admin/attendance",
        isPrivate: true,
        isSuperAdmin: true
    },
    {
        element: <AdminReminder />,
        path: "/admin/reminder",
        isPrivate: true,
        isSuperAdmin: true
    },
    {
        element: <AdminHoliday />,
        path: "/admin/holidays",
        isPrivate: true,
        isSuperAdmin: true
    },
    {
        element: <AssetManagment />,
        path: "/admin/assets",
        isPrivate: true,
        isSuperAdmin: true
    },
    {
        element: <NewSalaryPage />,
        path: "/admin/salary",
        isPrivate: true,
        isSuperAdmin: true
    },
    
    {
        element: <AdminDepartment />,
        path: "/admin/manage",
        isPrivate: true,
        isSuperAdmin: true
    },
    {
        element: <AdminNewProfile />,
        path: "/admin/profile",
        isPrivate: true,
        isSuperAdmin: true
    },
    
    {
        element: <EmployeePasswordUpdate />,
        path: "/admin/update-password",
        isPrivate: true,
        isSuperAdmin: true
    },
]

export const getRoutesByRole = (role) => {
    switch (role) {
      case 'employee':
        return [...commonRoutes, ...employeeRoutes];
      case 'superadmin':
        return [...commonRoutes, ...allRoutes];
      case 'admin':
        return [...commonRoutes, ...adminRoutes];
      default:
        return commonRoutes;
    }
  };

export default allRoutes