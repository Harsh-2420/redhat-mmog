import React, { Component } from "react"
import "./App.css"
import Login from "./components/login"
import Pause from "./components/Pause"
import Registration from "./components/registration"

import GameView from "./components/GameView"

import {
    changeScore,
    deleteUser,
    initSocket,
    moveButton,
    updateProfile,
    userLogin,
    userRegister,
} from "./controller/controller"

import GameOver from "./components/GameOver"

import Menu from "./components/Menu"

class App extends Component {
    constructor() {
        super()
        this.state = {
            username: "",
            highscore: null,
            email: "",
            firstname: "",
            lastname: "",
            birthday: "",
            password: "",
            showLogin: true,
            showRegistration: false,
            showPause: false,
            showGame: false,

            error: "",
            score: 0,
            showGameOver: false,
            showMenu: false,
            mobile: false,

            user: "",
        }
        this.backToLogin = this.backToLogin.bind(this)
        this.backToPause = this.backToPause.bind(this)
        this.loginSuccess = this.showPause.bind(this)
        this.toRegistration = this.showRegistration.bind(this)
        this.registrationSuccess = this.showLogin.bind(this)
        this.playGame = this.showGame.bind(this)

        this.updateProfile = this.profileUpdate.bind(this)
        this.move = this.moveCharacter.bind(this)

        this.device = this.switchDevice.bind(this)
        this.showGameOver = this.showGameOver.bind(this)
        this.toggleQuitMenu = this.toggleQuitMenu.bind(this)
        this.delete = this.deleteProfile.bind(this)

        this.return = this.returnToPause.bind(this)
        window.appComponent = this
    }

    returnToPause() {
        this.setState({
            showLogin: false,
            showPause: true,
            showGame: false,

            showRegistration: false,
            showGameOver: false,
        })
    }

    componentDidMount() {
        this.interval = setInterval(
            () => this.setState({ score: this.state.score + 10 }),
            500
        )
    }

    toggleQuitMenu() {
        console.log("toggle called")
        this.setState((prevState) => ({
            showMenu: !prevState.showMenu,
        }))
        console.log("Show Menu val: ", this.state.showMenu)
    }

    componentWillUnmount() {
        clearInterval(this.intervalID)
    }

    backToLogin() {
        this.setState({
            showLogin: true,
            showPause: false,
            showGame: false,

            showRegistration: false,
            showGameOver: false,
            showMenu: false,
        })
    }

    backToPause() {
        this.setState({
            showLogin: false,
            showPause: true,
            showGame: false,

            showRegistration: false,
            showGameOver: false,
        })
    }

    async showPause(username, password) {
        const response = await userLogin(username, password)
        if (response !== false) {
            console.log(response)
            initSocket()
            this.setState({
                showLogin: false,
                showRegistration: false,
                showGame: false,

                showPause: true,
                username: response.username,
                highscore: response.highscore,
                email: response.email,
                password: response.password,
                birthday: response.birthday,
                firstname: response.firstname,
                lastname: response.lastname,
                showGameOver: false,
            })
            console.log(this.state.username)
            console.log(this.state.highscore)
        } else {
            this.setState({ error: "Invalid Username or Password" })
        }
    }

    showRegistration() {
        this.setState({
            showLogin: false,
            showPause: false,
            showGame: false,

            showRegistration: true,
            showGameOver: false,
        })
    }

    async showLogin(username, firstname, lastname, password, email, birthday) {
        const response = await userRegister(
            username,
            firstname,
            lastname,
            password,
            email,
            birthday
        )
        if (response) {
            this.setState({
                showLogin: true,
                showPause: false,
                showGame: false,

                showRegistration: false,
                showGameOver: false,
                user: username,
                error: "Registered Successfuly",
            })
        } else {
            this.setState({
                showLogin: true,
                showPause: false,
                showGame: false,

                showRegistration: false,
                showGameOver: false,
                error: "Username already taken",
            })
        }
    }

    showGame() {
        this.setState({
            showLogin: false,
            showPause: false,
            showGame: true,

            showRegistration: false,
            showGameOver: false,
        })
    }

    showGameOver() {
        changeScore(this.state.username, this.state.score)
        this.setState({
            showLogin: false,
            showPause: false,
            showGame: false,

            showRegistration: false,
            showRegistration: false,
            showGameOver: true,
        })
    }

    switchDevice(device) {
        if (device) {
            this.setState({ mobile: false })
        } else {
            this.setState({ mobile: true })
        }
    }

    moveCharacter(direction) {
        moveButton(direction)
    }

    async updateScore(score, username) {
        const response = await changeScore(username, score)
    }

    async profileUpdate(firstname, lastname, password, email, birthday) {
        const response = await updateProfile(
            this.state.username,
            firstname,
            lastname,
            password,
            email,
            birthday
        )
        if (response) {
            this.setState({
                showLogin: true,
                showPause: false,
                showGame: false,

                showRegistration: false,
                error: "Profile Updated Successfuly",
            })
        }
    }

    async deleteProfile() {
        console.log("got here")
        deleteUser(this.state.username)
        this.setState({
            showLogin: true,
            showPause: false,
            showGame: false,

            showRegistration: false,
            error: "User deleted successfuly",
        })
    }

    render() {
        return (
            <div>
                {this.state.showLogin && (
                    <Login
                        loginHandler={this.loginSuccess}
                        registrationHandler={this.toRegistration}
                        error={this.state.error}
                    />
                )}

                {this.state.showRegistration && (
                    <Registration
                        toLogin={this.registrationSuccess}
                        back={this.backToLogin}
                    />
                )}
                {this.state.showPause && (
                    <Pause
                        toGame={this.playGame}
                        toUpdate={this.update}
                        switch={this.device}
                    />
                )}
                {/* {this.state.showUpdate && (
                    <Update
                        updateProfile={this.updateProfile}
                        back={this.backToPause}
                        firstname={this.state.firstname}
                        lastname={this.state.lastname}
                        email={this.state.email}
                        password={this.state.password}
                        birthday={this.state.birthday}
                        delete={this.delete}
                    />
                )} */}

                {this.state.showGame && <GameView />}
                {this.state.showGameOver && <GameOver />}
                {this.state.showMenu && (
                    <Menu close={this.toggleQuitMenu} quit={this.backToLogin} />
                )}
            </div>
        )
    }
}
export default App
