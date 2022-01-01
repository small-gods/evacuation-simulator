import { GameObject } from './objects'
import { substract, Vector, length, distance, mul, randomRange } from './utils'
import { cellSize, World } from './world'

function norm(v: Vector, mul = 1): Vector {
    const l = length(v)
    return { x: (mul * v.x) / l, y: (mul * v.y) / l }
}

export class Person {
    public sprite: Phaser.Physics.Arcade.Sprite
    public vision = 200
    public speed = 100
    private text: Phaser.GameObjects.Text

    public constructor(sprite: Phaser.Physics.Arcade.Sprite) {
        this.sprite = sprite
        const texts = ['ААААА', 'ГОРИМ', 'ПОЖАР', 'ПУСТИТЕ', '!!!']
        this.text = sprite.scene.add.text(sprite.x, sprite.y, Phaser.Utils.Array.GetRandom(texts), {
            color: 'red',
            backgroundColor: '#FFFFFFAA',
            fontSize: '11px',
        })
        this.text.setVisible(false)
    }

    public destroy(): void {
        this.sprite.destroy()
        this.text.destroy()
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

    public accelerationOut(object: Vector, arrowDirection: Vector = { x: 0, y: 0 }): Vector {
        const toArrow = substract(this.coordinates, object)
        toArrow.x /= length(toArrow)
        toArrow.y /= length(toArrow)
        return {
            x: (toArrow.x + arrowDirection.x * 2) * this.speed,
            y: (toArrow.y + arrowDirection.y * 2) * this.speed,
        }
    }

    public accelerate(object: Vector, arrowDirection: Vector = { x: 0, y: 0 }) {
        const acceleration = this.acceleration(object, arrowDirection)
        return acceleration
    }

    public accelerateOut(object: Vector, arrowDirection: Vector = { x: 0, y: 0 }) {
        const acceleration = this.accelerationOut(object, arrowDirection)
        this.sprite.setAcceleration(acceleration.x, acceleration.y)
    }

    public tick(world: World): void {
        const fire = this.findClosestObject(world.fires, world)
        const vectors = new Array<Vector>()
        this.text.x = this.sprite.x
        this.text.y = this.sprite.y - this.sprite.height
        this.text.setVisible(fire !== false)
        const exit = this.findClosestObject(world.exits, world)
        if (exit) {
            vectors.push(norm(substract(world.cellToVector(exit), this.coordinates)))
            const { x, y } = norm(vectors.reduce((sum, v) => ({ x: sum.x + v.x, y: sum.y + v.y })))
            this.sprite.setAcceleration(x * this.speed, y * this.speed)
        }

        const arrow = this.findClosestObject(world.arrows, world)
        if (arrow) {
            const dist = distance(this.coordinates, world.cellToVector(arrow)) / cellSize
            vectors.push(norm(this.accelerate(world.cellToVector(arrow.cell), arrow.directionVector), 1 / (1 + dist)))
            const { x, y } = norm(vectors.reduce((sum, v) => ({ x: sum.x + v.x, y: sum.y + v.y })))
            this.sprite.setAcceleration(x * this.speed, y * this.speed)
            return
        }
        if (fire) {
            const dist = distance(this.coordinates, world.cellToVector(fire)) / cellSize
            vectors.push(norm(substract(this.coordinates, world.cellToVector(fire)), 4 / (2 + dist)))
        }
        vectors.push(norm({ x: randomRange(-this.speed, this.speed), y: randomRange(-this.speed, this.speed) }))
        const { x, y } = norm(vectors.reduce((sum, v) => ({ x: sum.x + v.x, y: sum.y + v.y })))
        this.sprite.setAcceleration(x * this.speed, y * this.speed)
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
