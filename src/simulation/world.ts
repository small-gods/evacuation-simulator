import { Vector } from "matter";
import { Arrow } from "./objects";
import { Person } from "./person";
import { Direction, directionVector, substract } from "./utils";

export class World {
    public actors: Person[] = []
    public arrows: Arrow[] = []

    public constructor(circleConstructor: (x: number, y: number, r: number) => Phaser.Physics.Arcade.Sprite) {
        for (let i = 0; i < 10; i++) {
            const { x, y, r } = { x: randomRange(0, 500), y: randomRange(0, 500), r: 0 }
            const sprite = circleConstructor(x, y, r)
            const person = new Person(sprite)
            this.actors.push(person)
        }
        this.arrows = [
            new Arrow(200, 150, 'Right'),
            new Arrow(300, 150, 'Right'),
            new Arrow(400, 150, 'Right'),
            new Arrow(500, 150, 'Right'),

            new Arrow(600, 200, 'Down'),
            new Arrow(600, 300, 'Down'),
            new Arrow(600, 400, 'Down'),
            new Arrow(600, 500, 'Down'),

            new Arrow(200, 600, 'Left'),
            new Arrow(300, 600, 'Left'),
            new Arrow(400, 600, 'Left'),
            new Arrow(500, 600, 'Left'),

            new Arrow(150, 200, 'Up'),
            new Arrow(150, 300, 'Up'),
            new Arrow(150, 400, 'Up'),
            new Arrow(150, 500, 'Up'),
        ]
    }

    public tick() {
        for (let actor of this.actors) {
            const distances = this.arrows.map(arrow => (distance({ x: actor.x, y: actor.y }, { x: arrow.x, y: arrow.y })))
            let minDistance = distances[0];
            let arrow = this.arrows[0]
            for (let i in distances) {
                if (minDistance > distances[i]) {
                    minDistance = distances[i]
                    arrow = this.arrows[i]
                }
            }
            if (minDistance > actor.vision) {
                actor.sprite.setAcceleration(randomRange(-actor.speed, actor.speed), randomRange(-actor.speed, actor.speed))
                continue
            }
            const toArrow = substract(arrow.coordinates, actor.coordinates)
            toArrow.x /= length(toArrow)
            toArrow.y /= length(toArrow)
            const arrowDirection = arrow.directionVector
            actor.sprite.setAcceleration((toArrow.x + arrowDirection.x * 2) * actor.speed, (toArrow.y + arrowDirection.y * 2) * actor.speed)
            actor.sprite.setFriction(0.5, 0.5)
        }
    }
}

function distance(from: Vector, to: Vector): number {
    return Math.sqrt((from.x - to.x) ** 2 + (from.y - to.y) ** 2)
}

function length(vector: Vector): number {
    return distance({ x: 0, y: 0 }, vector)
}

function randomRange(from, to: number): number {
    return Math.random() * (to - from) + from
}

function randomInteger(from, to: number): number {
    return Math.floor(randomRange(from, to))
}

const directions = ['Up' as Direction, 'Down' as Direction, 'Left' as Direction, 'Right' as Direction]

function randomDirection(): Direction {
    return directions[randomInteger(0, 4)]
}