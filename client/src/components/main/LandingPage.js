import React from "react";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Stack from "@mui/material/Stack";
import { useNavigate } from "react-router-dom";
import { StyledButton } from "../buttons/StyledButton";
import SignupButton from "../buttons/SignupButton";
import LoginButton from "../buttons/LoginButton";
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
        <div className="main-nav">
            <ThemeProvider theme={theme}>
                <Stack direction="row" spacing={2} className="btn-stack">
                    {buttons}
                </Stack>
            </ThemeProvider>
        </div>
    );
};

export default function LandingPage() {
    let navigate = useNavigate();
    return (
        <div className="home-root">
            <NavBar
                theme={navBarBtnTheme}
                buttons={[<LoginButton />, <SignupButton />]}
            />
            <div className="inner-root">
                <h1 className="shoester-h1">
                    Welcome to {<br />}
                    <span className="shoester-span">Shoester!</span>
                </h1>
                <ThemeProvider theme={shopBtnTheme}>
                    <StyledButton
                        style={{ fontSize: "64px" }}
                        variant="contained"
                        color="primary"
                        className="shopBtn"
                        onClick={() => {
                            navigate("/shop");
                        }}>
                        Shop
                    </StyledButton>
                </ThemeProvider>
            </div>
        </div>
    );
}