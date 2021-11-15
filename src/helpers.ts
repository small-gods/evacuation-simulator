import * as Phaser from 'phaser'

export function getGameWidth (scene: Phaser.Scene): number {
    return scene.game.scale.width
}

export function getGameHeight (scene: Phaser.Scene): number{
    return scene.game.scale.height
}

export const isDesigner = document.URL.includes("designer");
