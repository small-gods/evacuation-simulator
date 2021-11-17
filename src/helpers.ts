import * as Phaser from 'phaser'
import protobuf = require('protobufjs');
import { encode } from 'querystring';

export function getGameWidth(scene: Phaser.Scene): number {
    return scene.game.scale.width
}

export function getGameHeight(scene: Phaser.Scene): number {
    return scene.game.scale.height
}

export function protobufToBase64(
    filename: (string | string[]),
    type: (string | string[]),
    message: { [k: string]: any },
    callback: (string) => void) {
    protobuf.load(filename, (err, root) => {
        if (err) throw err;
        const MessageType = root.lookupType(type);

        const errMsg = MessageType.verify(message);
        if (errMsg) throw Error(errMsg);

        const result = MessageType.create(message);
        const buffer = MessageType.encode(result).finish();
        callback(base64EncArr(buffer));
    });
}

export function protobufFromBase64(
    filename: (string | string[]),
    type: (string | string[]),
    message: string,
    callback: (any) => void) {
    protobuf.load(filename, (err, root) => {
        if (err) throw err;
        const MessageType = root.lookupType(type);
        const buffer = base64DecToArr(message);
        const source = MessageType.decode(buffer);
        var object = MessageType.toObject(source, { });
        callback(object);
    });
}

export const isDesigner = document.URL.includes("designer");


function b64ToUint6(nChr: number): number {
    return nChr > 64 && nChr < 91 ? nChr - 65
        : nChr > 96 && nChr < 123 ? nChr - 71
        : nChr > 47 && nChr < 58 ? nChr + 4
        : nChr === 43 ? 62
        : nChr === 47 ? 63 : 0;
}


function uint6ToB64(nUint6: number): number {
    return nUint6 < 26 ? nUint6 + 65
        : nUint6 < 52 ? nUint6 + 71
        : nUint6 < 62 ? nUint6 - 4
        : nUint6 === 62 ? 43
        : nUint6 === 63 ? 47 : 65;
}


export function base64DecToArr(sBase64: string, nBlocksSize?: number): Uint8Array {
        const sB64Enc = sBase64.replace(/[^A-Za-z0-9\+\/]/g, "");
        const nInLen = sB64Enc.length;
        const nOutLen = nBlocksSize ? Math.ceil((nInLen * 3 + 1 >> 2) / nBlocksSize) * nBlocksSize : nInLen * 3 + 1 >> 2;
        let taBytes = new Uint8Array(nOutLen);

    for (let nMod3, nMod4, nUint24 = 0, nOutIdx = 0, nInIdx = 0; nInIdx < nInLen; nInIdx++) {
        nMod4 = nInIdx & 3;
        nUint24 |= b64ToUint6(sB64Enc.charCodeAt(nInIdx)) << 6 * (3 - nMod4);
        if (nMod4 === 3 || nInLen - nInIdx === 1) {
        for (nMod3 = 0; nMod3 < 3 && nOutIdx < nOutLen; nMod3++, nOutIdx++) {
            taBytes[nOutIdx] = nUint24 >>> (16 >>> nMod3 & 24) & 255;
        }
        nUint24 = 0;

        }
    }

    return taBytes;
}


export function base64EncArr(aBytes: Uint8Array): string {
    let nMod3 = 2;
    let sB64Enc = "";

    for (let nLen = aBytes.length, nUint24 = 0, nIdx = 0; nIdx < nLen; nIdx++) {
        nMod3 = nIdx % 3;
        if (nIdx > 0 && (nIdx * 4 / 3) % 76 === 0) { sB64Enc += "\r\n"; }
            nUint24 |= aBytes[nIdx] << (16 >>> nMod3 & 24);
        if (nMod3 === 2 || aBytes.length - nIdx === 1) {
            sB64Enc += String.fromCharCode(uint6ToB64(nUint24 >>> 18 & 63), uint6ToB64(nUint24 >>> 12 & 63), uint6ToB64(nUint24 >>> 6 & 63), uint6ToB64(nUint24 & 63));
            nUint24 = 0;
        }
    }

    return sB64Enc.substr(0, sB64Enc.length - 2 + nMod3) + (nMod3 === 2 ? '' : nMod3 === 1 ? '=' : '==');
}
