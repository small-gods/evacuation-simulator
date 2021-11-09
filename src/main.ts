import * as Phaser from 'phaser'
import Scenes from './scenes'

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
            debug: true,
        },
    },

    parent: content,
    backgroundColor: '#000000',
}

export const game = new Phaser.Game(gameConfig)

window.addEventListener('resize', () => {
    game.scale.refresh()
})
