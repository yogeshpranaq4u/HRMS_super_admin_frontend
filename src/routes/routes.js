
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


const allRoutes = [
    {
        element:<Login/>,
        path:"/superadmin/login",
        isPrivate:false,
        isSuperAdmin:true
    },
    {
        element:<Dashboard/>,
        path:"/admin/test",
        isPrivate:true,
        isSuperAdmin:true
    },
    {
        element:<Dashboard/>,
        path:"/superadmin/",
        isPrivate:true,
        isSuperAdmin:true
    },
    {
        element:<Company/>,
        path:"/superadmin/company",
        isPrivate:true,
        isSuperAdmin:true
    },
    {
        element:<DemoRequest/>,
        path:"/superadmin/demo-requests",
        isPrivate:true,
        isSuperAdmin:true
    },
   
    {
        element:<Tickets/>,
        path:"/superadmin/tickets",
        isPrivate:true,
        isSuperAdmin:true
    },
    {
        element:<PolicyManage/>,
        path:"/superadmin/manage-policy",
        isPrivate:false,
        isSuperAdmin:true
    },
    {
        element:<CompanyPlans/>,
        path:"/superadmin/plans",
        isPrivate:false,
        isSuperAdmin:true
    },
    {
        element:<CompanyPlansHistory/>,
        path:"/superadmin/plans-history",
        isPrivate:false,
        isSuperAdmin:true
    },
    {
        element:<CreateInvoice/>,
        path:"/superadmin/create-invoice",
        isPrivate:false,
        isSuperAdmin:true
    },
    {
        element:<AdminsList/>,
        path:"/superadmin/admin-list",
        isPrivate:false,
        isSuperAdmin:true
    },
    {
        element:<NotFound/>,
        path:"*",
        isPrivate:false,
        // isSuperAdmin:true
    },
    {
        element:<Unauthorized/>,
        path:"/unauthorized",
        isPrivate:false,
        // isSuperAdmin:true
    },
    
]

export default allRoutes