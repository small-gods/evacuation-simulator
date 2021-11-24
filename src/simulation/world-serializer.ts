import { Cell, Direction } from "./utils";
import { WorldJson } from "./world";

function VectorArrayToIntArray(arr?: {x: number, y: number}[]): number[] {
    let result: (number | number[])[] = []
    if (arr) {
        result.push(arr.length)
        arr.forEach(v => result.push([v.x, v.y]));
    } else result.push(0);
    return result.flat();
}

function ArrowsArrayToIntArray(arr?: { vec: Cell; dir: Direction }[]): number[] {
    let result: (number | number[])[] = []
    if (arr) {
        result.push(arr.length)
        arr.forEach(v => result.push([v.dir, v.vec.x, v.vec.y]));
    } else result.push(0);
    return result.flat();
}

function VectorArrayFromIntArray(arr: number[], iterator: {idx: number}): {x: number, y: number}[] {
    let result: {x: number, y: number}[] = []
    const len = arr[iterator.idx++];
    for (let i = 0; i < len; ++i) {
        result.push({
            x: arr[iterator.idx++],
            y: arr[iterator.idx++]
        });
    }
    return result;
}

function ArrowsArrayFromIntArray(arr: number[], iterator: {idx: number}): { vec: Cell; dir: Direction }[] {
    let result: { vec: Cell; dir: Direction }[] = []
    const len = arr[iterator.idx++];
    for (let i = 0; i < len; ++i) {
        result.push({
            dir: arr[iterator.idx++],
            vec: {
                x: arr[iterator.idx++],
                y: arr[iterator.idx++]
            }
        });
    }
    return result;
}


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

export function WorldJsonFromIntArray(arr: number[]): WorldJson{
    const result: WorldJson = {};
    const iterator = { idx: 0 };

    result.actors = VectorArrayFromIntArray(arr, iterator);
    result.arrows = ArrowsArrayFromIntArray(arr, iterator);
    result.fires = VectorArrayFromIntArray(arr, iterator);
    result.exits = VectorArrayFromIntArray(arr, iterator);
    result.wallTops = VectorArrayFromIntArray(arr, iterator);
    result.wallLefts = VectorArrayFromIntArray(arr, iterator);
    
    return result;
}
