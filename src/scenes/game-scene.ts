import { Direction, Vector } from '../simulation/utils'
import { cellSize, World, WorldJson } from '../simulation/world'
import { BodyFactory } from '../simulation/body-factory'
import { base64DecToArr, protobufFromBase64, protobufToBase64, protobufToBase64Promise } from '../helpers'
import {
    WorldJsonFromIntArray,
    WorldJsonToIntArray,
    WorldJsonFromBitsIntArray,
    WorldJsonToBitsIntArray,
} from '../simulation/world-serializer'

const sceneConfig: Phaser.Types.Scenes.SettingsConfig = {
    active: false,
    visible: false,
    key: 'Game',
}

type Unpacked<T> = T extends ReadonlyArray<infer U> ? U : unknown

export class GameScene extends Phaser.Scene {
    private world: World

    private burned = 0
    private escaped = 0

    constructor() {
        super(sceneConfig)
    }

    buttonEvents = {
        actor: (p: Vector) => {
            this.world.addActor(p.x, p.y)
        },
        'arrow-right': (p: Vector) => {
            this.world.addArrow(this.world.absoluteToCell(p), Direction.RIGHT)
        },
        'arrow-left': (p: Vector) => {
            this.world.addArrow(this.world.absoluteToCell(p), Direction.LEFT)
        },
        'arrow-up': (p: Vector) => {
            this.world.addArrow(this.world.absoluteToCell(p), Direction.UP)
        },
        'arrow-down': (p: Vector) => {
            this.world.addArrow(this.world.absoluteToCell(p), Direction.DOWN)
        },
        exit: (p: Vector) => {
            this.world.addExit(this.world.absoluteToCell(p))
        },
        wall: (p: Vector) => {
            this.world.addWall(p)
        },
        fire: (p: Vector) => {
            this.world.addFire(this.world.absoluteToCell(p))
        },
        delete: (p: Vector) => {
            this.world.delete(p)
        },
    }

