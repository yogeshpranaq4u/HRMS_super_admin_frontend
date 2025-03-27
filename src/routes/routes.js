import Dashboard from "../pages/Dashboard";
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
        element:<Landing/>,
        path:"/landing",
        isPrivate:false
    },
    
]

export default allRoutes