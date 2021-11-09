import { GameObject } from './objects'
import { substract, Vector, length, distance, mul, randomRange } from './utils'
import { World } from './world'

export class Person {
    public sprite: Phaser.Physics.Arcade.Sprite
    public vision = 200
    public speed = 100

    public constructor(sprite: Phaser.Physics.Arcade.Sprite) {
        this.sprite = sprite
    }

    public get x(): number {
        return this.sprite.x
    }
    public get y(): number {
        return this.sprite.y
    }
    public get coordinates(): Vector {
        return { x: this.x, y: this.y }
    }

    public acceleration(object: Vector, arrowDirection: Vector = { x: 0, y: 0 }): Vector {
        const toArrow = substract(object, this.coordinates)
        toArrow.x /= length(toArrow)
        toArrow.y /= length(toArrow)
        return {
            x: (toArrow.x + arrowDirection.x * 2) * this.speed,
            y: (toArrow.y + arrowDirection.y * 2) * this.speed,
        }
    }

    public accelerate(object: Vector, arrowDirection: Vector = { x: 0, y: 0 }) {
        const acceleration = this.acceleration(object, arrowDirection)
        this.sprite.setAcceleration(acceleration.x, acceleration.y)
    }

    public tick(world: World) {
        const exit = this.findClosestObject(world.exits, world)
        if (exit) {
            this.accelerate(world.cellToVector(exit))
            return
        }

        const arrow = this.findClosestObject(world.arrows, world)
        if (arrow) {
            this.accelerate(world.cellToVector(arrow.cell), arrow.directionVector)
            return
        }

        this.sprite.setAcceleration(randomRange(-this.speed, this.speed), randomRange(-this.speed, this.speed))
    }

    private findClosestObject<O extends GameObject>(objects: O[], world: World): O | false {
        const objDistances = objects.map(obj => distance(this.coordinates, world.cellToVector(obj.cell)))

        let minExitDistance = Infinity
        let obj: O | null = null
        for (const i in objDistances) {
            if (world.collidesWithWall(world.cellToVector(objects[i].cell), this.coordinates)) {
                continue
            }
            if (minExitDistance > objDistances[i]) {
                minExitDistance = objDistances[i]
                obj = objects[i]
            }
        }

        return minExitDistance < this.vision && obj
    }
}
