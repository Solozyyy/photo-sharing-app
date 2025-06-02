
import React from "react";
import {
    Button,
    ButtonGroup,
    TextField,
    Typography,
} from "@mui/material";

import { useState } from "react";
import { loginService, signupService } from "../../services";
import { useNavigate } from "react-router-dom";

function AuthPage() {

    const navigate = useNavigate();
    const [mode, setMode] = useState("login");
    const [loginForm, setLoginForm] = useState({
        login_name: "",
        password: "",
    });

    const [signupForm, setSignupForm] = useState({
        login_name: "",
        password: "",
        first_name: "",
        last_name: "",
        location: "",
        description: "",
        occupation: "",
    });

    const handleLoginChange = (field) => (e) => {
        setLoginForm({ ...loginForm, [field]: e.target.value });
    };

    const handleLoginSubmit = async () => {

        try {
            const data = await loginService(loginForm);
            console.log("data", data);

            if (data.success) {
                sessionStorage.setItem(
                    "accessToken",
                    JSON.stringify(data.data.accessToken),
                );
                console.log("token", data.data.accessToken);
                navigate(`/users/${data.data.user._id}`);
            }

        } catch (error) {
            console.log(error);
            alert("login name or password is wrong");
        }

    };

    // console.log(loginForm, "loginForm");

    const handleSignupChange = (field) => (e) => {
        setSignupForm({ ...signupForm, [field]: e.target.value });
    }

    const handleSignupSubmit = async () => {
        const { password, first_name, last_name } = signupForm;
        const name_regex = /^[A-Za-z\s]+$/;

        if (password.length < 6) {
            alert("Password must has at least 6 characters");
            return;
        }

        if (!name_regex.test(first_name) || !name_regex.test(last_name)) {
            alert("Name must has all character");
            return;
        }
        try {
            const data = await signupService(signupForm);
            if (data.success) {

                alert("Signup successfully, please login to continue");
                console.log(data, "data");
            }
        } catch (error) {
            console.log(error);
            alert("login name is already existed");
        }
    }

    return (
        <div style={{
            height: '100vh',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
        }}>
            <div style={{
                width: 300, display: 'flex', flexDirection: 'column', alignItems: 'center'
            }}>
                <ButtonGroup size="large" aria-label="Large button group" align="center">
                    <Button onClick={(e) =>
                        setMode("login")
                    }>Login</Button>
                    <Button onClick={(e) =>
                        setMode("signup")
                    }>Sign Up</Button>
                </ButtonGroup>
                <Typography variant="h6" align="center" sx={{ mt: 2 }}>
                    {mode === "login" ?
                        (<>
                            <h3>Login Form</h3>
                            <TextField
                                id="filled-basic"
                                label="Login name"
                                variant="filled"
                                sx={{ width: '300px', mb: 2 }}
                                value={loginForm.login_name}
                                onChange={handleLoginChange("login_name")}
                            />
                            <TextField
                                id="filled-basic"
                                label="Password"
                                variant="filled"
                                type="password"
                                sx={{ width: '300px', mb: 2 }}
                                value={loginForm.password}
                                onChange={handleLoginChange("password")}
                            />
                            <Button variant="contained" onClick={handleLoginSubmit}>Submit</Button>
                        </>)
                        :
                        (<>
                            <h3>Sign Up Form</h3>
                            <TextField
                                id="filled-basic"
                                label="Login name"
                                variant="filled"
                                sx={{ width: '300px', mb: 2 }}
                                value={signupForm.login_name}
                                onChange={handleSignupChange("login_name")}
                            />
                            <TextField
                                id="filled-basic"
                                label="Password"
                                variant="filled"
                                sx={{ width: '300px', mb: 2 }}
                                type="password"
                                value={signupForm.password}
                                onChange={handleSignupChange("password")}
                            />

                            <TextField
                                id="filled-basic"
                                label="First Name"
                                variant="filled"
                                sx={{ width: '300px', mb: 2 }}
                                value={signupForm.first_name}
                                onChange={handleSignupChange("first_name")}
                            />
                            <TextField
                                id="filled-basic"
                                label="Last Name"
                                variant="filled"
                                sx={{ width: '300px', mb: 2 }}
                                value={signupForm.last_name}
                                onChange={handleSignupChange("last_name")}
                            />
                            <TextField
                                id="filled-basic"
                                label="Location"
                                variant="filled"
                                sx={{ width: '300px', mb: 2 }}
                                value={signupForm.location}
                                onChange={handleSignupChange("location")}
                            />
                            <TextField
                                id="filled-basic"
                                label="Description"
                                variant="filled"
                                sx={{ width: '300px', mb: 2 }}
                                value={signupForm.description}
                                onChange={handleSignupChange("description")}
                            />
                            <TextField
                                id="filled-basic"
                                label="Occupation"
                                variant="filled"
                                sx={{ width: '300px', mb: 2 }}
                                value={signupForm.occupation}
                                onChange={handleSignupChange("occupation")}
                            />
                            <Button variant="contained" onClick={handleSignupSubmit}>Submit</Button>
                        </>)
                    }
                </Typography>
            </div>
        </div>);
}

export default AuthPage;