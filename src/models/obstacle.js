export class GameObject {
    constructor(id, stage, position, colour, health) {
        this.stage = stage
        this.id = id
        this.position = position
        this.colour = colour
        this.health = health
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

export class Obstacle extends GameObject {
    constructor(id, stage, position, colour, health, width, height) {
        super(id, stage, position, colour, health)
        this.width = width
        this.height = height
        this.intPosition()
    }

    draw(context) {
        var pattern = context.createPattern(this.colour, "repeat")
        context.fillStyle = pattern
        context.beginPath()
        context.fillRect(this.x, this.y, this.width, this.height)
        context.fill()
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
