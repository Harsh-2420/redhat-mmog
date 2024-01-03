import { Health } from "./pickup"
import { Obstacle } from "./obstacle"
import grass_image from "../images/grass.jpg"
import brick_image from "../images/brick.png"

import health_image from "../images/health.png"

function randint(n, min = 0) {
    return Math.round(Math.random() * (n - min) + min)
}
function rand(n) {
    return Math.random() * n
}

var count = 0

var playerHealth = 100

var brickImg = new Image()
brickImg.src = brick_image

var grassImg = new Image()
grassImg.src = grass_image

var healthImg = new Image()
healthImg.src = health_image

var xMovement = 0
var yMovement = 0
var userScore = 0

export class Stage {
    constructor(canvas, gamejson, userName, colour) {
        this.canvas = canvas
        this.gameState = "play"
        this.actors = []
        this.player = null
        this.deadPlayer = null
        this.score = 0
        canvas.width = window.innerWidth
        canvas.height = window.innerHeight
        this.numObstacles = 40

        this.numHealth = 20
        this.user = userName
        this.actions = {
            remove: {},
        }

        this.width = canvas.width
        this.height = canvas.height

        var position = new Pair(
            Math.floor(this.width / 2),
            Math.floor(this.height / 2)
        )
        var velocity = new Pair(0, 0)
        var radius = 15
        var colour = colour
        this.player = new Player(
            this,
            position,
            velocity,
            colour,
            radius,
            userName
        )
        this.populateActors(gamejson)
    }

    clearActions() {
        this.actions = {
            remove: {},
        }
    }

    getActions() {
        return this.actions
    }

    populateActors(gamejson) {
        this.actors = []
        for (const [key, value] of Object.entries(gamejson)) {
            if (key === "health") {
                this.populateHealth(value)
            } else if (key === "obstacle") {
                this.populateObstacle(value)
            } else if (key === "player") {
                this.populatePlayer(value)
            }
        }
    }

    populateHealth(healthList) {
        for (var i = 0; i < healthList.length; i++) {
            var health = healthList[i]
            var healthPos = new Pair(health.x, health.y)
            var healthActor = new Health(health.id, this, healthPos, healthImg)
            this.addActor(healthActor)
        }
    }

    populateObstacle(obsList) {
        for (var i = 0; i < obsList.length; i++) {
            var obs = obsList[i]
            var obsPos = new Pair(obs.x, obs.y)
            var obsActor = new Obstacle(
                obs.id,
                this,
                obsPos,
                brickImg,
                obs.health,
                obs.width,
                obs.height
            )
            this.addActor(obsActor)
        }
    }

    populatePlayer(playerList) {
        var playerAlive = true
        for (var i = 0; i < playerList.length; i++) {
            if (playerList[i].name !== this.user) {
                var otherPlayer = playerList[i]
                var otherPlayerPos = new Pair(otherPlayer.x, otherPlayer.y)
                var otherPlayerVelocity = new Pair(
                    otherPlayer.xvelocity,
                    otherPlayer.yvelocity
                )
                var otherPlayerActor = new Player(
                    this,
                    otherPlayerPos,
                    otherPlayerVelocity,
                    otherPlayer.colour,
                    otherPlayer.radius,
                    otherPlayer.name
                )
                this.addActor(otherPlayerActor)
            } else {
                this.player.playerHealth = playerList[i].playerHealth
                if (this.player.playerHealth < 0) {
                    playerAlive = false
                    this.deadPlayer = this.player
                    this.removePlayer()
                    break
                }

                this.addActor(this.player)
            }
        }
    }

    addPlayer(player) {
        this.addActor(player)
        this.player = player
    }

    removePlayer() {
        this.removeActor(this.player)
        this.player = null
    }

    getPlayer() {
        return this.player
    }

    addActor(actor) {
        this.actors.push(actor)
    }

    removeActor(actor) {
        var index = this.actors.indexOf(actor)
        if (index !== -1) {
            this.actors.splice(index, 1)
        }
    }

