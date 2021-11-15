import * as Phaser from 'phaser'
import Scenes from './scenes'
import { isDesigner } from './helpers'

const content = document.querySelector('#content') as HTMLDivElement

const gameConfig: Phaser.Types.Core.GameConfig = {
    title: 'Sample',

    type: Phaser.AUTO,

    scale: {
        width: content.clientWidth,
        height: content.clientHeight,
    },

    scene: Scenes,

    physics: {
        default: 'arcade',
        arcade: {
            debug: isDesigner,
        },
    },

    parent: content,
    backgroundColor: '#f5f5f5',
}

export const game = new Phaser.Game(gameConfig)

window.addEventListener('resize', () => {
    game.scale.refresh()
})
