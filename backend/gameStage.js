var count = 0
var smgVel = 30
var arVel = 50
var enemySize = 15
var playerHealth = 100

var xMovement = 0
var yMovement = 0
var userScore = 0

function randint(n, min = 0) {
    return Math.round(Math.random() * (n - min) + min)
}
function rand(n) {
    return Math.random() * n
}

module.exports = class gameStage {
    constructor() {
        this.actors = [] // all actors on this stage (monsters, player, boxes, ...)
        this.numObstacles = 20
        this.numHealth = 20
        this.objectID = 0

        //Spawn Health
        for (var j = 0; j < this.numHealth; j++) {
            var gunX = randint(2000)
            var gunY = randint(2000)
            var gunPos = new Pair(gunX, gunY)
            var health = new Health(this.objectID, this, gunPos)
            this.objectID += 1
            if (!this.checkObstaclePlayerInitialCollision(health)) {
                this.addActor(health)
            }
        }
    }

    getCurrIndex() {
        return this.objectID
    }

    populateActors(gamejson) {
        this.actors = []

        for (const [key, value] of Object.entries(gamejson)) {
            if (key === "health") {
                this.populatesHealth(value)
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
            var healthActor = new Health(this, healthPos, healthImg)
            this.addActor(healthActor)
        }
    }

    populatePlayer(playerList) {
        for (var i = 0; i < playerList.length; i++) {
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
                otherPlayer.radius
            )
            this.addActor(otherPlayerActor)
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

    createObstacle(x, y, player) {
        console.log("Player brick left: ", player.brick)
        var obs = new Obstacle(
            this.getCurrIndex() + 1,
            new Pair(x, y),
            50,
            50,
            50
        )
        this.objectID += 1
        return obs
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
        return game
    }

    step() {
        if (this.player !== null) {
            console.log(this.numEnemies)
            for (var i = 0; i < this.actors.length; i++) {
                this.actors[i].step()
            }
        } else {
            console.log("game over")
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

class Pair {
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

class GameObject {
    constructor(id, position, health) {
        this.position = position
        this.health = health
        this.id = id
        this.intPosition()
    }

    step() {
        this.intPosition()
    }

    intPosition() {
        this.x = Math.round(this.position.x)
        this.y = Math.round(this.position.y)
    }
}

class Obstacle extends GameObject {
    constructor(id, position, health, width, height) {
        super(id, position, health)
        this.width = width
        this.height = height
        this.intPosition()
    }

    toJSON() {
        return {
            id: this.id,
            x: this.position.x,
            y: this.position.y,
            width: this.width,
            height: this.height,
            health: this.health,
        }
    }
}

class Pickup {
    constructor(id, stage, position) {
        this.stage = stage
        this.position = position
        this.id = id
    }

    step() {
        this.intPosition()
    }

    intPosition() {
        this.x = Math.round(this.position.x)
        this.y = Math.round(this.position.y)
    }
}

class Health extends Pickup {
    constructor(id, stage, position) {
        super(id, stage, position)
        this.width = 26
        this.height = 26
        this.x = 0
        this.y = 0
        this.intPosition()
    }

    toJSON() {
        return {
            id: this.id,
            x: this.x,
            y: this.y,
            width: this.width,
            height: this.height,
        }
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
        this.gun = null

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
            this.position.x = oX
            this.position.y = oY
            this.velocity.x = 0
            this.velocity.y = 0
        }

        if (currActor instanceof Health) {
            if (this.stage.player.playerHealth < 100) {
                this.stage.player.addHealth()
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

    takeDamage(damage) {
        this.playerHealth -= damage
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
