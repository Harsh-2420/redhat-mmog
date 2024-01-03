import React, { useEffect } from "react"
import { makeStyles } from "@material-ui/core/styles"
import Paper from "@material-ui/core/Paper"
import Grid from "@material-ui/core/Grid"
import { useState } from "react"
import Radio from "@material-ui/core/Radio"
import RadioGroup from "@material-ui/core/RadioGroup"
import FormControlLabel from "@material-ui/core/FormControlLabel"
import FormControl from "@material-ui/core/FormControl"
import FormLabel from "@material-ui/core/FormLabel"
import Button from "@material-ui/core/Button"
import { initSocket } from "../controller/controller"

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },
    paper: {
        padding: theme.spacing(2),
        textAlign: "center",
        color: theme.palette.text.secondary,
        height: 100,
    },
    header: {
        padding: theme.spacing(2),
        textAlign: "center",
        color: theme.palette.text.secondary,
        height: 50,
    },
}))

export default function Pause(props) {
    const [device, changeDevice] = useState("Computer")

    const classes = useStyles()

    const handleChange = (event) => {
        changeDevice(event.target.value)
    }

    return (
        <div className={classes.root}>
            {/* <Grid container spacing={3}> */}
            {/* <Grid item xs={12}>
                    <Paper className={classes.header}>Pause Menu</Paper>
                </Grid>
                <Grid item xs={12} sm={6}>
                    <Paper className={classes.paper}>Head Color</Paper>
                </Grid>
                <Grid item xs={12} sm={6}>
                    <Paper className={classes.paper}>Color Picker</Paper>
                </Grid>
                <Grid item xs={12} sm={6}>
                    <Paper className={classes.paper}>Device</Paper>
                </Grid> */}
            {/* <Grid item xs={12} sm={6}>
                    <Paper className={classes.paper}>
                        <FormControl component="fieldset">
                            <RadioGroup
                                aria-label="Device"
                                name="device"
                                value={device}
                                onChange={handleChange}
                            >
                                <FormControlLabel
                                    value="Computer"
                                    control={<Radio color="primary" />}
                                    onChange={() => props.switch(true)}
                                    label="Computer"
                                    labelPlacement="start"
                                />
                                <FormControlLabel
                                    value="Mobile"
                                    control={<Radio color="primary" />}
                                    label="Mobile"
                                    onChange={() => props.switch(false)}
                                    labelPlacement="start"
                                />
                            </RadioGroup>
                        </FormControl>
                    </Paper>
                </Grid> */}
            <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    height: "100vh",
                    backgroundColor: "white",
                }}
            >
                <h2
                    style={{
                        fontFamily: "Futura, sans-serif",
                        color: "#333",
                        marginBottom: "20px",
                    }}
                >
                    Controls
                </h2>
                <div
                    style={{
                        fontFamily: "Futura, sans-serif",
                        color: "#555",
                        marginBottom: "20px",
                    }}
                >
                    <ul
                        style={{
                            listStyleType: "none",
                            padding: "0",
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                        }}
                    >
                        <li>
                            Move with{" "}
                            <span style={{ fontWeight: "bold" }}>W-A-S-D</span>{" "}
                        </li>
                        <br></br>
                        <li>
                            Press <span style={{ fontWeight: "bold" }}>Q</span>{" "}
                            to Quit
                        </li>
                    </ul>
                </div>
                <Button
                    onClick={props.toGame}
                    variant="contained"
                    style={{
                        borderRadius: "20px",
                        backgroundColor: "#FF6F61",
                        color: "white",
                        width: "200px",
                        fontFamily: "Futura, sans-serif",
                    }}
                >
                    Play
                </Button>
            </div>

            {/* &nbsp; &nbsp; &nbsp; &nbsp;
                <Button
                    onClick={props.toUpdate}
                    variant="contained"
                    color="primary"
                    fullWidth={true}
                >
                    Update Profile
                </Button>
                &nbsp; &nbsp; &nbsp; &nbsp;
                <Button
                    onClick={props.toLeaderboard}
                    variant="contained"
                    color="primary"
                    fullWidth={true}
                >
                    Leaderboard
                </Button> */}
            {/* </Grid> */}
        </div>
    )
}
