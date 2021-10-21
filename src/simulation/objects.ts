import { Direction, directionVector, randomDirection, Vector } from "./utils"

export class Arrow {
    public x: number
    public y: number
    public direction: Direction

    public constructor(x: number, y: number, direction: Direction) {
        this.x = x
        this.y = y
        this.direction = direction
    }

    public get coordinates(): Vector { return { x: this.x, y: this.y } }

    public get directionVector(): Vector { return directionVector(this.direction) }
}

export class Fire {
    public x: number
    public y: number

    public constructor(x: number, y: number) {
        this.x = x
        this.y = y
    }

    public grow(totalFires: number): Vector | 'null' {
        if (Math.random() >= 0.01 / Math.sqrt(totalFires))
            return 'null'

        const dir = directionVector(randomDirection())
        return { x: this.x + dir.x, y: this.y + dir.y }
    }
}