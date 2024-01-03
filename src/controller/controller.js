import { Stage, Pair } from "../models/stage"

var stage = null

var webSocketInterval = null

var keys = []

var shift = 5

var userName
var score

var color

var socket
var globalGameState

var gameID

var socketSend = {}

var url = `http://localhost:8000`

function randint(n, min = 0) {
    return Math.round(Math.random() * (n - min) + min)
}

export function initSocket() {
    console.log(window.location.hostname)

    socket = new WebSocket(`ws://${window.location.hostname}:8005`)
    console.log("CLIENT: ", socket)
    socket.onopen = function (event) {
        console.log("connected")
    }
    socket.onclose = function (event) {
        alert(
            "closed code:" +
                event.code +
                " reason:" +
                event.reason +
                " wasClean:" +
                event.wasClean
        )
    }
    socket.onerror = function (event) {
        console.error("WEBSOCKET: ", event)
    }
    socket.onmessage = function (event) {
        var recieved = event.data
        globalGameState = JSON.parse(recieved)
        if (stage !== null) {
            stage.populateActors(globalGameState)
        }
    }
}

export function setupGame(canvas) {
    var green = randint(255)
    var red = randint(255)
    var blue = randint(255)
    color = "rgba(" + red + "," + green + "," + blue + ",1)"

    userName = Math.random().toString(36).substring(7)
    stage = new Stage(canvas, globalGameState, userName, color)

    document.addEventListener("keydown", moveByKey)
    document.addEventListener("keyup", resetkey)
}
export function startGame() {
    if (stage.player === null) {
        clearInterval(webSocketInterval)
        var removePlayer = {
            removePlayer: stage.deadPlayer,
        }
        socket.send(JSON.stringify(removePlayer))
        window.appComponent.showGameOver()
        stopGame()
        socket.close()
    } else {
        stage.step()
        stage.draw()
        gameID = requestAnimationFrame(startGame)
    }
}

export function stopGame() {
    console.log("stopGame called")
    window.cancelAnimationFrame(gameID)
}

function resetkey(event) {
    if (stage.getPlayer() !== null) {
        var keyRemoved = event.key
        var moveMap = {
            a: new Pair(-shift, 0),
            s: new Pair(0, shift),
            d: new Pair(shift, 0),
            w: new Pair(0, -shift),
            "a,s": new Pair(-shift, shift),
            "s,a": new Pair(-shift, shift),
            "a,w": new Pair(-shift, -shift),
            "w,a": new Pair(-shift, -shift),
            "s,d": new Pair(shift, shift),
            "d,s": new Pair(shift, shift),
            "d,w": new Pair(shift, -shift),
            "w,d": new Pair(shift, -shift),
        }
        for (var i = 0; i < keys.length; i++) {
            if (keys[i] === keyRemoved) {
                keys.splice(i, 1)
            }
        }
        if (keys.length === 0) {
            stage.player.velocity = new Pair(0, 0)
        }
        var strKeys = keys.join()
        if (strKeys in moveMap) {
            stage.player.velocity = moveMap[strKeys]
        }
    }
}

function moveByKey(event) {
    if (stage.getPlayer() !== null) {
        score = stage.player.score
    }
    if (stage.getPlayer() !== null && !stage.isWon()) {
        var key = event.key
        var moveMap = {
            a: new Pair(-shift, 0),
            s: new Pair(0, shift),
            d: new Pair(shift, 0),
            w: new Pair(0, -shift),
            "a,s": new Pair(-shift, shift),
            "s,a": new Pair(-shift, shift),
            "a,w": new Pair(-shift, -shift),
            "w,a": new Pair(-shift, -shift),
            "s,d": new Pair(shift, shift),
            "d,s": new Pair(shift, shift),
            "d,w": new Pair(shift, -shift),
            "w,d": new Pair(shift, -shift),
        }

        var pauseMenu = {
            q: "quit",
        }

        var restartMenu = {
            r: "restart",
        }

        if (!keys.includes(key) && key in moveMap) {
            keys.push(key)
            var strKeys = keys.join()
            if (strKeys in moveMap) {
                stage.player.velocity = moveMap[strKeys]
            }
        } else if (key in pauseMenu) {
            console.log("pause menu")
            window.appComponent.toggleQuitMenu()
        } else if (key in restartMenu) {
            if (stage.gameState === "paused") {
            }
        }
    } else if (stage.isWon()) {
        var key = event.key
        var restartMenu = {
            r: "restart",
        }
        if (key in restartMenu) {
        }
    } else {
        var key = event.key
        var restartMenu = {
            r: "restart",
        }
        if (key in restartMenu) {
        }
    }
}

export function moveButton(value) {
    if (stage.getPlayer() !== null) {
        score = stage.player.score
    }

    if (stage.getPlayer() !== null && !stage.isWon()) {
        var moveMap = {
            1: new Pair(-shift, 0),
            2: new Pair(0, shift),
            3: new Pair(shift, 0),
            4: new Pair(0, -shift),
        }

        stage.player.velocity = moveMap[value]
    }
}

export function newPlayer() {
    newPlayer = {
        addPlayer: stage.getPlayer(),
    }
    socket.send(JSON.stringify(newPlayer))
}

export function send() {
    webSocketInterval = setInterval(function () {
        socketSend = {
            player: stage.player.toJSON(),
            actions: stage.getActions(),
        }
        socket.send(JSON.stringify(socketSend))
        stage.clearActions()
    }, 20)
}

export async function userLogin(username, password) {
    const credentials = {
        username: username,
        password: password,
    }

    const data = {
        method: "POST",
        headers: {
            Authorization:
                "Basic " +
                btoa(credentials.username + ":" + credentials.password),
        },
        data: JSON.stringify({}),
    }

    const response = await fetch(url + "/api/login", data)
    const info = await response.json()
    if ("error" in info) {
        return false
    }
    return info
}

export async function userRegister(
    username,
    firstname,
    lastname,
    password,
    email,
    birthday
) {
    const information = {
        username: username,
        firstname: firstname,
        lastname: lastname,
        password: password,
        email: email,
        birthday: birthday,
    }

    console.log(information)
    const data = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(information),
    }

    const response = await fetch(url + "/api/register", data)
    const info = await response.json()
    if ("Success" in info) {
        return true
    } else {
        return false
    }
}

export async function changeScore(username, score) {
    const information = {
        username: username,
        score: score,
    }

    const data = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(information),
    }
    const response = await fetch(url + "/api/update", data)
    const info = await response.json()
    if ("Success" in info) {
        return true
    } else {
        return false
    }
}

export async function updateProfile(
    username,
    firstname,
    lastname,
    password,
    email,
    birthday
) {
    const information = {
        username: username,
        firstname: firstname,
        lastname: lastname,
        password: password,
        email: email,
        birthday: birthday,
    }

    const data = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(information),
    }

    const response = await fetch(url + "/api/profile", data)
    const info = await response.json()
    return true
}

export async function deleteUser(username) {
    const information = {
        username: username,
    }

    const data = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(information),
    }

    const response = await fetch(url + "/api/delete", data)
    const info = await response.json()
    return true
}
