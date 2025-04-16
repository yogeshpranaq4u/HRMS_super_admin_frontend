
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
import EmployeeAttendance from "../saas/Employee/EmployeeNewPage/EmployeeAttendance";
import EmployeeDashbord from "../saas/Employee/EmployeeNewPage/EmployeeDashbord";
import LeaveWfhRequest from "../saas/Employee/EmployeeNewPage/LeaveWfhRequest";
import { LoginForm } from "../saas/LoginForm/LoginForm";


const allRoutes = [
    // these routes are only for testing 
    {
        element: <Dashboard />,
        path: "/admin/test",
        isPrivate: true,
        isSuperAdmin: true
    },
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
        element: <EmployeeAttendance />,
        path: "/employee/attendance",
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
      default:
        return commonRoutes;
    }
  };

export default allRoutes