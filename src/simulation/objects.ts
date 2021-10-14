import { Direction, directionVector, Vector } from "./utils"

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