import { Scene } from 'phaser'
import { Direction, Vector } from './utils'

type Sprite = Phaser.Physics.Arcade.Sprite

export class BodyFactory {
    private peopleGroup: Phaser.GameObjects.Group
    private wallsGroup: Phaser.GameObjects.Group
    private physics: Phaser.Physics.Arcade.ArcadePhysics
    private burnCallback: (fire: Sprite, person: Sprite) => void
    private escapeCallback: (person: Sprite) => void

    public constructor(
        scene: Scene,
        burnCallback: (fire: Sprite, person: Sprite) => void,
        escapeCallback: (person: Sprite) => void,
    ) {
        this.physics = scene.physics
        this.peopleGroup = new Phaser.GameObjects.Group(scene)
        this.wallsGroup = new Phaser.GameObjects.Group(scene)

        this.physics.add.collider(this.peopleGroup, this.peopleGroup)
        this.physics.add.collider(this.peopleGroup, this.wallsGroup)

        this.burnCallback = burnCallback
        this.escapeCallback = escapeCallback
    }

    public arrow(coords: Vector, direction: Direction): Phaser.Physics.Arcade.Sprite {
        return this.physics.add.sprite(coords.x, coords.y, 'arrow-' + Direction[direction].toLowerCase())
    }
    public actor(x: number, y: number, r: number): Phaser.Physics.Arcade.Sprite {
        const sprite = this.physics.add.sprite(x, y, 'man')
        sprite.play({ key: 'run', repeat: -1, startFrame: (Math.random() * 10) | 0, frameRate: 4 })
        sprite.setMaxVelocity(50)
        sprite.body.bounce.set(1)
        sprite.body.setCollideWorldBounds(true)

        this.peopleGroup.add(sprite)
        return sprite
    }
    public wall({ x, y }, { x: w, y: h }): Phaser.Physics.Arcade.Sprite {
        const sprite = this.physics.add.staticSprite(x, y, 'wall')
        sprite.body.setSize(w, h)
        sprite.setScale(w / sprite.width, h / sprite.height)
        this.wallsGroup.add(sprite)
        return sprite
    }
    public fire({ x, y }, { x: w, y: h }): Phaser.Physics.Arcade.Sprite {
        const sprite = this.physics.add.sprite(x, y, 'fire')
        sprite.setScale(0)
        sprite.play({
            key: 'fire',
            repeat: -1,
            startFrame: Phaser.Math.RND.between(0, 4),
            frameRate: Phaser.Math.RND.between(8, 10),
        })
        this.physics.scene.sound.play('fire-new', { volume: Phaser.Math.RND.realInRange(0.1, 0.2) })
        this.physics.scene.tweens.timeline({
            targets: sprite,
            duration: Phaser.Math.RND.between(400, 1000),
            tweens: [
                {
                    scaleX: w / sprite.width,
                    scaleY: h / sprite.height,
                },
            ],
        })
        this.physics.add.overlap(sprite, this.peopleGroup, (fire, person) => {
            this.burnCallback(fire as Sprite, person as Sprite)
        })
        return sprite
    }
    public exit({ x, y }, { x: w, y: h }): Phaser.Physics.Arcade.Sprite {
        const sprite = this.physics.add.sprite(x, y, 'exit')
        sprite.setScale(w / sprite.width, h / sprite.height)

        this.physics.add.overlap(sprite, this.peopleGroup, (escape, person) => {
            this.escapeCallback(person as Sprite)
        })
        return sprite
    }
}
