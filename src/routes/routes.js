import Dashboard from "../pages/Dashboard";
import Login from "../pages/Login";
import ResetPassword from "../pages/ResetPassword";


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
        element:<ResetPassword/>,
        path:"/reset-password",
        isPrivate:false
    },
]

export default allRoutes