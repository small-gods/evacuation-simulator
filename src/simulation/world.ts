import { Arrow, Fire } from "./objects";
import { Person } from "./person";
import { Direction, substract, distance, randomRange, length, Vector } from "./utils";

const cellSize = 50

export class World {
    private actors: Person[] = []
    public arrows: Arrow[] = []
    private fires: Fire[] = []
    private exits: Vector[] = []

    public cells: Map<Vector, Fire> = new Map()

    private fireConstructor: (coords: Vector, size: Vector) => Phaser.Physics.Arcade.Sprite
    private escapeConstructor: (coords: Vector, size: Vector) => Phaser.Physics.Arcade.Sprite
    private bounds: Vector

    public constructor(
        bounds: Vector,
        personConstructor: (x: number, y: number, r: number) => Phaser.Physics.Arcade.Sprite,
        wallConstructor: (coords: Vector, size: Vector) => Phaser.Physics.Arcade.Sprite,
        fireConstructor: (coords: Vector, size: Vector) => Phaser.Physics.Arcade.Sprite,
        escapeConstructor: (coords: Vector, size: Vector) => Phaser.Physics.Arcade.Sprite,
    ) {
        this.bounds = bounds
        this.fireConstructor = fireConstructor
        this.escapeConstructor = escapeConstructor
        for (let i = 0; i < 25; i++) {
            const { x, y, r } = { x: randomRange(0, 500), y: randomRange(0, 500), r: 0 }
            const sprite = personConstructor(x, y, r)
            const person = new Person(sprite)
            this.actors.push(person)
        }

        wallConstructor({ x: 300, y: 200 }, { x: 10, y: 200 })
        wallConstructor({ x: 600, y: 500 }, { x: 10, y: 200 })
        wallConstructor({ x: 500, y: 600 }, { x: 200, y: 10 })

        const width = 4
        const height = 4

        for (let i = 0; i < width; i++) {
            this.addArrow({ x: 3 + 2 * i, y: 2 }, 'Right')
            this.addArrow({ x: 3 + 2 * i, y: 2 + 2 * height }, 'Left')
        }

        for (let i = 0; i < height; i++) {
            this.addArrow({ x: 2 + 2 * width, y: 3 + 2 * i }, 'Down')
            this.addArrow({ x: 2, y: 3 + 2 * i }, 'Up')
        }

        this.addFire({ x: 4, y: 4 })
        this.addExit({x: 10, y: 10})
    }

    public deletePersonBySprite(sprite: Phaser.Types.Physics.Arcade.GameObjectWithBody) {
        this.actors = this.actors.filter(p => {
            if (p.sprite != sprite)
                return true
            p.sprite.destroy()
            return false
        })
    }

    public addArrow(cell: Vector, direction: Direction) {
        this.arrows.push(new Arrow(cell.x * cellSize, cell.y * cellSize, direction))
    }

    public addFire(cell: Vector) {
        const fire = new Fire(cell.x, cell.y)
        this.fireConstructor({ x: fire.x * cellSize, y: fire.y * cellSize }, { x: cellSize, y: cellSize })
        this.fires.push(fire)
        this.cells.set(cell, fire)
    }

    public addExit(cell: Vector) {
        const escape = {x: cell.x * cellSize, y: cell.y * cellSize}
        this.escapeConstructor(escape, {x: cellSize, y: cellSize})
        this.exits.push(escape)
    }

    public tick() {
        for (const fire of this.fires) {
            console.log('fire' + fire)
            const growth = fire.grow(this.fires.length)
            if (growth === 'null' || !this.inBounds(growth) || this.cells.get(growth) !== undefined)
                continue
            this.addFire(growth)
        }
        for (let actor of this.actors) {
            const exitDistances = this.exits.map(arrow => (distance({ x: actor.x, y: actor.y }, { x: arrow.x, y: arrow.y })))
            let minExitDistance = exitDistances[0];
            let exit = this.exits[0]
            for (let i in exitDistances) {
                if (minExitDistance > exitDistances[i]) {
                    minExitDistance = exitDistances[i]
                    exit = this.exits[i]
                }
            }

            if (minExitDistance < actor.vision) {
                actor.accelerate(exit)
                continue
            }

            const arrowDistances = this.arrows.map(arrow => (distance({ x: actor.x, y: actor.y }, { x: arrow.x, y: arrow.y })))
            let minArrowDistance = arrowDistances[0];
            let arrow = this.arrows[0]
            for (let i in arrowDistances) {
                if (minArrowDistance > arrowDistances[i]) {
                    minArrowDistance = arrowDistances[i]
                    arrow = this.arrows[i]
                }
            }

            if (minArrowDistance > actor.vision) {
                actor.sprite.setAcceleration(randomRange(-actor.speed, actor.speed), randomRange(-actor.speed, actor.speed))
                continue
            }
            actor.accelerate(arrow.coordinates, arrow.directionVector)
        }
    }

    public inBounds(vector: Vector): boolean {
        return this.bounds.x >= vector.x && this.bounds.y >= vector.y && vector.y >= 0 && vector.x >= 0
    }
}