    checkObstaclePlayerInitialCollision(obstacle) {
        var playerX = Math.floor(this.width / 2)
        var playerY = Math.floor(this.height / 2)
        if (
            playerX > obstacle.position.x &&
            playerX < obstacle.position.x + obstacle.width &&
            playerY > obstacle.position.y &&
            playerY < obstacle.position.y + obstacle.height
        ) {
            return true
        }
        return false
    }

    serialize() {
        var game = {}
        for (var i = 0; i < this.actors.length; i++) {
            var actorJSON = this.actors[i].toJSON()
            if (this.actors[i] instanceof Obstacle) {
                if ("obstacle" in game) {
                    game["obstacle"].push(actorJSON)
                } else {
                    game["obstacle"] = [actorJSON]
                }
            } else if (this.actors[i] instanceof Player) {
                if ("player" in game) {
                    game["player"].push(actorJSON)
                } else {
                    game["player"] = [actorJSON]
                }
            } else if (this.actors[i] instanceof Health) {
                if ("health" in game) {
                    game["health"].push(actorJSON)
                } else {
                    game["health"] = [actorJSON]
                }
            }
        }

        game["remove"] = {}
        for (const [key, value] of Object.entries(this.actions["remove"])) {
            for (var i = 0; i < value.length; i++) {
                if (key in game["remove"]) {
                    game["remove"][key].push(value[i].toJSON())
                } else {
                    game["remove"][key] = [value[i].toJSON()]
                }
            }
        }

        return game
    }

    step() {
        if (this.gameState === "play") {
            if (this.player !== null) {
                for (var i = 0; i < this.actors.length; i++) {
                    this.actors[i].step()
                }
            } else {
                console.log("game over")
            }
        }
    }

    draw() {
        if (this.player !== null) {
            var context = this.canvas.getContext("2d")
            context.setTransform(1, 0, 0, 1, 0, 0)
            var x = this.clamp(
                this.player.x - context.canvas.width / 2,
                0,
                2000 - context.canvas.width
            )
            var y = this.clamp(
                this.player.y - context.canvas.height / 2,
                0,
                2000 - context.canvas.height
            )
            xMovement = x
            yMovement = y
            context.translate(-x, -y)
            context.clearRect(0, 0, this.width, this.height)
            this.drawBoard(context, 50, 100, 100)
            for (var i = 0; i < this.actors.length; i++) {
                this.actors[i].draw(context)
            }
        } else {
            console.log("draw over")
        }
    }

    // return the first actor at coordinates (x,y) return null if there is no such actor
    getActor(x, y) {
        for (var i = 0; i < this.actors.length; i++) {
            if (this.actors[i] instanceof Obstacle) {
                if (this.checkCollision(this.actors[i], x, y)) {
                    return this.actors[i]
                }
            }

            if (this.actors[i] instanceof Player) {
                if (this.checkCollision(this.actors[i], x, y)) {
                    return this.actors[i]
                }
            }

            if (this.actors[i] instanceof Health) {
                if (this.checkCollision(this.actors[i], x, y)) {
                    return this.actors[i]
                }
            }

            if (this.actors[i].x === x && this.actors[i].y === y) {
                return this.actors[i]
            }
        }
        return null
    }

    isWon() {
        return this.numEnemies === 0
    }

    clamp(value, a, b) {
        if (value < a) {
            return a
        } else if (value > b) {
            return b
        }
        return value
    }

    getMousePos(canvas, evt) {
        var rect = canvas.getBoundingClientRect()
        return {
            x: evt.clientX + xMovement,
            y: evt.clientY - rect.top + yMovement,
        }
    }

    checkCollision(obstacle, x, y) {
        if (
            (x > obstacle.x &&
                x < obstacle.x + obstacle.width &&
                y > obstacle.y &&
                y < obstacle.y + obstacle.height) ||
            (x + 15 > obstacle.x &&
                x + 15 < obstacle.x + obstacle.width &&
                y + 15 > obstacle.y &&
                y + 15 < obstacle.y + obstacle.height) ||
            (x + 15 > obstacle.x &&
                x + 15 < obstacle.x + obstacle.width &&
                y > obstacle.y &&
                y < obstacle.y + obstacle.height) ||
            (x > obstacle.x &&
                x < obstacle.x + obstacle.width &&
                y + 15 > obstacle.y &&
                y + 15 < obstacle.y + obstacle.height)
        ) {
            return true
        }
        return false
    }

