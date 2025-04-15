
import AdminsList from "../pages/AdminsList";
import Company from "../pages/company/Company";
import CompanyPlans from "../pages/CompanyPlans";
import CompanyPlansHistory from "../pages/CompanyPlansHistory";
import CreateInvoice from "../pages/CreateInvoice";
import Dashboard from "../pages/dashbord/Dashboard";
import DemoRequest from "../pages/DemoRequest";
import Landing from "../pages/Landing";
import Login from "../pages/Login";
import NotFound from "../pages/NotFound";
import PolicyManage from "../pages/PolicyManage";
import Tickets from "../pages/Tickets";


const allRoutes = [
    {
        element:<Login/>,
        path:"/superadmin/login",
        isPrivate:false
    },
    {
        element:<Dashboard/>,
        path:"/superadmin/",
        isPrivate:true
    },
    {
        element:<Company/>,
        path:"/superadmin/company",
        isPrivate:true
    },
    {
        element:<DemoRequest/>,
        path:"/superadmin/demo-requests",
        isPrivate:true
    },
   
    {
        element:<Tickets/>,
        path:"/superadmin/tickets",
        isPrivate:true
    },
    {
        element:<PolicyManage/>,
        path:"/superadmin/manage-policy",
        isPrivate:false
    },
    {
        element:<CompanyPlans/>,
        path:"/superadmin/plans",
        isPrivate:false
    },
    {
        element:<CompanyPlansHistory/>,
        path:"/superadmin/plans-history",
        isPrivate:false
    },
    {
        element:<CreateInvoice/>,
        path:"/superadmin/create-invoice",
        isPrivate:false
    },
    {
        element:<AdminsList/>,
        path:"/superadmin/admin-list",
        isPrivate:false
    },
    {
        element:<NotFound/>,
        path:"*",
        isPrivate:false
    },
    
]

export default allRoutes