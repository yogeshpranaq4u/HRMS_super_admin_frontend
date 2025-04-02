
import Company from "../pages/company/Company";
import Dashboard from "../pages/dashbord/Dashboard";
import DemoRequest from "../pages/DemoRequest";
import Landing from "../pages/Landing";
import Login from "../pages/Login";


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
    
]

export default allRoutes