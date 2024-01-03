import React from "react"
import ReactDOM from "react-dom"
import "./index.css"
import App from "./App"
import reportWebVitals from "./reportWebVitals"
import {
    BrowserRouter as Router,
    Route,
    Redirect,
    Switch,
} from "react-router-dom"
import Routes from "./components/Routes"
import Login from "./components/login"
import Registration from "./components/registration"

ReactDOM.render(
    <Router forceRefresh={true}>
        <div className="App">
            <App />
        </div>
    </Router>,
    document.getElementById("root")
)
reportWebVitals()
