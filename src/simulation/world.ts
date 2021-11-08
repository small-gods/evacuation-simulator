import { Arrow, Fire, GameObject, Wall, WallLocation } from "./objects";
import { Person } from "./person";
import { Direction, substract, distance, randomRange, length, Vector, directionVector } from "./utils";

const cellSize = 50

export type WorldJson = {
    actors?: Vector[],
    arrows?: { vec: Vector, dir: Direction }[],
    fires?: Vector[],
    exits?: Vector[],
    wallTops?: Vector[],
    wallLefts?: Vector[],
}

export class World {
    private actors: Person[] = []
    public arrows: Arrow[] = []
    private fires: Fire[] = []
    private exits: GameObject[] = []
    private wallTops: Wall[] = []
    private wallLefts: Wall[] = []

    public cells: Map<Vector, Fire> = new Map()

    private fireConstructor: (coords: Vector, size: Vector) => Phaser.Physics.Arcade.Sprite
    private escapeConstructor: (coords: Vector, size: Vector) => Phaser.Physics.Arcade.Sprite
    private arrowConstructor: (coords: Vector, direction: Direction) => Phaser.Physics.Arcade.Sprite
    private wallConstructor: (coords: Vector, size: Vector) => Phaser.Physics.Arcade.Sprite
    private personConstructor: (x: number, y: number, r: number) => Phaser.Physics.Arcade.Sprite
    private bounds: Vector

    public constructor(
        bounds: Vector,
        arrowConstructor: (coords: Vector, direction: Direction) => Phaser.Physics.Arcade.Sprite,
        personConstructor: (x: number, y: number, r: number) => Phaser.Physics.Arcade.Sprite,
        wallConstructor: (coords: Vector, size: Vector) => Phaser.Physics.Arcade.Sprite,
        fireConstructor: (coords: Vector, size: Vector) => Phaser.Physics.Arcade.Sprite,
        escapeConstructor: (coords: Vector, size: Vector) => Phaser.Physics.Arcade.Sprite,
        json: WorldJson = {},
    ) {
        this.bounds = bounds
        this.fireConstructor = fireConstructor
        this.escapeConstructor = escapeConstructor
        this.arrowConstructor = arrowConstructor
        this.wallConstructor = wallConstructor
        this.personConstructor = personConstructor

        if (json.actors)
            for (const actor of json.actors)
                this.spawn(actor.x, actor.y)
        if (json.arrows)
            for (const actor of json.arrows)
                this.addArrow(actor.vec, actor.dir)
        if (json.fires)
            for (const actor of json.fires)
                this.addFire({ x: actor.x, y: actor.y })
        if (json.exits)
            for (const actor of json.exits)
                this.addExit({ x: actor.x, y: actor.y })
        if (json.wallLefts)
            for (const actor of json.wallLefts)
                this.addWallLoc({ x: actor.x, y: actor.y }, 'Left')
        if (json.wallTops)
            for (const actor of json.actors)
                this.addWallLoc({ x: actor.x, y: actor.y }, 'Top')
        // const width = 4
        // const height = 4

        // for (let i = 0; i < width; i++) {
        //     this.addArrow({ x: 3 + 2 * i, y: 2 }, 'Right')
        //     this.addArrow({ x: 3 + 2 * i, y: 2 + 2 * height }, 'Left')
        // }

        // for (let i = 0; i < height; i++) {
        //     this.addArrow({ x: 2 + 2 * width, y: 3 + 2 * i }, 'Down')
        //     this.addArrow({ x: 2, y: 3 + 2 * i }, 'Up')
        // }

        // this.addExit({ x: 10, y: 10 })
    }

    public toJson(): WorldJson {
        return {
            actors: this.actors.map(actor => actor.coordinates),
            arrows: this.arrows.map(arrow => ({ vec: arrow.coordinates, dir: arrow.direction })),
            fires: this.actors.map(actor => actor.coordinates),
            exits: this.actors.map(actor => actor.coordinates),
            wallLefts: this.actors.map(actor => actor.coordinates),
            wallTops: this.actors.map(actor => actor.coordinates),
        }
    }

    public absoluteToCell(v: Vector): Vector {
        return {
            x: Math.round(v.x / cellSize), y: Math.round(v.y / cellSize)
        }
    }

    public delete(coordinates: Vector) {
        const cell = this.absoluteToCell(coordinates)
        this.fires = this.filterGameObjects(cell, this.fires)
        this.arrows = this.filterGameObjects(cell, this.arrows)
        this.exits = this.filterGameObjects(cell, this.exits)
        this.deleteWall(coordinates)
    }

    public spawnAll() {
        for (let i = 0; i < 25; i++) {
            const { x, y } = { x: randomRange(0, 500), y: randomRange(0, 500) }
            this.spawn(x, y)
        }
    }

