import { Direction, directionVector, randomDirection, Vector } from "./utils"

export class GameObject {
    public x: number
    public y: number
    public sprite: Phaser.Physics.Arcade.Sprite

    public constructor(x: number, y: number, sprite: Phaser.Physics.Arcade.Sprite) {
        this.x = x
        this.y = y
        this.sprite = sprite
    }

    public get coordinates(): Vector { return { x: this.x, y: this.y } }
}

export class Arrow extends GameObject {
    public direction: Direction

    public constructor(x: number, y: number, direction: Direction, sprite: Phaser.Physics.Arcade.Sprite) {
        super(x, y, sprite)
        this.direction = direction
    }

    public get directionVector(): Vector { return directionVector(this.direction) }
}

export class Fire extends GameObject {
    public constructor(x: number, y: number, sprite: Phaser.Physics.Arcade.Sprite) {
        super(x, y, sprite)
    }

    public grow(totalFires: number): Direction | 'null' {
        if (Math.random() >= 0.01 / Math.sqrt(totalFires))
            return 'null'

        const dir = randomDirection()
        return dir
    }
}

export type WallLocation = 'Top' | 'Left'

export class Wall extends GameObject {
    public location: WallLocation

    public constructor(x: number, y: number, location: WallLocation, sprite: Phaser.Physics.Arcade.Sprite) {
        super(x, y, sprite)
        this.location = location
    }
}