import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { AirlineSeatIndividualSuiteSharp } from '@mui/icons-material';
import ReCAPTCHA from "react-google-recaptcha";
import { useState } from 'react';
import axios from 'axios';
import { Outlet, Link } from "react-router-dom";
import Snackbar from '@mui/material/Snackbar';
import MuiAlert, { AlertProps } from '@mui/material/Alert';
import { getAccordionDetailsUtilityClass } from '@mui/material';

const theme = createTheme();

const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
  });

  

export default function SignInSide() {

    const [value, setValue] = useState("");
    const [wrongPasswordCount, setWrongPasswordCount] = useState(0);
    const [usernamePermission, setUserNamePermission] = useState(false);
    const [passwordPermission, setPasswordPermission] = useState(false);
    const [openSnackBar, setSnackBar] = useState(false);
    const [vertical, setvertical] = useState('bottom');
    const [horizontal, sethorizontal] = useState('right');

    const handleSubmit = (event) => {
        console.log("GİRDDİİ");
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        if (value == "" || value == null) {
            console.log("Hata");
        }
        else {

            const loginPayload = {
                email: data.get('email'),
                password: data.get('password')
            }

            axios.post("https://localhost:7233/api/Auth/login", loginPayload)
                .then(response => {
                   
                    if (response.data == false) {
                        wrongPassword();
                        
                    }
                    else if(response.data=="Hatalı karakter"){
                        setSnackBar(true);
                        wrongPassword();
                    }
                    else{
                        let data = response.data.split('.')[1]
                        let decodedJwtJsonData = window.atob(data)
                        let decodedJwtData = JSON.parse(decodedJwtJsonData)

                        localStorage.setItem("token", response.data);
                        localStorage.setItem("role", decodedJwtData.Role);

                        control(decodedJwtData.Role)
                    }
                })
        }

    };






    
    
    function getData(){
        let token= localStorage.getItem("token");
        let api ="https://localhost:7233/api/Device/getAll";
        axios.get(api, { headers: {"Authorization" : `Bearer ${token}`} })
        .then(res => {
            console.log(res.data);
        })
    }

    function onChange(value) {
        setValue(value);
        console.log("Captcha value:", value);
    }

    function wrongPassword() {
        setWrongPasswordCount(wrongPasswordCount + 1);

        if (wrongPasswordCount == 3) {
            setUserNamePermission(true);
            setPasswordPermission(true);
            setWrongPasswordCount(0);
            setTimeout(enableInputs, 10000);
        }
        console.info("wrongPassword", wrongPasswordCount);
    }
    function enableInputs() {
        setUserNamePermission(false);
        setPasswordPermission(false);

    }
    function control(Role) {
        if (Role == "Admin") {
            window.location.href = '/admin';
        } else {
            window.location.href = '/home';
        }
    }
    function handleCloseSnackBar() {
        setSnackBar(false);
    }

    return (
        <ThemeProvider theme={theme}>
            <Grid container component="main" sx={{ height: '100vh' }}>
                <CssBaseline />
                <Grid
                    item
                    xs={false}
                    sm={4}
                    md={7}
                    sx={{
                        backgroundImage: 'url(https://source.unsplash.com/random)',
                        backgroundRepeat: 'no-repeat',
                        backgroundColor: (t) =>
                            t.palette.mode === 'light' ? t.palette.grey[50] : t.palette.grey[900],
                        backgroundSize: 'cover',
                        backgroundPosition: 'center',
                    }}
                />
                <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
                    <Box
                        sx={{
                            my: 8,
                            mx: 4,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                        }}
                    >
                        <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                            <LockOutlinedIcon />
                        </Avatar>
                        <Typography component="h1" variant="h5">
                            Sign in
                        </Typography>
                        <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 1 }}>
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                id="email"
                                label="Email Address"
                                name="email"
                                autoComplete="email"
                                autoFocus
                                disabled={usernamePermission}
                            />
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                name="password"
                                label="Password"
                                type="password"
                                id="password"
                                autoComplete="current-password"
                                disabled={passwordPermission}
                            />

                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                sx={{ mt: 3, mb: 2 }}
                            >
                                Sign In
                            </Button>
                            <ReCAPTCHA
                                sitekey="6Lf-EbUjAAAAABzNQNaXWupa1qvmP9i98ZeQjnPN"
                                onChange={onChange}
                            />
                            <Snackbar open={openSnackBar} autoHideDuration={3000} anchorOrigin={{ vertical, horizontal }} onClose={handleCloseSnackBar}>
                                <Alert onClose={handleCloseSnackBar} severity="error" sx={{ width: '100%' }}>
                                    Hatalı Karakter
                                </Alert>
                            </Snackbar>
                        </Box>
                    </Box>

                </Grid>
            </Grid>
        </ThemeProvider>
    );
}