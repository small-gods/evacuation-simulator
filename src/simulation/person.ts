import { runInThisContext } from "vm"
import { substract, Vector, length } from "./utils"

export class Person {
    public sprite: Phaser.Physics.Arcade.Sprite
    public vision = 200
    public speed = 100

    public constructor(sprite: Phaser.Physics.Arcade.Sprite) {
        this.sprite = sprite
    }

    public get x(): number { return this.sprite.x }
    public get y(): number { return this.sprite.y }
    public get coordinates(): Vector { return { x: this.x, y: this.y } }


    public acceleration(object: Vector, arrowDirection: Vector = { x: 0, y: 0 }): Vector {
        const toArrow = substract(object, this.coordinates)
        toArrow.x /= length(toArrow)
        toArrow.y /= length(toArrow)
        return { x: (toArrow.x + arrowDirection.x * 2) * this.speed, y: (toArrow.y + arrowDirection.y * 2) * this.speed }
    }

    public accelerate(object: Vector, arrowDirection: Vector = { x: 0, y: 0 }){
        const acceleration = this.acceleration(object, arrowDirection)
        this.sprite.setAcceleration(acceleration.x, acceleration.y)
    }
}