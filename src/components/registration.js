import React from "react"
import {
    createMuiTheme,
    withStyles,
    makeStyles,
    ThemeProvider,
} from "@material-ui/core/styles"
import TextField from "@material-ui/core/TextField"
import Button from "@material-ui/core/Button"
import { green, lightGreen } from "@material-ui/core/colors"

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

class Registration extends React.Component {
    constructor(props) {
        super(props)
        this.checkUsername = this.checkUsername.bind(this)
        this.checkPassword = this.checkPassword.bind(this)
        this.checkConfirmPassword = this.checkConfirmPassword.bind(this)
        this.checkEmail = this.checkEmail.bind(this)
        this.checkFirst = this.checkFirst.bind(this)
        this.checkLast = this.checkLast.bind(this)
        this.updateBirthday = this.updateBirthday.bind(this)
        this.checkRegistration = this.checkRegistration.bind(this)
    }
    state = {
        username: "",
        password: "",
        cpassword: "",
        email: "",
        birthday: "",
        first: "",
        last: "",
        errors: [],
        valid: [false],
    }

    componentDidMount() {}

    checkUsername(e) {
        if (e.target.value === "") {
            this.state.errors.push("Username cannot be empty")
            this.setState({ username: e.target.value })
            this.setState({ valid: false })
        } else {
            this.setState({ username: e.target.value })
            this.setState({ errors: [] })
        }
    }

    checkPassword(e) {
        if (e.target.value === "") {
            this.state.errors.push("Password cannot be empty")
            this.setState({ password: e.target.value })
            this.setState({ valid: false })
        } else {
            this.setState({ password: e.target.value })
            this.setState({ errors: [] })
        }
    }

    checkConfirmPassword(e) {
        if (e.target.value !== this.state.password) {
            this.state.errors.push("Password must match")
            this.setState({ cpassword: e.target.value })
            this.setState({ valid: false })
        } else {
            this.setState({ cpassword: e.target.value })
            this.setState({ errors: [] })
        }
    }

    checkEmail(e) {
        if (e.target.value === "") {
            this.state.errors.push("Email cannot be empty")
            this.setState({ email: e.target.value })
            this.setState({ valid: false })
        } else {
            this.setState({ email: e.target.value })
            this.setState({ errors: [] })
        }
    }
    checkFirst(e) {
        if (e.target.value === "") {
            this.state.errors.push("First Name cannot be empty")
            this.setState({ first: e.target.value })
            this.setState({ valid: false })
        } else {
            this.setState({ first: e.target.value })
            this.setState({ errors: [] })
        }
    }
    checkLast(e) {
        if (e.target.value === "") {
            this.state.errors.push("Last Name cannot be empty")
            this.setState({ last: e.target.value })
            this.setState({ valid: false })
        } else {
            this.setState({ last: e.target.value })
            this.setState({ errors: [] })
        }
    }
    updateBirthday(e) {
        this.setState({ birthday: e.target.value })
    }

    checkRegistration() {
        if (this.state.username === "") {
            this.state.errors.push("Username cannot be empty")
        } else if (this.state.password === "") {
            this.state.errors.push("Password cannot be empty")
        } else if (this.state.password !== this.state.cpassword) {
            this.state.errors.push("Passwords must match")
        } else if (this.state.email === "") {
            this.state.errors.push("Email cannot be empty")
        } else if (this.state.first === "") {
            this.state.errors.push("First name cannot be empty")
        } else if (this.state.last === "") {
            this.state.errors.push("Last name cannot be empty")
        } else {
            this.props.toLogin(
                this.state.username,
                this.state.first,
                this.state.last,
                this.state.password,
                this.state.email,
                this.state.birthday
            )
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
                <h1 style={{ fontFamily: "Futura, sans-serif" }}>Register</h1>
                <TextField
                    InputProps={{
                        style: {
                            borderRadius: "14px",
                            fontFamily: "Futura, sans-serif",
                        },
                    }}
                    label="Username"
                    style={{ margin: 8 }}
                    placeholder={"Create Username"}
                    onChange={this.checkUsername}
                    fullWidth={true}
                    margin="normal"
                    variant="outlined"
                />
                <TextField
                    InputProps={{
                        style: {
                            borderRadius: "14px",
                            fontFamily: "Futura, sans-serif",
                        },
                    }}
                    label="First Name"
                    style={{ margin: 8 }}
                    placeholder="Enter First Name"
                    onChange={this.checkFirst}
                    fullWidth={true}
                    margin="normal"
                    variant="outlined"
                />
                <TextField
                    InputProps={{
                        style: {
                            borderRadius: "14px",
                            fontFamily: "Futura, sans-serif",
                        },
                    }}
                    label="Last Name"
                    style={{ margin: 8 }}
                    placeholder="Enter Last Name"
                    onChange={this.checkLast}
                    fullWidth={true}
                    margin="normal"
                    variant="outlined"
                />

                <TextField
                    InputProps={{
                        style: {
                            borderRadius: "14px",
                            fontFamily: "Futura, sans-serif",
                        },
                    }}
                    label="Password"
                    type="password"
                    style={{ margin: 8 }}
                    placeholder="Create Password"
                    fullWidth={true}
                    onChange={this.checkPassword}
                    margin="normal"
                    variant="outlined"
                />
                <TextField
                    InputProps={{
                        style: {
                            borderRadius: "14px",
                            fontFamily: "Futura, sans-serif",
                        },
                    }}
                    label="Confirm Password"
                    type="password"
                    style={{ margin: 8 }}
                    placeholder="Confirm Password"
                    fullWidth={true}
                    onChange={this.checkConfirmPassword}
                    margin="normal"
                    variant="outlined"
                />
                <TextField
                    InputProps={{
                        style: {
                            borderRadius: "14px",
                            fontFamily: "Futura, sans-serif",
                        },
                    }}
                    label="Enter Email"
                    style={{ margin: 8 }}
                    placeholder="Enter Email"
                    fullWidth={true}
                    onChange={this.checkEmail}
                    margin="normal"
                    variant="outlined"
                />
                <TextField
                    id="date"
                    label="Birthday"
                    type="date"
                    style={{ margin: 12 }}
                    onChange={this.updateBirthday}
                    InputLabelProps={{
                        shrink: true,
                    }}
                />
                <p
                    style={{
                        borderRadius: "14px",
                        fontFamily: "Futura, sans-serif",
                        color: "#e1793d",
                        fontWeight: "bold",
                    }}
                >
                    {this.state.errors[this.state.errors.length - 1]}
                </p>
                <ThemeProvider theme={theme}>
                    <Button
                        onClick={this.checkRegistration}
                        variant="contained"
                        style={{
                            borderRadius: "20px",
                            backgroundColor: "#FF6F61",
                            color: "white",
                            fontWeight: "bold",
                        }}
                        fullWidth={true}
                    >
                        Register
                    </Button>
                    &nbsp; &nbsp; &nbsp; &nbsp;
                    <Button
                        onClick={this.props.back}
                        variant="contained"
                        style={{
                            borderRadius: "20px",
                            backgroundColor: "#FF6F61",
                            color: "white",
                            fontWeight: "bold",
                        }}
                        fullWidth={true}
                    >
                        Login
                    </Button>
                </ThemeProvider>
            </div>
        )
    }
}
export default Registration
