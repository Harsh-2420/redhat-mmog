import React from "react"
import {
    createMuiTheme,
    withStyles,
    makeStyles,
    ThemeProvider,
} from "@material-ui/core/styles"
import TextField from "@material-ui/core/TextField"
import Button from "@material-ui/core/Button"
import { green } from "@material-ui/core/colors"
import { Redirect } from "react-router-dom"
import { useHistory } from "react-router-dom"
import RedHat from "../images/redHat.png"

const useStyles = makeStyles((theme) => ({
    root: {
        display: "flex",
        flexWarp: "wrap",
    },

    textField: {
        marginLeft: theme.spacing(1),
        marginRight: theme.spacing(1),
    },
}))

const theme = createMuiTheme({
    palette: {
        primary: green,
    },
})

class Login extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            username: "",
            password: "",
        }
        this.updateUsername = this.updateUsername.bind(this)
        this.updatePassword = this.updatePassword.bind(this)
    }

    updateUsername(e) {
        if (e.target.value !== "") {
            this.setState({ username: e.target.value })
        }
    }

    updatePassword(e) {
        if (e.target.value !== "") {
            this.setState({ password: e.target.value })
        }
    }

    render() {
        return (
            <div
                className="title"
                style={{
                    textAlign: "center",
                    background: "white",
                    padding: "20px",
                    borderRadius: "10px",
                    fontFamily: "Futura, sans-serif",
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                }}
            >
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                    }}
                >
                    <img
                        src={RedHat}
                        alt="Red Hat Logo"
                        style={{
                            width: "200px",
                            height: "auto",
                            border: "none",
                        }}
                    />
                </div>
                {/* 
                <h1
                    style={{
                        fontFamily: "Futura, sans-serif",
                    }}
                >
                    Red Hat MMOG
                </h1> */}
                <TextField
                    label="Username"
                    style={{ margin: 8 }}
                    placeholder="Enter Username"
                    InputProps={{
                        style: {
                            borderRadius: "14px",
                            fontFamily: "Futura, sans-serif",
                        },
                    }}
                    onChange={this.updateUsername}
                    margin="normal"
                    variant="outlined"
                />
                <TextField
                    label="Password"
                    type="password"
                    style={{ margin: 8 }}
                    InputProps={{
                        style: {
                            borderRadius: "14px",
                            fontFamily: "Futura, sans-serif",
                        },
                    }}
                    placeholder="Enter Password"
                    onChange={this.updatePassword}
                    margin="normal"
                    variant="outlined"
                />
                <p
                    style={{
                        borderRadius: "14px",
                        fontFamily: "Futura, sans-serif",
                        color: "#e1793d",
                        fontWeight: "bold",
                    }}
                >
                    {this.props.error}
                </p>
                <ThemeProvider theme={theme}>
                    <Button
                        onClick={() =>
                            this.props.loginHandler(
                                this.state.username,
                                this.state.password
                            )
                        }
                        variant="contained"
                        style={{
                            borderRadius: "20px",
                            backgroundColor: "#FF6F61",
                            color: "white",
                            fontWeight: "bold",
                        }}
                    >
                        Login
                    </Button>
                    &nbsp; &nbsp; &nbsp;
                    <Button
                        onClick={this.props.registrationHandler}
                        variant="contained"
                        style={{
                            borderRadius: "20px",
                            backgroundColor: "#FF6F61",
                            color: "white",
                            fontWeight: "bold",
                        }}
                    >
                        Register
                    </Button>
                </ThemeProvider>
            </div>
        )
    }
}

export default Login
