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