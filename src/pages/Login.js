import React, { useState, forwardRef, useEffect } from "react";
import {
    Box,
    Grid,
    Button,
    TextField,
    Typography,
    Container,
    Snackbar,
    Stack,

} from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import VideoFile from "../assets/images/Splash.mp4";
import OtpModal from "../modals/OtpModal";
import CustomAlert from "../components/Alert";
import { BaseUrl } from "../config/apiEndPoints";
import axios from "axios";
import { toast } from "react-toastify";


const darkTheme = createTheme({
    palette: {
        mode: "dark",
    },
});

const Login = () => {
    const [open, setOpen] = useState({ isOpen: false, message: "" });
    const [loading, setLoading] = useState(false);
    const details = JSON.parse(sessionStorage.getItem("userDetails")) || {}
    const [otpModal, setotpModal] = useState({data: "" });
    const [formData, setformData] = useState({
        email: "",
        password: "",
        remember: true
    });
    const navigate = useNavigate();
    useEffect(()=>{
        if(details.token){
            navigate(-1) 
        }
    },[])
    const handleSubmit = async (event) => {
        event.preventDefault();
        if (formData.email == "" || formData.password == "") {
            setOpen(((pre) => ({
                ...pre,
                isOpen: true,
                message: "Fill all required fields",
                errortype: "warning"
            })));
        } else {
            setLoading(true)
            let config = {
                method: 'post',
                url: `${BaseUrl}/superadmin/login`,
                headers: {
                    'Content-Type': 'application/json'
                },
                data: formData
            };

            await axios.request(config)
                .then((response) => {
                    if(response.data?.status){
                        setOpen(((pre) => ({
                            ...pre,
                            isOpen: true,
                            message: response.data?.message,
                            errortype: "success"
                        })));
                        setotpModal({data:formData})
                    }
                    setLoading(false)
                })
                .catch((error) => {
                    setLoading(false)
                    if (error) {
                        setOpen(((pre) => ({
                            ...pre,
                            isOpen: true,
                            message: error.response.data?.message || error.message,
                            errortype: "error"
                        })));
                        // toast.error(error.response.data?.message || error.message)
                    }
                    // console.log(error.response.data?.message);
                });
        }
    };
    const onChange = (e) => {
        const { name, value } = e.target
        setformData((pre) => ({
            ...pre,
            [name]: value
        }))
    };

    const handleClose = (_, reason) => {
        if (reason === "clickaway") return;
        setOpen(((pre) => ({
            ...pre,
            isOpen: false
        })));
    };

    return (
        <React.Fragment>
            {/* Snackbar for Error Message */}
            <Snackbar
                open={open.isOpen}
                autoHideDuration={3000}
                anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
            >
                <CustomAlert onClose={handleClose} severity={open.errortype || "error"} sx={{ width: "100%" }}>
                    {open.message || "Failed! Enter correct username and password."}
                </CustomAlert>
            </Snackbar>
            {/* Background Image Container */}
            <Box
                sx={{
                    backgroundImage: `url("assets/images/backimg.jpg")`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    height: "100vh",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >
                {/* Main Container */}
                <Box
                    sx={{
                        width: { xs: "95%", sm: "85%", md: "75%" },
                        height: "auto",
                        bgcolor: "background.paper",
                        boxShadow: 24,
                        borderRadius: 2,
                        overflow: "hidden",
                    }}
                >
                    <Grid container>
                        {/* Left Side - Background Image */}
                        <Grid item xs={12} md={6}>
                            <Box
                                sx={{
                                    height: { xs: "200px", md: "100%" },
                                    width: "100%",
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    overflow: "hidden",
                                }}
                            >
                                <video
                                    src={VideoFile}
                                    autoPlay
                                    loop
                                    muted
                                    playsInline
                                    style={{
                                        width: "100%",
                                        height: "100%",
                                        objectFit: "cover",
                                    }}

                                />
                            </Box>
                        </Grid>

                        {/* Right Side - Login Form */}
                        <Grid item xs={12} md={6}>
                            <Box
                                sx={{
                                    height: "100%",
                                    bgcolor: "#0789ff",
                                    p: { xs: 2, sm: 4 },
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "center",
                                }}
                            >
                                <ThemeProvider theme={darkTheme}>
                                    <Container maxWidth="sm">
                                        <Box sx={{ textAlign: "center" }}>
                                            <Typography
                                                component="h1"
                                                variant="h4"
                                                color="white"
                                                fontWeight={"600"}
                                            >
                                                LOGIN
                                            </Typography>
                                        </Box>

                                        <Box
                                            component="form"
                                            // noValidate
                                            onSubmit={(e)=>{
                                                if(!loading){
                                                    handleSubmit(e)
                                                }
                                            }}
                                            sx={{ mt: 2 }}
                                        >
                                            <TextField
                                                required
                                                fullWidth
                                                id="email"
                                                label="Username"
                                                name="email"
                                                type="email"
                                                onChange={onChange}
                                                // autoComplete="email"
                                                sx={{ mb: 2, color: "#fff" }}
                                            />
                                            <TextField
                                                required
                                                fullWidth
                                                name="password"
                                                label="Password"
                                                type="password"
                                                id="password"
                                                onChange={onChange}
                                                // autoComplete="new-password"
                                                sx={{
                                                    mb: 2,
                                                }}
                                            />


                                            <Box sx={{ display: "flex", justifyContent: "center" }}>
                                                <Button
                                                    type="submit"
                                                    variant="contained"
                                                    sx={{
                                                        mt: 2,
                                                        borderRadius: 28,
                                                        color: "#ffffff",
                                                        fontWeight: '600',
                                                        fontSize: 18,
                                                        backgroundColor: "#FF9A01",
                                                        "&:hover": { backgroundColor: "#e68a00" },
                                                    }}
                                                >
                                                    {
                                                        loading ? "Loading...":"Login"
                                                    }
                                                </Button>
                                            </Box>
                                        </Box>
                                    </Container>
                                </ThemeProvider>
                            </Box>
                        </Grid>
                    </Grid>
                </Box>
            </Box>
            {
                otpModal.data &&
                <OtpModal data={{data:otpModal.data,onClose:() => { setotpModal(false) }}}  />
            }

        </React.Fragment>
    );
};

export default Login;
