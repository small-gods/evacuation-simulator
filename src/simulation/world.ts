import { Vector } from "matter";
import { Arrow } from "./objects";
import { Person } from "./person";
import { Direction, substract, Point } from "./utils";

const cellSize = 50

export class World {
    public actors: Person[] = []
    public arrows: Arrow[] = []
    public walls: object[] = []

    public constructor(
        circleConstructor: (x: number, y: number, r: number) => Phaser.Physics.Arcade.Sprite,
        wallConstructor: (coords: Point, size: Point) => Phaser.Physics.Arcade.Sprite,
    ) {
        for (let i = 0; i < 25; i++) {
            const { x, y, r } = { x: randomRange(0, 500), y: randomRange(0, 500), r: 0 }
            const sprite = circleConstructor(x, y, r)
            const person = new Person(sprite)
            this.actors.push(person)
        }

        wallConstructor({ x: 300, y: 200 }, { x: 10, y: 200 })
        wallConstructor({ x: 600, y: 500 }, { x: 10, y: 200 })
        wallConstructor({ x: 500, y: 600 }, { x: 200, y: 10 })

        const width = 4
        const height = 4

        for (let i = 0; i < width; i++) {
            this.addArrow(3 + 2 * i, 2, 'Right')
            this.addArrow(3 + 2 * i, 2 + 2 * height, 'Left')
        }

        for (let i = 0; i < height; i++) {
            this.addArrow(2 + 2 * width, 3 + 2 * i, 'Down')
            this.addArrow(2, 3 + 2 * i, 'Up')
        }
    }

    public addArrow(cellX: number, cellY: number, direction: Direction) {
        this.arrows.push(new Arrow(cellX * cellSize, cellY * cellSize, direction))
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