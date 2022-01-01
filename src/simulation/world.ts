import { json } from 'stream/consumers'
import { isDesigner } from '../helpers'
import { BodyFactory } from './body-factory'
import { Arrow, Fire, GameObject, Wall, WallLocation } from './objects'
import { Person } from './person'
import { Direction, randomRange, Vector, collide, Cell } from './utils'

export const cellSize = 50

export type WorldJson = {
    actors?: Vector[]
    arrows?: { vec: Cell; dir: Direction }[]
    fires?: Cell[]
    exits?: Cell[]
    wallTops?: Cell[]
    wallLefts?: Cell[]
}

export class World {
    public get potentialActorsCount(): number {
        return this.worldJson.actors?.length || 0
    }
    public actors: Person[] = []
    public arrows: Arrow[] = []
    public fires: Fire[] = []
    public exits: GameObject[] = []
    public wallTops: Wall[] = []
    public wallLefts: Wall[] = []

    private bodyFactory: BodyFactory
    private bounds: Vector
    private worldJson: WorldJson
    public runningSimulation = false

    public constructor(
        bounds: Vector,
        bodyFactory: BodyFactory,
        json: WorldJson,
        private readonly onUpdate: (state: World) => void,
    ) {
        this.bounds = bounds
        this.bodyFactory = bodyFactory
        this.worldJson = json
        this.reloadWorld(isDesigner, true)
    }

    private reloadWorld(spawnActors: boolean, spawnWorld) {
        const json = this.worldJson
        if (json.actors && spawnActors) for (const actor of json.actors) this.addActor(actor.x, actor.y)
        if (json.fires && spawnActors) for (const actor of json.fires) this.addFire({ x: actor.x, y: actor.y })
        if (json.arrows && spawnWorld) for (const actor of json.arrows) this.addArrow(actor.vec, actor.dir)
        if (json.exits && spawnWorld) for (const actor of json.exits) this.addExit({ x: actor.x, y: actor.y })
        if (json.wallLefts && spawnWorld)
            for (const actor of json.wallLefts) this.addWallLoc({ x: actor.x, y: actor.y }, 'Left')
        if (json.wallTops && spawnWorld)
            for (const actor of json.wallTops) this.addWallLoc({ x: actor.x, y: actor.y }, 'Top')
    }

    public runSimulation() {
        if (this.runningSimulation) return
        if (isDesigner) {
            this.worldJson = this.toJson()
        } else {
            this.reloadWorld(true, false)
        }
        this.runningSimulation = true
    }

    public stopSimulation() {
        if (!this.runningSimulation) return
        if (isDesigner) {
            this.deleteAll()
            this.reloadWorld(true, true)
        } else {
            this.killAll()
        }
        this.runningSimulation = false
    }

    public isRunning(): boolean {
        return this.runningSimulation
    }

    public toJson(): WorldJson {
        return {
            actors: this.actors.map(actor => actor.coordinates),
            arrows: this.arrows.map(arrow => ({ vec: arrow.cell, dir: arrow.direction })),
            fires: this.fires.map(actor => actor.cell),
            exits: this.exits.map(actor => actor.cell),
            wallLefts: this.wallLefts.map(actor => actor.cell),
            wallTops: this.wallTops.map(actor => actor.cell),
        }
    }

    // ** Deletion **

    public delete(coordinates: Vector) {
        if (this.runningSimulation) return

        const cell = this.absoluteToCell(coordinates)
        if (isDesigner) {
            this.fires = filterGameObjects(cell, this.fires)
            this.exits = filterGameObjects(cell, this.exits)
            this.deleteWall(coordinates)
        }
        this.arrows = filterGameObjects(cell, this.arrows)
        this.onUpdate(this)
    }

    public deleteAll() {
        for (const actor of this.actors) actor.destroy()
        this.actors = []
        for (const actor of this.arrows) actor.sprite.destroy()
        this.arrows = []
        for (const actor of this.fires) actor.sprite.destroy()
        this.fires = []
        for (const actor of this.exits) actor.sprite.destroy()
        this.exits = []
        for (const actor of this.wallLefts) actor.sprite.destroy()
        this.wallLefts = []
        for (const actor of this.wallTops) actor.sprite.destroy()
        this.wallTops = []
        this.onUpdate(this)
    }

    // ** Actors **

    public spawnManyActors(num = 25) {
        for (let i = 0; i < num; i++) {
            const { x, y } = {
                x: randomRange(0, this.bounds.x * cellSize),
                y: randomRange(0, this.bounds.y * cellSize),
            }
            this.addActor(x, y)
        }
    }

    public addActor(x: number, y: number) {
        const sprite = this.bodyFactory.actor(Math.floor(x), Math.floor(y), 0)
        const person = new Person(sprite)
        this.actors.push(person)
        this.onUpdate(this)
    }

    public killAll() {
        this.actors.forEach(actor => actor.destroy())
        this.fires.forEach(actor => actor.sprite.destroy())
        this.actors = []
        this.fires = []
        this.onUpdate(this)
    }

