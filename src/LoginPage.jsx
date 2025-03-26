import React, { useState, forwardRef } from "react";
import {
  Box,
  Grid,
  Button,
  TextField,
  Typography,
  Container,
  Avatar,
  Checkbox,
  FormControlLabel,
  Snackbar,
  Stack,
  Alert as MuiAlert,
  Slide,
} from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { useNavigate } from "react-router-dom";
import { IMAGE } from "./Config/Image";
import VideoFile from "../src/assets/Splash.mp4";

const Alert = forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
});

const LoginPage = () => {
  const [open, setOpen] = useState(false);
  const [remember, setRemember] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (event) => {
    setOpen(true);
    event.preventDefault();
  };

  const handleClose = (_, reason) => {
    if (reason === "clickaway") return;
    setOpen(false);
  };

  return (
    <>
      {/* Snackbar for Error Message */}
      <Snackbar
        open={open}
        autoHideDuration={3000}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert onClose={handleClose} severity="error" sx={{ width: "100%" }}>
          Failed! Enter correct username and password.
        </Alert>
      </Snackbar>

      {/* Background Image Container */}
      <Box
        sx={{
          backgroundImage: `url(${IMAGE.BACKGROUND})`,
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
              {/* <Box
                sx={{
                  backgroundImage: `url(${IMAGE.BACKGROUND2})`,
                  backgroundSize: "contain",
                  backgroundPosition: "center",
                  height: { xs: "200px", md: "100%" },
                  width: "100%",
                }}
              /> */}
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
                  // onEnded={() => {
                  //   console.log("Video ended, navigating to login...");
                  //   navigate("/login");
                  // }}
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
                      noValidate
                      onSubmit={handleSubmit}
                      sx={{ mt: 2 }}
                    >
                      <TextField
                        required
                        fullWidth
                        id="email"
                        label="Username"
                        name="email"
                        autoComplete="email"
                        sx={{ mb: 2 }}
                      />
                      <TextField
                        required
                        fullWidth
                        name="password"
                        label="Password"
                        type="password"
                        id="password"
                        autoComplete="new-password"
                        sx={{ mb: 2 }}
                      />

                      <Stack
                        direction="row"
                        justifyContent="space-between"
                        alignItems="center"
                      >
                        <Typography
                          variant="body2"
                          sx={{ cursor: "pointer", color: "lightblue" }}
                          onClick={() => navigate("/reset-password")}
                        >
                          Forgot password?
                        </Typography>
                      </Stack>
                      {/* 
                      <Button
                        type="submit"
                        variant="contained"
                        
                        sx={{
                          mt: 5,
                          borderRadius: 28,
                          justifyContent:'center',
                          alignSelf:'center',
                          color: "#ffffff",
                          backgroundColor: "#FF9A01",
                          "&:hover": { backgroundColor: "#e68a00" },
                        }}
                      >
                       Login
                      </Button> */}

                      <Box sx={{ display: "flex", justifyContent: "center" }}>
                        <Button
                          type="submit"
                          variant="contained"
                          sx={{
                            mt: 2,
                            borderRadius: 28,
                            color: "#ffffff",
                            fontWeight:'600',
fontSize:18,
                            backgroundColor: "#FF9A01",
                            "&:hover": { backgroundColor: "#e68a00" },
                          }}
                        >
                          Login
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
    </>
  );
};

export default LoginPage;
