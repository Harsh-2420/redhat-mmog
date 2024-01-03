export class Pickup {
    constructor(id, stage, position, colour) {
        this.id = id
        this.stage = stage
        this.position = position
        this.colour = colour
    }

    step() {
        this.intPosition()
    }

    intPosition() {
        this.x = Math.round(this.position.x)
        this.y = Math.round(this.position.y)
    }

    draw(context) {
        context.drawImage(this.colour, this.x, this.y, 25, 25)
    }
}

export class Health extends Pickup {
    constructor(id, stage, position, colour) {
        super(id, stage, position, colour)
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
