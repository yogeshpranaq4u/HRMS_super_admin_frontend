
import Company from "../pages/company/Company";
import Dashboard from "../pages/dashbord/Dashboard";
import DemoRequest from "../pages/DemoRequest";
import Landing from "../pages/Landing";
import Login from "../pages/Login";
import PolicyManage from "../pages/PolicyManage";
import Tickets from "../pages/Tickets";


const allRoutes = [
    {
        element:<Login/>,
        path:"/login",
        isPrivate:false
    },
    {
        element:<Dashboard/>,
        path:"/",
        isPrivate:true
    },
    {
        element:<Company/>,
        path:"/company",
        isPrivate:true
    },
    {
        element:<DemoRequest/>,
        path:"/demo-requests",
        isPrivate:true
    },
    {
        element:<Tickets/>,
        path:"/tickets",
        isPrivate:true
    },
    {
        element:<PolicyManage/>,
        path:"/manage-policy",
        isPrivate:false
    },
    
]

export default allRoutes