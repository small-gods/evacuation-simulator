import { Scene } from "phaser";
import { Direction, Vector } from "./utils";

type Sprite = Phaser.Physics.Arcade.Sprite

export class BodyFactory {
    private peopleGroup: Phaser.GameObjects.Group
    private wallsGroup: Phaser.GameObjects.Group
    private physics: Phaser.Physics.Arcade.ArcadePhysics
    private burnCallback: (fire: Sprite, person: Sprite) => void
    private escapeCallback: (person: Sprite) => void

    public constructor(scene: Scene, burnCallback: (fire: Sprite, person: Sprite) => void, escapeCallback: (person: Sprite) => void) {
        this.physics = scene.physics
        this.peopleGroup = new Phaser.GameObjects.Group(scene);
        this.wallsGroup = new Phaser.GameObjects.Group(scene);

        this.physics.add.collider(this.peopleGroup, this.peopleGroup)
        this.physics.add.collider(this.peopleGroup, this.wallsGroup)

        this.burnCallback = burnCallback
        this.escapeCallback = escapeCallback
    }

    public arrow(coords: Vector, direction: Direction): Phaser.Physics.Arcade.Sprite {
        return this.physics.add.sprite(coords.x, coords.y, 'arrow-' + direction.toLowerCase())
    }
    public actor(x: number, y: number, r: number): Phaser.Physics.Arcade.Sprite {
        const sprite = this.physics.add.sprite(x, y, 'man');
        sprite.setMaxVelocity(100)
        sprite.body.bounce.set(1)
        sprite.body.setCollideWorldBounds(true);

        this.peopleGroup.add(sprite)
        return sprite
    }
    public wall({ x, y }, { x: w, y: h }): Phaser.Physics.Arcade.Sprite {
        const sprite = this.physics.add.staticSprite(x, y, 'wall');
        sprite.body.setSize(w, h)
        sprite.setScale(w / sprite.width, h / sprite.height)
        this.wallsGroup.add(sprite)
        return sprite
    }
    public fire({ x, y }, { x: w, y: h }): Phaser.Physics.Arcade.Sprite {
        const sprite = this.physics.add.sprite(x, y, 'fire');
        sprite.setScale(w / sprite.width, h / sprite.height)

        this.physics.add.overlap(sprite, this.peopleGroup, (fire, person) => this.burnCallback(fire as Sprite, person as Sprite))
        return sprite
    }
    public exit({ x, y }, { x: w, y: h }): Phaser.Physics.Arcade.Sprite {
        const sprite = this.physics.add.sprite(x, y, 'exit');
        sprite.setScale(w / sprite.width, h / sprite.height)

        this.physics.add.overlap(sprite, this.peopleGroup, (escape, person) => this.escapeCallback(person as Sprite))
        return sprite
    }
}