    public deletePersonBySprite(sprite: Phaser.Types.Physics.Arcade.GameObjectWithBody) {
        this.actors = this.actors.filter(p => {
            if (p.sprite != sprite) return true
            p.sprite.body.checkCollision.none = true
            p.sprite.scene.tweens.timeline({
                targets: p.sprite,
                duration: 500,
                tweens: [
                    {
                        scale: 0,
                    },
                ],
                onComplete: () => p.destroy(),
            })
            return false
        })
        this.onUpdate(this)
    }

    // ** Walls **

    public addWall(coordinates: Vector) {
        const { cell, loc } = this.getWallCell(coordinates)
        if (this.hasWallLoc(cell, loc)) return
        this.addWallLoc(cell, loc)
    }

    public hasWallLoc(cell: Cell, loc: WallLocation) {
        if (loc === 'Top') {
            return this.wallTops.some(v => v.x === cell.x && v.y === cell.y)
        } else {
            return this.wallLefts.some(v => v.x === cell.x && v.y === cell.y)
        }
    }

    public collidesWithWall(a: Vector, b: Vector): boolean {
        return (
            this.wallTops.some(wall => {
                const wallLine = wall.line(cellSize)
                return collide(a, b, wallLine.a, wallLine.b)
            }) ||
            this.wallLefts.some(wall => {
                const wallLine = wall.line(cellSize)
                return collide(a, b, wallLine.a, wallLine.b)
            })
        )
    }

    private addWallLoc(cell: Cell, loc: WallLocation) {
        if (loc === 'Top') {
            const sprite = this.bodyFactory.wall(
                { x: cell.x * cellSize, y: cell.y * cellSize - cellSize / 2 },
                { x: cellSize + 10, y: 10 },
            )
            this.wallTops.push(new Wall(cell, 'Top', sprite))
        } else {
            const sprite = this.bodyFactory.wall(
                { x: cell.x * cellSize - cellSize / 2, y: cell.y * cellSize },
                { x: 10, y: cellSize + 10 },
            )
            this.wallLefts.push(new Wall(cell, 'Left', sprite))
        }
    }

    public deleteWall(coordinates: Vector) {
        const { cell, loc } = this.getWallCell(coordinates)
        if (loc === 'Top') {
            this.wallTops = filterGameObjects(cell, this.wallTops)
        } else {
            this.wallLefts = filterGameObjects(cell, this.wallLefts)
        }
    }

    private getWallCell(coordinates: Vector): { cell: Cell; loc: WallLocation } {
        const inCellX = (coordinates.x - cellSize / 2) % cellSize
        const inCellY = (coordinates.y - cellSize / 2) % cellSize
        const cell = this.absoluteToCell(coordinates)
        if (inCellX > inCellY) {
            if (cellSize - inCellY > inCellX) {
                return { cell, loc: 'Top' }
            } else {
                return { cell: { x: cell.x + 1, y: cell.y }, loc: 'Left' }
            }
        } else {
            if (cellSize - inCellY > inCellX) {
                return { cell, loc: 'Left' }
            } else {
                return { cell: { x: cell.x, y: cell.y + 1 }, loc: 'Top' }
            }
        }
    }

    // ** Arrow **

    public addArrow(cell: Cell, direction: Direction) {
        const oldArrowIndex = this.arrows.findIndex(v => v.x === cell.x && v.y === cell.y)
        const sprite = this.bodyFactory.arrow({ x: cell.x * cellSize, y: cell.y * cellSize }, direction)
        const arrow = new Arrow(cell, direction, sprite)
        if (oldArrowIndex != -1) {
            this.arrows[oldArrowIndex].sprite.destroy()
            this.arrows[oldArrowIndex] = arrow
        } else {
            this.arrows.push(arrow)
            this.onUpdate(this)
        }
    }

    // ** Fire **

    public addFire(cell: Cell) {
        const sprite = this.bodyFactory.fire(
            { x: cell.x * cellSize, y: cell.y * cellSize },
            { x: cellSize, y: cellSize },
        )
        const fire = new Fire(cell, sprite)
        this.fires.push(fire)
    }

    // ** Exit **

    public addExit(cell: Cell) {
        const sprite = this.bodyFactory.exit(
            { x: cell.x * cellSize, y: cell.y * cellSize },
            { x: cellSize, y: cellSize },
        )
        this.exits.push(new GameObject(cell, sprite))
    }

    public tick() {
        if (!this.isRunning()) return
        for (const fire of this.fires) {
            fire.tick(this)
        }
        for (const actor of this.actors) {
            actor.tick(this)
        }
    }

    public absoluteToCell(v: Vector): Cell {
        return {
            x: Math.round(v.x / cellSize),
            y: Math.round(v.y / cellSize),
        }
    }

    public cellToVector(v: Cell): Vector {
        return {
            x: Math.round(v.x * cellSize),
            y: Math.round(v.y * cellSize),
        }
    }

    public inBounds(vector: Vector): boolean {
        return this.bounds.x >= vector.x && this.bounds.y >= vector.y && vector.y > 0 && vector.x > 0
    }
}

function filterGameObjects<O extends GameObject>(cell: Cell, array: O[]): O[] {
    const toDelete = array.filter(v => v.x === cell.x && v.y === cell.y)
    toDelete.forEach(object => {
        object.sprite.destroy()
    })
    return array.filter(v => !(v.x === cell.x && v.y === cell.y))
}
