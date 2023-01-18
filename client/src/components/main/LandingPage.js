import React, { useEffect } from "react";
import axios from "../../api/axios";
import { connect } from "react-redux";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Stack from "@mui/material/Stack";
import { Navigate } from "react-router-dom";
import { StyledButton } from "../buttons/styled/StyledButton";
import LoginButton from "../buttons/LoginButton";
import LogoutButton from "../buttons/LogoutButton";
import SignupButton from "../buttons/SignupButton";
import { TokenEventCreator } from "../../actions/TokenEvent";
import "./css/LandingPage.css";

const navBarBtnTheme = createTheme({
    palette: {
        primary: {
            main: "#4d3c32",
            contrastText: "#fff",
        },
        secondary: {
            main: "#8c6e5d",
            contrastText: "#c4957a",
        },
    },
});

const shopBtnTheme = createTheme({
    palette: {
        primary: {
            main: "#4d1846",
            contrastText: "#e8e5a9",
        },
        secondary: {
            main: "#75246b",
            contrastText: "#cc85c4",
        },
    },
});

export const NavBar = (props) => {
    const { theme, buttons } = props;
    return (
        <div key={"LandingPage"} className="main-nav">
            <ThemeProvider theme={theme}>
                <Stack direction="row" spacing={2} className="btn-stack">
                    {buttons.map((obj, i) => {
                        return (
                            <div className={obj.name} key={i}>
                                {obj}
                            </div>
                        );
                    })}
                </Stack>
            </ThemeProvider>
        </div>
    );
};

const LandingPage = (props) => {
    const validateToken = async () => {
        try {
            await axios
                .get("/refreshToken", {
                    headers: { "Content-Type": "application/json" },
                    withCredentials: true,
                })
                .then((res) => {
                    console.log(res.data);
                    console.log(res.data.accessToken);
                });
        } catch (error) {
            console.error(error.response.data);
        }
    };

    useEffect(() => {
        console.log("initializing LandingPage..");
        const initValidation = async () => {
            await validateToken();
        };
        initValidation();
    }, []);

    return (
        <div className="home-root">
            <NavBar
                theme={navBarBtnTheme}
                buttons={
                    props.isLoggedIn
                        ? [<LogoutButton name="logout" />]
                        : [
                              <LoginButton name="login" />,
                              <SignupButton name="signup" />,
                          ]
                }
            />
            <div className="inner-root">
                <h1 className="shoester-h1">
                    Welcome to {<br />}
                    {props.isLoggedIn ? (
                        <div>
                            <span className="shoester-span">Shoester, </span>
                            <span className="shoester-span">
                                {props.firstName}!
                            </span>
                        </div>
                    ) : (
                        <span className="shoester-span">Shoester!</span>
                    )}
                </h1>
                <ThemeProvider theme={shopBtnTheme}>
                    <StyledButton
                        style={{ fontSize: "64px" }}
                        variant="contained"
                        color="primary"
                        className="shopBtn"
                        onClick={() => {
                            <Navigate to="/shop" replace={true} />;
                        }}>
                        Shop
                    </StyledButton>
                </ThemeProvider>
            </div>
        </div>
    );
};

const mapDispatchToProps = {
    stashToken: TokenEventCreator.newToken,
};

const mapStateToProps = (state, props) => ({
    isLoggedIn: state && state.login && state.login.loggedIn,
    firstName: state && state.login && state.login.fname,
    accessToken: state && state.login && state.login.accessToken,
});

export default connect(mapStateToProps, null)(LandingPage);
