import { forwardRef } from "react";
import {Alert as MuiAlert,
} from "@mui/material";
const CustomAlert = forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});


export default CustomAlert