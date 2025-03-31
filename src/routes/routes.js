
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
        isPrivate:false
    },
    {
        element:<Company/>,
        path:"/company",
        isPrivate:false
    },
    {
        element:<DemoRequest/>,
        path:"/demo-requests",
        isPrivate:false
    },
    
]

export default allRoutes