export type Direction = 'Up' | 'Down' | 'Left' | 'Right'

export type Vector = { x: number, y: number }

export function directionVector(direction: Direction): Vector {
    return direction === 'Up' ? { x: 0, y: -1 }
        : direction === 'Down' ? { x: 0, y: 1 }
            : direction === 'Left' ? { x: -1, y: 0 }
                : { x: 1, y: 0 }
}

export function substract(a: Vector, b: Vector): Vector {
    return { x: a.x - b.x, y: a.y - b.y }
}

export function distance(from: Vector, to: Vector): number {
    return Math.sqrt((from.x - to.x) ** 2 + (from.y - to.y) ** 2)
}

export function length(vector: Vector): number {
    return distance({ x: 0, y: 0 }, vector)
}

export function randomRange(from, to: number): number {
    return Math.random() * (to - from) + from
}

export function randomInteger(from, to: number): number {
    return Math.floor(randomRange(from, to))
}

const directions = ['Up' as Direction, 'Down' as Direction, 'Left' as Direction, 'Right' as Direction]

export function randomDirection(): Direction {
    return directions[randomInteger(0, 4)]
}