    public spawn(x: number, y: number) {
        const sprite = this.personConstructor(x, y, 0)
        const person = new Person(sprite)
        this.actors.push(person)
    }

    public killAll() {
        this.actors.forEach(actor => actor.sprite.destroy())
        this.actors = []
    }

    private filterGameObjects<O extends GameObject>(cell: Vector, array: O[]): O[] {
        const toDelete = array.filter(v => (v.x === cell.x && v.y === cell.y))
        toDelete.forEach(object => {
            object.sprite.destroy()
        });
        return array.filter(v => !(v.x === cell.x && v.y === cell.y))
    }

    public deletePersonBySprite(sprite: Phaser.Types.Physics.Arcade.GameObjectWithBody) {
        this.actors = this.actors.filter(p => {
            if (p.sprite != sprite)
                return true
            p.sprite.destroy()
            return false
        })
    }

    public addWall(coordinates: Vector) {
        const { cell, loc } = this.getWallCell(coordinates)
        if (this.hasWallLoc(cell, loc))
            return
        this.addWallLoc(cell, loc)
    }

    private hasWallLoc(cell: Vector, loc: WallLocation) {
        if (loc === 'Top') {
            return this.wallTops.some(v => (v.x === cell.x && v.y === cell.y))
        } else {
            return this.wallLefts.some(v => (v.x === cell.x && v.y === cell.y))
        }
    }

    private addWallLoc(cell: Vector, loc: WallLocation) {
        if (loc === 'Top') {
            const sprite = this.wallConstructor({ x: cell.x * cellSize, y: cell.y * cellSize - cellSize / 2 }, { x: cellSize + 10, y: 10 })
            this.wallTops.push(new Wall(cell.x, cell.y, 'Top', sprite))
        } else {
            const sprite = this.wallConstructor({ x: cell.x * cellSize - cellSize / 2, y: cell.y * cellSize }, { x: 10, y: cellSize + 10 })
            this.wallLefts.push(new Wall(cell.x, cell.y, 'Left', sprite))
        }
    }

    public deleteWall(coordinates: Vector) {
        const { cell, loc } = this.getWallCell(coordinates)
        if (loc === 'Top') {
            this.wallTops = this.filterGameObjects(cell, this.wallTops)
        } else {
            this.wallLefts = this.filterGameObjects(cell, this.wallLefts)
        }
    }

    private getWallCell(coordinates: Vector): { cell: Vector, loc: WallLocation } {
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

    public addArrow(cell: Vector, direction: Direction) {
        if (this.arrows.some(v => (v.x === cell.x && v.y === cell.y)))
            return;

        const sprite = this.arrowConstructor({ x: cell.x * cellSize, y: cell.y * cellSize }, direction)
        const arrow = new Arrow(cell.x, cell.y, direction, sprite)
        this.arrows.push(arrow)
    }

    public addFire(cell: Vector) {
        const sprite = this.fireConstructor({ x: cell.x * cellSize, y: cell.y * cellSize }, { x: cellSize, y: cellSize })
        const fire = new Fire(cell.x, cell.y, sprite)
        this.fires.push(fire)
        this.cells.set(cell, fire)
    }

    public addExit(cell: Vector) {
        const sprite = this.escapeConstructor({ x: cell.x * cellSize, y: cell.y * cellSize }, { x: cellSize, y: cellSize })
        this.exits.push(new GameObject(cell.x, cell.y, sprite))
    }

    public tick() {
        for (const fire of this.fires) {
            const fireCell = fire.coordinates
            const growthDir = fire.grow(this.fires.length)
            if (growthDir === 'null')
                continue
            const dirVector = directionVector(growthDir)
            const growth = { x: fire.x + dirVector.x, y: fire.y + dirVector.y }
            if (growthDir === 'Up' && this.hasWallLoc(fireCell, 'Top'))
                continue
            if (growthDir === 'Down' && this.hasWallLoc({ ...fireCell, y: fireCell.y + 1 }, 'Top'))
                continue
            if (growthDir === 'Left' && this.hasWallLoc(fireCell, 'Left'))
                continue
            if (growthDir === 'Right' && this.hasWallLoc({ ...fireCell, x: fireCell.x + 1 }, 'Left'))
                continue
            if (!this.inBounds(growth) || this.cells.get(growth) !== undefined)
                continue
            this.addFire(growth)
        }
        for (let actor of this.actors) {
            const exitDistances = this.exits.map(arrow => (distance({ x: actor.x, y: actor.y }, { x: arrow.x * cellSize, y: arrow.y * cellSize })))
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

            const arrowDistances = this.arrows.map(arrow => (distance({ x: actor.x, y: actor.y }, { x: arrow.x * cellSize, y: arrow.y * cellSize })))
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