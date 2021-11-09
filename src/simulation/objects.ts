import { Cell, Direction, directionVector, randomDirection, randomElement, Vector } from "./utils"
import { World } from "./world"

export class GameObject {
    public cell: Cell
    public sprite: Phaser.Physics.Arcade.Sprite

    public constructor(coordinates: Cell, sprite: Phaser.Physics.Arcade.Sprite) {
        this.cell = coordinates
        this.sprite = sprite
    }

    public get x(): number { return this.cell.x }
    public get y(): number { return this.cell.y }
}

export class Arrow extends GameObject {
    public direction: Direction

    public constructor(coordinates: Cell, direction: Direction, sprite: Phaser.Physics.Arcade.Sprite) {
        super(coordinates, sprite)
        this.direction = direction
    }

    public get directionVector(): Vector { return directionVector(this.direction) }
}

export class Fire extends GameObject {
    public constructor(coordinates: Cell, sprite: Phaser.Physics.Arcade.Sprite) {
        super(coordinates, sprite)
    }

    public tick(world: World) {
        if (Math.random() >= 0.01)
            return

        const possibleDirections: Direction[] = []

        const fireCell = this.cell
        if (!world.hasWallLoc(fireCell, 'Top'))
            possibleDirections.push('Up')
        if (!world.hasWallLoc({ ...fireCell, y: fireCell.y + 1 }, 'Top'))
            possibleDirections.push('Down')
        if (!world.hasWallLoc(fireCell, 'Left'))
            possibleDirections.push('Left')
        if (!world.hasWallLoc({ ...fireCell, x: fireCell.x + 1 }, 'Left'))
            possibleDirections.push('Right')

        const dirVector = directionVector(randomElement(possibleDirections))
        const growth = { x: this.x + dirVector.x, y: this.y + dirVector.y }
        if (!world.inBounds(growth) || world.fires.some(v => v.x === growth.x && v.y === growth.y))
            return

        world.addFire(growth)
    }
}

export type WallLocation = 'Top' | 'Left'

export class Wall extends GameObject {
    public location: WallLocation

    public constructor(coordinates: Cell, location: WallLocation, sprite: Phaser.Physics.Arcade.Sprite) {
        super(coordinates, sprite)
        this.location = location
    }

    public line(cellSize: number): { a: Vector, b: Vector } {
        if (this.location === 'Top') {
            const left = this.sprite.getLeftCenter()
            const right = this.sprite.getRightCenter()
            return { a: { x: left.x, y: this.sprite.y }, b: { x: right.x, y: this.sprite.y } }
        } else {
            const top = this.sprite.getTopCenter()
            const bottom = this.sprite.getBottomCenter()
            return { a: { x: this.sprite.x, y: top.y }, b: { x: this.sprite.x, y: bottom.y } }
        }
    }
}