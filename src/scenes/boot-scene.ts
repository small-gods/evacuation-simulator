import { getGameWidth, getGameHeight } from '../helpers'

const sceneConfig: Phaser.Types.Scenes.SettingsConfig = {
    active: false,
    visible: false,
    key: 'Boot',
}

/**
 * The initial scene that loads all necessary assets to the game and displays a loading bar.
 */
export class BootScene extends Phaser.Scene {
    constructor() {
        super(sceneConfig)
    }

    public preload(): void {
        const halfWidth = getGameWidth(this) * 0.5
        const halfHeight = getGameHeight(this) * 0.5

        const progressBarHeight = 100
        const progressBarWidth = 400

        const progressBarContainer = this.add.rectangle(
            halfWidth,
            halfHeight,
            progressBarWidth,
            progressBarHeight,
            0x000000,
        )
        const progressBar = this.add.rectangle(
            halfWidth + 20 - progressBarContainer.width * 0.5,
            halfHeight,
            10,
            progressBarHeight - 20,
            0x888888,
        )

        const loadingText = this.add.text(halfWidth - 75, halfHeight - 100, 'Loading...').setFontSize(24)
        const percentText = this.add.text(halfWidth - 25, halfHeight, '0%').setFontSize(24)
        const assetText = this.add.text(halfWidth - 25, halfHeight + 100, '').setFontSize(24)

        this.load.on('progress', value => {
            progressBar.width = (progressBarWidth - 30) * value

            const percent = value * 100
            percentText.setText(`${percent}%`)
        })

        this.load.on('fileprogress', file => {
            assetText.setText(file.key)
        })

        this.load.on('complete', () => {
            loadingText.destroy()
            percentText.destroy()
            assetText.destroy()
            progressBar.destroy()
            progressBarContainer.destroy()

            this.scene.start('Game')
        })

        this.loadAssets()
    }

    /**
     * All assets that need to be loaded by the game (sprites, images, animations, tiles, music, etc)
     * should be added to this method. Once loaded in, the loader will keep track of them, indepedent of which scene
     * is currently active, so they can be accessed anywhere.
     */
    private loadAssets() {
        // Load sample assets

        // Source: Open Game Art
        this.load.image('man', 'assets/sprites/character.png')
        this.load.image('arrow-up', 'assets/sprites/arrow-up.png')
        this.load.image('arrow-down', 'assets/sprites/arrow-down.png')
        this.load.image('arrow-right', 'assets/sprites/arrow-right.png')
        this.load.image('arrow-left', 'assets/sprites/arrow-left.png')
        this.load.image('wall', 'assets/sprites/wall.png')
        this.load.image('fire', 'assets/sprites/fire.png')
        this.load.image('exit', 'assets/sprites/exit.png')
        if (new URL(window.location.href).searchParams.has('INSIDE'))
            this.load.spritesheet('man_animaited', 'assets/sprites/character_anim_inside.png', {
                frameWidth: 13 * 2,
                frameHeight: 23 * 2,
            })
        else
            this.load.spritesheet('man_animaited', 'assets/sprites/character_anim.png', {
                frameWidth: 13,
                frameHeight: 23,
            })
        this.load.spritesheet('fire_animaited', 'assets/sprites/fire_anim.png', { frameWidth: 60, frameHeight: 60 })

        const soundPath = name => `assets/sounds/${name}`
        this.load.audio('fire-new', ['new_fire.ogg', 'new_fire.mp3'].map(soundPath))
        this.load.audioSprite('exit', soundPath('exit.json'), ['exit.ogg'].map(soundPath))
        this.load.audioSprite('die', soundPath('die.json'), ['die.ogg'].map(soundPath))
    }
}
