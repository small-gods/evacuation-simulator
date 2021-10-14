import { runInThisContext } from "vm"
import { Vector } from "./utils"

export class Person {
    public sprite: Phaser.Physics.Arcade.Sprite
    public vision = 300
    public speed = 100

    public constructor(sprite: Phaser.Physics.Arcade.Sprite) {
        this.sprite = sprite
    }

    public get x(): number { return this.sprite.x }
    public get y(): number { return this.sprite.y }
    public get coordinates(): Vector { return { x: this.x, y: this.y } }
}