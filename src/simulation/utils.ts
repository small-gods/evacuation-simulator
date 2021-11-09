export type Direction = 'Up' | 'Down' | 'Left' | 'Right'

export type Vector = { x: number; y: number; type?: 'Vector' }

export type Cell = { x: number; y: number; type?: 'Cell' }

export function directionVector(direction: Direction): Vector {
    return direction === 'Up'
        ? { x: 0, y: -1 }
        : direction === 'Down'
        ? { x: 0, y: 1 }
        : direction === 'Left'
        ? { x: -1, y: 0 }
        : { x: 1, y: 0 }
}

export function substract(a: Vector, b: Vector): Vector {
    return { x: a.x - b.x, y: a.y - b.y }
}

export function mul(a: Vector, b: number): Vector {
    return { x: a.x * b, y: a.y * b }
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

export function randomElement<T>(array: T[]): T {
    return array[randomInteger(0, array.length)]
}

const directions = ['Up' as Direction, 'Down' as Direction, 'Left' as Direction, 'Right' as Direction]

export function randomDirection(): Direction {
    return randomElement(directions)
}

export function collide(a1: Vector, b1: Vector, a2: Vector, b2: Vector): boolean {
    const x1 = a1.x
    const x2 = b1.x
    const x3 = a2.x
    const x4 = b2.x
    const y1 = a1.y
    const y2 = b1.y
    const y3 = a2.y
    const y4 = b2.y
    const a_dx = x2 - x1
    const a_dy = y2 - y1
    const b_dx = x4 - x3
    const b_dy = y4 - y3
    const s = (-a_dy * (x1 - x3) + a_dx * (y1 - y3)) / (-b_dx * a_dy + a_dx * b_dy)
    const t = (+b_dx * (y1 - y3) - b_dy * (x1 - x3)) / (-b_dx * a_dy + a_dx * b_dy)
    return s >= 0 && s <= 1 && t >= 0 && t <= 1
}
