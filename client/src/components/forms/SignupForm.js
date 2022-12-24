import React from "react";
import axios from "axios";
import { connect } from "react-redux";
import { StyledField } from "../misc/StyledField";
import {
    FormControlLabel,
    Checkbox,
    Typography,
    createStyles,
} from "@mui/material";
import PasswordChecklist from "react-password-checklist";
import { setCacheCookie, getCacheCookie } from "../../utils/CacheCookie";
import BackButton from "../buttons/BackButton";
import { LoginEventCreator } from "../../actions/LoginEvent";
import { withRouter } from "../../utils/withRouter";
import "./css/SignupForm.css";

const emailRegex = /^\S+@\S+\.\S+$/;
const pwRegex = /^[a-zA-Z0-9\-_~!@#$%^&*]{2,32}$/;
const pwIsValid = (pw, pwConfirm) => {
    return pwRegex.test(pw) && pw === pwConfirm;
};

const pwErrorMsgStyle = (shouldDisplayError) =>
    createStyles({
        root: {
            display: shouldDisplayError ? "table" : "none",
            minHeight: "30px",
            minWidth: "100px",
        },
    });

class SignupForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            fname: "",
            lname: "",
            email: "",
            password: "",
            passwordConfirm: "",
            passwordSuccess: false,
            passwordError: false,
            passwordBlurred: false,
            emailError: false,
            emailSuccess: false,
            emailBlurred: false,
            showPassword: true,
            err: false,
            errcode: 0,
            errtext: " ",
        };
        this.navigateToLanding = this.navigateToLanding.bind(this);
    }

    displayError = (e) => {
        this.setState(() => ({
            err: true,
            errcode: e.response.data.errcode,
            errtext: e.response.data.errText,
        }));
    };

    handleBlur = (evt) => {
        if (evt.target.name === "email") {
            let email = evt.target.value;
            let isMatch = emailRegex.test(email);
            this.setState(() => ({
                emailError: email.length > 0 && !isMatch,
                emailSuccess: email.length > 0 && isMatch,
                emailBlurred: true,
            }));
        } else if (evt.target.name === "password") {
            let pwValid = pwIsValid(
                this.state.password,
                this.state.passwordConfirm
            );
            this.setState(() => ({
                passwordBlurred: true,
                passwordSuccess: pwValid,
                passwordError: !pwValid,
            }));
        }
    };

    handleFocus = (evt) => {
        if (evt.target.name === "email") {
            this.setState(() => ({
                emailBlurred: false,
            }));
        } else if (evt.target.name === "password") {
            this.setState(() => ({
                passwordBlurred: false,
            }));
        }
    };

    handleChange = (evt) => {
        if (evt.target.name === "email") {
            let email = evt.target.value;
            let isMatch = emailRegex.test(email);
            if (isMatch) {
                this.setState(() => ({
                    emailSuccess: true,
                    emailError: false,
                    email: evt.target.value,
                }));
            } else if (this.state.emailError) {
                this.setState(() => ({
                    email: evt.target.value,
                    emailError: false,
                    emailSuccess: false,
                }));
            }
        } else if (
            evt.target.name === "password" ||
            evt.target.name === "passwordConfirm"
        ) {
            const pw =
                evt.target.name === "password"
                    ? evt.target.value
                    : this.state.password;
            const pwConfirm =
                evt.target.name === "passwordConfirm"
                    ? evt.target.value
                    : this.state.passwordConfirm;
            const isValid = pwIsValid(pw, pwConfirm);
            if (isValid) {
                this.setState(() => ({
                    passwordSuccess: true,
                    passwordError: false,
                    password: pw,
                    passwordConfirm: pwConfirm,
                }));
            } else {
                this.setState(() => ({
                    passwordSuccess: false,
                    passwordError: pw.length > 0 || pwConfirm.length > 0,
                    password: pw,
                    passwordConfirm: pwConfirm,
                }));
            }
        } else {
            this.setState(() => ({
                [evt.target.name]: evt.target.value,
            }));
        }
    };

    handleSubmit = async (evt) => {
        evt.preventDefault();
        const { fname, lname, email, password } = this.state;
        const name = fname + " " + lname;
        let tokenValue = "";
        let shoeCookie = "";
        var token = await getCacheCookie(/^Shoester+=/);
        if (token === undefined) {
            axios.get("http://localhost:8000/addContext", {}).then((res) => {
                shoeCookie = res.data["sessionValue"];
                const expiry = res.data["sessionExpiry"];

                console.log("shoecookie --> ", shoeCookie);
                console.log("expiry --> ", expiry);
                setCacheCookie("Shoester", shoeCookie);
            });
            token = await getCacheCookie(/^Shoester+=/);
        }
        tokenValue = token.replace(/^Shoester+=/, "");

        await axios
            .post("http://localhost:8000/signup", {
                name,
                email,
                password,
                tokenValue,
            })
            .then((res) => {
                if (res !== undefined) {
                    console.log(res.data);
                    console.log("Signup Successful!!");

                    // --- REDUX EVENT ---
                    this.props.triggerLogin({ email: email, fname: fname });
                    this.navigateToLanding();
                }
            })
            .catch((error) => {
                console.log("Signup Error! --> ", error);
                this.setState({
                    err: true,
                    errcode: error.response.data.errcode,
                    errtext: error.response.data.errText,
                });
            });
    };

    navigateToLanding() {
        this.props.navigate("/");
    }

    render() {
        return (
            <div className="top-level">
                <BackButton className="back-btn" />
                <div className="form-container signup-color">
                    <form
                        name="sign-up"
                        method="post"
                        className="form-sign-up shadow-layering"
                        action=""
                        encType="multipart/form-data"
                        onSubmit={this.handleSubmit}>
                        <h1 className="title">Sign up</h1>

                        <div className="input-container name-field">
                            <StyledField
                                required
                                id="fname-field"
                                className="field"
                                fullWidth
                                label="First Name"
                                defaultValue={""}
                                onChange={this.handleChange}
                                variant="outlined"
                                name="fname"
                            />
                        </div>
                        <div className="input-container name-field">
                            <StyledField
                                required
                                id="lname-field"
                                className="field"
                                fullWidth
                                label="Last Name"
                                defaultValue={""}
                                onChange={this.handleChange}
                                variant="outlined"
                                name="lname"
                            />
                        </div>
                        <div className="input-container email-field">
                            <StyledField
                                required
                                id="email-field"
                                className="field"
                                fullWidth
                                label="Email"
                                defaultValue={""}
                                onChange={this.handleChange}
                                onBlur={this.handleBlur}
                                onFocus={this.handleFocus}
                                error={this.state.emailError}
                                color={
                                    this.state.emailError
                                        ? "error"
                                        : this.state.emailSuccess
                                        ? "success"
                                        : !this.state.emailBlurred
                                        ? "secondary"
                                        : "primary"
                                }
                                variant="outlined"
                                name="email"
                                helperText={
                                    this.state.emailError &&
                                    this.state.email.length > 0
                                        ? "The email provided is invalid."
                                        : ""
                                }
                            />
                        </div>
                        <div className="input-container pw-field">
                            <StyledField
                                required
                                id="password-field"
                                className="field"
                                fullWidth
                                label="Password"
                                defaultValue=""
                                onChange={this.handleChange}
                                error={this.state.passwordError}
                                variant="outlined"
                                name="password"
                                type={
                                    this.state.showPassword
                                        ? "text"
                                        : "password"
                                }
                            />
                        </div>
                        <div className="input-container pw-confirm-field">
                            <StyledField
                                required
                                id="password-confirm-field"
                                className="field"
                                fullWidth
                                label="Confirm Password"
                                defaultValue=""
                                onChange={this.handleChange}
                                error={this.state.passwordError}
                                variant="outlined"
                                name="passwordConfirm"
                                type="password"
                            />
                            <FormControlLabel
                                control={
                                    <Checkbox
                                        size="small"
                                        disableRipple
                                        checked={this.state.showPassword}
                                        onChange={() => {
                                            this.setState((prevState) => ({
                                                showPassword:
                                                    !prevState.showPassword,
                                            }));
                                        }}
                                    />
                                }
                                label={
                                    <Typography
                                        style={{
                                            fontSize: "small",
                                            color: "grey",
                                            position: "relative",
                                            left: "8px",
                                        }}>
                                        Show Password
                                    </Typography>
                                }
                                className="show-pw-form-ctrl"
                                labelPlacement="start"
                            />
                        </div>
                        <div
                            className="error-msg"
                            style={pwErrorMsgStyle(this.state.err).root}>
                            <Typography
                                className="css-ahj2mt-MuiTypography-root"
                                style={{
                                    fontSize: "small",
                                    color: "red",
                                    position: "relative",
                                    minHeight: "30px",
                                }}>
                                {this.state.errtext}
                            </Typography>
                        </div>
                        <PasswordChecklist
                            className="pw-checklist"
                            rules={[
                                "minLength",
                                "specialChar",
                                "number",
                                "capital",
                                "match",
                            ]}
                            minLength={2}
                            value={this.state.password}
                            valueAgain={this.state.passwordConfirm}
                            messages={{
                                minLength: "Contains more than 2 characters.",
                                specialChar:
                                    "Contains one of the following: !#-_~&?$%*@.",
                                number: "Contains a number.",
                                capital: "Contains a capital letter.",
                                match: "Passwords match.",
                            }}
                        />
                        <input
                            type="submit"
                            className="submit-button"
                            value={"Submit"}></input>
                    </form>
                </div>
            </div>
        );
    }
}

const mapDispatchToProps = {
    triggerLogin: LoginEventCreator.login,
};

export default connect(null, mapDispatchToProps)(withRouter(SignupForm));
