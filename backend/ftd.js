var port = 8000

var serverInterval
const cors = require("cors")
var express = require("express")
const jwt = require("jsonwebtoken")
var app = express()
app.use(cors())
var accessTokenSecret = "randomstringtestfornow"
var Game = require("./gameStage")

const { Pool } = require("pg")

const pool = new Pool({
    user: "root",
    host: "db",
    database: "webdb",
    password: "password",
    port: 5432,
})

const bodyParser = require("body-parser")

var count = 0
var clients = {}
var gameObj = new Game()
var gameState = gameObj.serialize()
gameState = JSON.stringify(gameState)

var playerAction = {}

serverInterval = setInterval(function () {
    var worldJson = JSON.parse(gameState)
}, 20)

function removeActors(actorJson, world) {
    var removeObj = actorJson["remove"]
    for (const key in removeObj) {
        for (var objIndex = 0; objIndex < removeObj[key].length; objIndex++) {
            for (
                var actorIndex = 0;
                actorIndex < world[key].length;
                actorIndex++
            ) {
                if (removeObj[key][objIndex].id == world[key][actorIndex].id) {
                    world[key].splice(actorIndex, 1)
                }
            }
        }
    }
    return world
}

var WebSocketServer = require("ws")
const wss = new WebSocketServer.Server({ port: 8005 })

wss.on("close", function () {
    console.log("disconnected")
})

wss.broadcast = function (gameState) {
    for (let ws of this.clients) {
        ws.send(gameState)
    }
}

wss.on("connection", function (ws) {
    console.log("connected")
    ws.send(gameState)

    ws.on("message", function (game) {
        count += 1
        var gamejson = JSON.parse(game)
        var worldJson = JSON.parse(gameState)
        if ("addPlayer" in gamejson) {
            var newPlayer = gamejson["addPlayer"]

            ws.userName = newPlayer.name
            playerAction[newPlayer.name] = []
            if ("player" in worldJson) {
                worldJson["player"].push(newPlayer)
            } else {
                worldJson["player"] = [newPlayer]
            }
            gameState = JSON.stringify(worldJson)
        } else if ("removePlayer" in gamejson) {
            var remove = gamejson["removePlayer"]
            var playerList = worldJson["player"]
            for (var i = 0; i < playerList.length; i++) {
                if (playerList[i].name == remove.name) {
                    playerList.splice(i, 1)
                    break
                }
            }
            worldJson["player"] = playerList
            gameState = JSON.stringify(worldJson)
        } else {
            var playerObj = gamejson["player"]

            var worldPlayers = worldJson["player"]
            for (var i = 0; i < worldPlayers.length; i++) {
                if (worldPlayers[i].name == playerObj.name) {
                    worldPlayers[i] = playerObj
                    break
                }
            }
            worldJson["player"] = worldPlayers
            gameState = JSON.stringify(worldJson)

            if (
                !(
                    Object.keys(gamejson["actions"]["remove"]).length === 0 &&
                    gamejson["actions"]["remove"].constructor === Object
                )
            ) {
                worldJson = removeActors(gamejson["actions"], worldJson)
            }

            gameState = JSON.stringify(worldJson)
        }

        wss.broadcast(gameState)
    })

    ws.on("close", function (code, reason) {
        console.log(ws.userName, " disconnected")
        var disconnectedUser = ws.userName
        var worldJson = JSON.parse(gameState)
        var players = worldJson["player"]
        for (var i = 0; i < players.length; i++) {
            if (players[i].name == disconnectedUser) {
                players.splice(i, 1)
            }
        }
        worldJson["player"] = players
        gameState = JSON.stringify(worldJson)
        wss.broadcast(gameState)
    })
})

app.use(bodyParser.json())

app.post("/api/test", function (req, res) {
    res.status(200)
    res.json({ message: "got here" })
})

app.get("/api/test", function (req, res) {
    res.status(200)
    res.json({ message: "got here GET" })
})

app.post("/api/register", function (req, res) {
    console.log("route called")
    console.log(req)
    var uname = req.body.username
    var pswd = req.body.password
    var fname = req.body.firstname
    var lname = req.body.lastname
    var email = req.body.email
    var birthday = req.body.birthday
    let sql =
        "INSERT INTO ftduser(username, password, firstname, lastname, email, birthday) VALUES($1, sha512($2), $3, $4, $5, $6);"

    let sql2 = "SELECT score FROM score WHERE username='arnold'"
    pool.query(sql2, (err, result) => {
        console.log("Result of select in reg: ", result)
    })
    console.log(sql, [uname, pswd, fname, lname, email, birthday])
    pool.query(
        sql,
        [uname, pswd, fname, lname, email, birthday],
        (err, pgRes) => {
            console.log("New Error", err)
            if (err && err.code == 23505) {
                res.status(409)
                res.json({ error: "User already exists" })
                return
            }
            if (err) {
                res.status(500)
                res.json({ error: err.message })
                return
            }
            if (pgRes.rowCount == 1) {
                let sql2 = "INSERT INTO score(username, score) VALUES($1, $2)"
                pool.query(sql2, [uname, 0], (err, result) => {
                    if (!err) {
                        res.status(200)
                        res.json({ Success: "User registered" })
                        return
                    }
                })
            } else {
                res.status(500)
                res.json({ error: "couldn't add to database" })
                return
            }
        }
    )
})