    public create(): void {
        this.sound.add('fire-new')
        const $counters = document.querySelector('.counters') as HTMLDivElement
        const countersTypes = ['actors', 'burned', 'escaped', 'arrows'] as const
        const soundVolume = document.createElement('input')
        soundVolume.title = 'sound'
        soundVolume.type = 'range'
        soundVolume.min = '0'
        soundVolume.max = '100'
        soundVolume.value = '50'
        soundVolume.addEventListener('input', () => {
            this.sound.volume = parseFloat(soundVolume.value) / 50
        })
        const soundLable = document.createElement('label')
        soundLable.textContent = 'Sound: '
        soundLable.appendChild(soundVolume)
        document.body.append(soundLable)
        const counters = Object.fromEntries(
            countersTypes.map(counter => {
                const dom = document.createElement('div')
                dom.className = `counter ${counter}`
                dom.innerText = `0`
                $counters.appendChild(dom)
                return [counter, dom]
            }),
        ) as Record<Unpacked<typeof countersTypes>, HTMLDivElement>

        const gridCenter = (cellSize * 15) / 2
        const gridSize = cellSize * 16
        const debugGrid = this.add.grid(
            gridCenter,
            gridCenter,
            gridSize,
            gridSize,
            cellSize,
            cellSize,
            null,
            null,
            0xff00ff,
            0.1,
        )

        const actionButtons = document.querySelectorAll('.action-button')
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        let onButtonAction = (p: Vector) => {}
        let lastCursor = ''
        actionButtons.forEach(button => {
            const type = button.getAttribute('data-object')
            if (type === 'kill-all') {
                button.addEventListener('click', () => {
                    this.world.stopSimulation()
                    document.body.style.cursor = lastCursor
                    debugGrid.visible = true
                })
                return
            } else if (type === 'spawn-all') {
                button.addEventListener('click', () => {
                    document.body.style.cursor = ``
                    this.burned = 0
                    this.escaped = 0
                    counters.burned.textContent = this.burned + ''
                    counters.escaped.textContent = this.escaped + ''
                    debugGrid.visible = false
                    this.world.runSimulation()
                })
                return
            } else if (!(type in this.buttonEvents)) {
                return
            }
            const callback = this.buttonEvents[type]
            const img = button.querySelector('img')
            const cursorImg = makeCursorFromImg(img, 32)
            button.addEventListener('click', () => {
                onButtonAction = callback
                lastCursor = cursorImg
                if (!this.world.isRunning()) document.body.style.cursor = lastCursor
            })
        })

        const content = document.querySelector('#content')
        content.addEventListener('click', (e: MouseEvent) => {
            if (this.world.isRunning()) return
            const rect = content.getBoundingClientRect()
            onButtonAction({ x: e.x - rect.x, y: e.y - rect.y })
        })

        this.anims.create({ key: 'run', frames: this.anims.generateFrameNumbers('man_animaited', {}), frameRate: 16 })
        this.anims.create({ key: 'fire', frames: this.anims.generateFrameNumbers('fire_animaited', {}), frameRate: 4 })

        const bodyFactory = new BodyFactory(
            this,
            (fire, person) => {
                this.sound.playAudioSprite('die', Phaser.Math.RND.between(0, 7).toString(), { volume: 0.5 })
                this.world.deletePersonBySprite(person)
                this.burned += 1
                counters.burned.textContent = this.burned + ''
            },
            person => {
                this.sound.playAudioSprite('exit', Phaser.Math.RND.between(0, 3).toString(), { volume: 0.4 })
                this.world.deletePersonBySprite(person)
                this.escaped += 1
                counters.escaped.textContent = this.escaped + ''
            },
        )

        const worldCreator = (json: WorldJson) =>
            new World({ x: 13, y: 13 }, bodyFactory, json, world => {
                counters.arrows.innerHTML = `${world.arrows.length}/&#8734`
                counters.actors.textContent = `${world.actors.length}/${world.potentialActorsCount}`
            })

        const loadJsonButton = document.querySelector('#worldjson-load')
        const saveJsonButton = document.querySelector('#worldjson-save')
        const getLinkButton = document.querySelector('#worldjson-get-link')
        const clipboardLinkButton = document.querySelector('#worldjson-copy-link')
        const openLinkButton = document.querySelector('#worldjson-open-link')
        const setLinkButton = document.querySelector('#worldjson-active-link')

        const worldJsonText = document.querySelector('#worldjson') as HTMLInputElement
        if (loadJsonButton)
            loadJsonButton.addEventListener('click', () => {
                console.log(JSON.parse(worldJsonText.value))
                this.world.deleteAll()
                this.world = worldCreator(JSON.parse(worldJsonText.value))
            })
        if (saveJsonButton)
            saveJsonButton.addEventListener('click', () => {
                worldJsonText.value = JSON.stringify(this.world.toJson())
            })
        if (getLinkButton)
            getLinkButton.addEventListener('click', () => {
                this.getLevelUrl().then(url => {
                    worldJsonText.value = url
                    worldJsonText.focus()
                    worldJsonText.setSelectionRange(0, worldJsonText.value.length)
                })
            })
        if (clipboardLinkButton)
            clipboardLinkButton.addEventListener('click', () => {
                this.getLevelUrl()
                    .then(url => navigator.clipboard.writeText(url))
                    .then(() => {
                        clipboardLinkButton.classList.toggle('designer-button_success', true)
                        setTimeout(() => clipboardLinkButton.classList.toggle('designer-button_success', false), 1000)
                    })
                    .catch(err => {
                        console.error(err)
                        clipboardLinkButton.classList.toggle('designer-button_failed', true)
                        setTimeout(() => clipboardLinkButton.classList.toggle('designer-button_failed', false), 1000)
                    })
            })
        if (openLinkButton)
            openLinkButton.addEventListener('click', () => {
                this.getLevelUrl().then(url => {
                    const a = document.createElement('a')
                    a.href = url
                    a.target = '_blank'
                    a.click()
                })
            })
        if (setLinkButton)
            setLinkButton.addEventListener('click', () => {
                this.getLevelUrl('designer').then(url => window.history.pushState(undefined, '', url))
            })

        const levelButtons = document.querySelectorAll('.level-button')
        levelButtons.forEach((button, i) => {
            const url = button.getAttribute('data-object')
            button.addEventListener('click', () => {
                fetch(url)
                    .then(resp => {
                        return resp.json()
                    })
                    .then(resp => {
                        this.world.deleteAll()
                        this.world = worldCreator(resp)
                    })
            })
        })

        this.world = worldCreator({})
        const params = new URL(window.location.href).searchParams
        const levelParamData = params.get('data')
        const levelParamBuf = params.get('buf')
        const levelParamBin = params.get('bin')
        const levelParamBinBit = params.get('bit')

        if (levelParamData) this.world = worldCreator(JSON.parse(atob(levelParamData)))
        else if (levelParamBuf) {
            protobufFromBase64('assets/proto/world.proto', 'world.World', levelParamBuf, object => {
                this.world = worldCreator(object)
            })
        } else if (levelParamBin) {
            protobufFromBase64('assets/proto/world.proto', 'world.Blob', levelParamBin, object => {
                this.world = worldCreator(WorldJsonFromIntArray(object.data))
            })
        } else if (levelParamBinBit) {
            protobufFromBase64('assets/proto/world.proto', 'world.Blob', levelParamBinBit, object => {
                this.world = worldCreator(WorldJsonFromBitsIntArray(object.data))
            })
        } else if (levelButtons.length > 0) (levelButtons[0] as HTMLElement).click()
    }

    private getLevelUrl(mode: 'designer' | 'game' = 'game') {
        const worldJson = this.world.toJson()
        const intArr = WorldJsonToBitsIntArray(worldJson)
        return protobufToBase64Promise('assets/proto/world.proto', 'world.Blob', { data: intArr }).then(lvl =>
            toLevelUrl(mode, 'bit', lvl),
        )
    }

    public update(): void {
        this.world.tick()
    }
}

function toLevelUrl(mode: 'designer' | 'game', paramName: string, lvl: string): string {
    const url = new URL(window.location.href)
    url.searchParams.forEach((v, k) => url.searchParams.delete(k))
    url.searchParams.set(paramName, lvl)
    if (mode === 'game') url.pathname = url.pathname.replace('designer.html', '')
    return url.toString()
}

function makeCursorFromImg(img: HTMLImageElement, width = 32, height = width) {
    const canvas = document.createElement('canvas')
    canvas.height = canvas.width = 32
    const ctx = canvas.getContext('2d')
    ctx.drawImage(img, 0, 0, width, height)
    const cursorImg = canvas.toDataURL('image/png')
    return `url(${cursorImg}) ${width / 2} ${height / 2}, auto`
}
