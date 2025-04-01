
import Company from "../pages/company/Company";
import Dashboard from "../pages/dashbord/Dashboard";
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
        isPrivate:false
    },
    {
        element:<Landing/>,
        path:"/landing",
        isPrivate:false
    },
    
]

export default allRoutes