import { Cell, Direction } from './utils'
import { WorldJson } from './world'

export function WorldJsonToIntArray(json: WorldJson): number[] {
    return [
        ...VectorArrayToIntArray(json.actors),
        ...ArrowsArrayToIntArray(json.arrows),
        ...VectorArrayToIntArray(json.fires),
        ...VectorArrayToIntArray(json.exits),
        ...VectorArrayToIntArray(json.wallTops),
        ...VectorArrayToIntArray(json.wallLefts),
    ]
}

export function WorldJsonFromIntArray(arr: number[]): WorldJson {
    const result: WorldJson = {}
    const iterator = { idx: 0 }

    result.actors = VectorArrayFromIntArray(arr, iterator)
    result.arrows = ArrowsArrayFromIntArray(arr, iterator)
    result.fires = VectorArrayFromIntArray(arr, iterator)
    result.exits = VectorArrayFromIntArray(arr, iterator)
    result.wallTops = VectorArrayFromIntArray(arr, iterator)
    result.wallLefts = VectorArrayFromIntArray(arr, iterator)

    return result
}

export function WorldJsonToBitsIntArray(json: WorldJson): number[] {
    return [
        ...VectorArrayToBitsIntArray(1, 10, json.actors),
        ...ArrowsArrayToIntArray(json.arrows),
        ...VectorArrayToBitsIntArray(3, 4, json.fires),
        ...VectorArrayToBitsIntArray(3, 4, json.exits),
        ...VectorArrayToBitsIntArray(3, 4, json.wallTops),
        ...VectorArrayToBitsIntArray(3, 4, json.wallLefts),
    ]
}

export function WorldJsonFromBitsIntArray(arr: number[]): WorldJson {
    const result: WorldJson = {}
    const iterator = { idx: 0 }

    result.actors = VectorArrayFromBitsIntArray(1, 10, arr, iterator)
    result.arrows = ArrowsArrayFromIntArray(arr, iterator)
    result.fires = VectorArrayFromBitsIntArray(3, 4, arr, iterator)
    result.exits = VectorArrayFromBitsIntArray(3, 4, arr, iterator)
    result.wallTops = VectorArrayFromBitsIntArray(3, 4, arr, iterator)
    result.wallLefts = VectorArrayFromBitsIntArray(3, 4, arr, iterator)

    return result
}

function VectorArrayToIntArray(arr?: { x: number; y: number }[]): number[] {
    let result: (number | number[])[] = []
    if (arr) {
        result.push(arr.length)
        arr.forEach(v => result.push([v.x, v.y]))
    } else result.push(0)
    return result.flat()
}

function ArrowsArrayToIntArray(arr?: { vec: Cell; dir: Direction }[]): number[] {
    let result: (number | number[])[] = []
    if (arr) {
        result.push(arr.length)
        arr.forEach(v => result.push([v.dir, v.vec.x, v.vec.y]))
    } else result.push(0)
    return result.flat()
}

function VectorArrayFromIntArray(arr: number[], iterator: { idx: number }): { x: number; y: number }[] {
    let result: { x: number; y: number }[] = []
    const len = arr[iterator.idx++]
    for (let i = 0; i < len; ++i) {
        result.push({
            x: arr[iterator.idx++],
            y: arr[iterator.idx++],
        })
    }
    return result
}

function ArrowsArrayFromIntArray(arr: number[], iterator: { idx: number }): { vec: Cell; dir: Direction }[] {
    let result: { vec: Cell; dir: Direction }[] = []
    const len = arr[iterator.idx++]
    for (let i = 0; i < len; ++i) {
        result.push({
            dir: arr[iterator.idx++],
            vec: {
                x: arr[iterator.idx++],
                y: arr[iterator.idx++],
            },
        })
    }
    return result
}

function zipXY(intSize: number, v: { x: number; y: number }, shift: number): number {
    return (v.x << (intSize + 2 * intSize * shift)) | (v.y << (2 * intSize * shift))
}

function getMask(bitsCount: number): number {
    let mask = 1
    for (let i = 0; i < bitsCount; ++i) mask *= 2
    return mask - 1
}

function unzipXY(intSize: number, container: number, shift: number): { x: number; y: number } {
    const mask = getMask(intSize)
    return {
        x: (container >> (intSize + 2 * intSize * shift)) & mask,
        y: (container >> (2 * intSize * shift)) & mask,
    }
}

function zipXYs(intSize: number, arr: { x: number; y: number }[]): number {
    return arr.reduce((int, v, shift) => int | zipXY(intSize, v, shift), 0)
}

function unzipXYs(intSize: number, container: number, lenght: number): { x: number; y: number }[] {
    return new Array(lenght).fill(0).map((_, i) => unzipXY(intSize, container, i))
}

function VectorArrayToBitsIntArray(batchSize: number, intSize: number, arr?: { x: number; y: number }[]): number[] {
    const result: number[] = []
    const n = batchSize
    if (arr) {
        result.push(arr.length)
        for (let i = 0; i < ((arr.length / n) | 0); ++i) {
            result.push(zipXYs(intSize, arr.slice(n * i, n * i + n)))
        }
        if (arr.length % n) {
            const tmp = arr.slice(arr.length - (arr.length % n))
            if (tmp.length != arr.length % n) {
                throw new Error(`${tmp.length}:${arr.length % n}`)
            }
            result.push(zipXYs(intSize, tmp))
        }
    } else result.push(0)
    return result
}

function VectorArrayFromBitsIntArray(
    batchSize: number,
    intSize: number,
    arr: number[],
    iterator: { idx: number },
): { x: number; y: number }[] {
    const result: { x: number; y: number }[] = []
    const len = arr[iterator.idx++]
    const n = batchSize
    for (let i = 0; i < ((len / n) | 0); ++i) {
        const value = arr[iterator.idx++]
        result.push(...unzipXYs(intSize, value, n))
    }
    if (len % n) {
        const value = arr[iterator.idx++]
        result.push(...unzipXYs(intSize, value, (len % n) as 1 | 2 | 3))
    }
    return result
}