    drawBoard(context, size, rows, cols) {
        for (var i = 0; i < rows; i++) {
            for (var j = 0; j < cols; j++) {
                var pattern = context.createPattern(grassImg, "repeat")
                context.fillStyle = pattern
                context.fillRect(i * size, j * size, size, size)
            }
        }
    }
}

export class Pair {
    constructor(x, y) {
        this.x = x
        this.y = y
    }

    toString() {
        return "(" + this.x + "," + this.y + ")"
    }

    normalize() {
        var magnitude = Math.sqrt(this.x * this.x + this.y * this.y)
        this.x = this.x / magnitude
        this.y = this.y / magnitude
    }
}

class Player {
    constructor(stage, position, velocity, colour, radius, name) {
        this.stage = stage
        this.user = name
        this.position = position
        this.intPosition()
        this.x = this.position.x
        this.y = this.position.y
        this.velocity = velocity
        this.xvelocity = this.velocity.x
        this.yvelocity = this.velocity.y
        this.colour = colour
        this.radius = radius
        this.score = 0

        this.playerHealth = playerHealth
        this.height = 15
        this.width = 15
    }

    headTo(position) {
        this.velocity.x = position.x - this.position.x
        this.velocity.y = position.y - this.position.y
        this.velocity.normalize()
    }

    toString() {
        return this.position.toString() + " " + this.velocity.toString()
    }

    step() {
        var oX = this.position.x
        var oY = this.position.y
        this.position.x = this.position.x + this.velocity.x
        this.position.y = this.position.y + this.velocity.y
        var currActor = this.stage.getActor(this.position.x, this.position.y)
        if (currActor instanceof Obstacle) {
            console.log("Obstacle found")
            this.position.x = oX
            this.position.y = oY
            this.velocity.x = 0
            this.velocity.y = 0
        }

        if (currActor instanceof Health) {
            if (this.stage.player.playerHealth < 100) {
                this.stage.player.addHealth()
                console.log("Health found")
                if ("health" in this.stage.actions["remove"]) {
                    this.stage.actions["remove"]["health"].push(currActor)
                } else {
                    this.stage.actions["remove"]["health"] = [currActor]
                }
                this.stage.removeActor(currActor)
            }
        }

        if (this.position.x < 0) {
            this.position.x = 0
            this.velocity.x = Math.abs(this.velocity.x)
        }
        if (this.position.x > 2000) {
            this.position.x = this.stage.width
            this.velocity.x = -Math.abs(this.velocity.x)
        }
        if (this.position.y < 0) {
            this.position.y = 0
            this.velocity.y = Math.abs(this.velocity.y)
        }
        if (this.position.y > 2000) {
            this.position.y = this.stage.height
            this.velocity.y = -Math.abs(this.velocity.y)
        }
        this.intPosition()
    }

    intPosition() {
        this.x = Math.round(this.position.x)
        this.y = Math.round(this.position.y)
    }

    draw(context) {
        context.fillStyle = this.colour
        context.beginPath()
        context.fillRect(
            this.x - 25,
            this.y - 25,
            50,
            15 * (this.playerHealth / 2000)
        )
        context.arc(this.x, this.y, this.radius, 0, 2 * Math.PI, false)
        context.fill()
    }

    clamp(value, a, b) {
        if (value < a) {
            return a
        } else if (value > b) {
            return b
        }
        return value
    }

    addHealth() {
        this.playerHealth += 10
    }

    toJSON() {
        return {
            name: this.user,
            x: this.x,
            y: this.y,
            xvelocity: this.xvelocity,
            yvelocity: this.yvelocity,
            colour: this.colour,
            radius: this.radius,
            score: this.score,
            playerHealth: this.playerHealth,
            height: this.height,
            width: this.width,
        }
    }
}