/**
 * This is middleware to restrict access to subroutes of /api/auth/
 * To get past this middleware, all requests should be sent with appropriate
 * credentials. Now this is not secure, but this is a first step.
 *
 * Authorization: Basic YXJub2xkOnNwaWRlcm1hbg==
 * Authorization: Basic " + btoa("arnold:spiderman"); in javascript
 **/
function generateToken() {
    var token = Math.random().toString(36).substr(2)
    return token
}

function authenticateToken(req, res, next) {
    if (!req.headers.authorization) {
        return res.status(403).json({ error: "No token sent!" })
    }
    const auth = req.headers.authorization
    const token = auth && auth.split(" ")[1]
    if (token == null) {
        res.status(403).json({ error: "No token provided" })
    } else {
        jwt.verify(token, accessTokenSecret, (err, user) => {
            if (err) {
                return res.sendStatus(403)
            }
            next()
        })
    }
}

app.post("/api/update", function (req, res) {
    var username = req.body.username
    var score = req.body.score
    let sql = "UPDATE score SET score=$2 WHERE username=$1"
    pool.query(sql, [username, score], (err, pgres) => {
        if (err) {
            res.status(403).json({ error: "Could not update db" })
        } else {
            console.log("score updated")
        }
    })
})

app.post("/api/profile", function (req, res) {
    console.log(req)
    console.log("update recieved")
    var uname = req.body.username
    var pswd = req.body.password
    var fname = req.body.firstname
    var lname = req.body.lastname
    var email = req.body.email
    var birthday = req.body.birthday
    console.log("good from here")
    let sql =
        "UPDATE ftduser SET password=sha512($2), firstname=$3,lastname=$4, email=$5, birthday=$6 WHERE username=$1"
    pool.query(
        sql,
        [uname, pswd, fname, lname, email, birthday],
        (err, result) => {
            if (!err) {
                res.status(200).json({ message: "Update successful" })
            }
        }
    )
})

app.use("/api/login", function (req, res) {
    if (!req.headers.authorization) {
        return res.status(403).json({ error: "No credentials sent!" })
    }
    try {
        var m = /^Basic\s+(.*)$/.exec(req.headers.authorization)

        var user_pass = Buffer.from(m[1], "base64").toString()
        m = /^(.*):(.*)$/.exec(user_pass)

        var username = m[1]
        var password = m[2]

        console.log(username + " " + password)

        let sql =
            "SELECT * FROM ftduser WHERE username=$1 and password=sha512($2)"
        pool.query(sql, [username, password], (err, pgRes) => {
            if (err) {
                console.log(err)
                res.status(403).json({ error: "Not authorized" })
            } else if (pgRes.rowCount == 1) {
                console.log("user was found")
                var email = pgRes.rows[0].email
                var firstname = pgRes.rows[0].firstname
                var lastname = pgRes.rows[0].lastname
                var birthday = pgRes.rows[0].birthday
                let sql2 = "SELECT score FROM score WHERE username=$1"
                pool.query(sql2, [username], (err, result) => {
                    console.log("this also works for", username)
                    console.log(sql2, [username])
                    console.log(result)
                    var highscore = result.rows[0].score
                    const accessToken = jwt.sign(
                        { user: username, pass: password },
                        accessTokenSecret
                    )
                    res.status(200)
                    res.json({
                        accessToken,
                        highscore,
                        username,
                        email,
                        firstname,
                        lastname,
                        birthday,
                    })
                })
            } else {
                res.status(403).json({ error: "Not authorized" })
            }
        })
    } catch (err) {
        res.status(403).json({ error: "Not authorized" })
    }
})

app.use("/api/delete", function (req, res) {
    var uname = req.body.username

    let sql = "DELETE FROM ftduser WHERE username=$1"
    pool.query(sql, [uname], (err, pgRes) => {
        console.log(pgRes)
        if (!err) {
            let sql1 = "DELETE FROM score where username=$1"
            pool.query(sql1, [uname], (err, pgRes) => {
                console.log(pgRes)
                if (!err) {
                    res.status(200)
                    res.json({ message: "user deleted" })
                }
            })
        }
    })
})

app.post("/api/auth/test", authenticateToken, function (req, res) {
    res.status(200)
    res.json({ message: "got to /api/auth/test" })
})

app.use("/", express.static("build"))

app.listen(port, function () {
    console.log("Example app listening on port " + port)
})
