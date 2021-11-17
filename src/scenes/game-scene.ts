import { Direction, Vector } from '../simulation/utils'
import { cellSize, World, WorldJson } from '../simulation/world'
import { BodyFactory } from '../simulation/body-factory'
import { base64DecToArr, protobufFromBase64, protobufToBase64 } from '../helpers'

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
        const $counters = document.querySelector('.counters') as HTMLDivElement
        const countersTypes = ['actors', 'burned', 'escaped', 'arrows'] as const
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
        const debugGrid = this.add.grid(gridCenter, gridCenter, gridSize, gridSize, cellSize, cellSize, null, null, 0xFF00FF, 0.1)

        const actionButtons = document.querySelectorAll('.action-button')
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
                this.world.deletePersonBySprite(person)
                this.burned += 1
                counters.burned.textContent = this.burned + ''
            },
            person => {
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
                const url = new URL(window.location.href)
                const worldJson = this.world.toJson()
                protobufToBase64('assets/proto/world.proto', 'world.World', worldJson, str => {
                    url.searchParams.forEach((v, k) => url.searchParams.delete(k))
                    url.searchParams.set('buf', str)
                    url.pathname = url.pathname.replace('designer.html', '')
                    worldJsonText.value = url.toString()
                })
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
                    .catch()
            })
        })

        this.world = worldCreator({})
        const params = new URL(window.location.href).searchParams
        const levelParamData = params.get('data')
        const levelParamBuf = params.get('buf')

        if (levelParamData) this.world = worldCreator(JSON.parse(atob(levelParamData)))
        else if (levelParamBuf) {
            protobufFromBase64('assets/proto/world.proto', 'world.World', levelParamBuf, object => {
                this.world = worldCreator(object)
            })
        } else if (levelButtons.length > 0) (levelButtons[0] as HTMLElement).click()
    }

    public update(): void {
        this.world.tick()
    }
}

function makeCursorFromImg(img: HTMLImageElement, width = 32, height = width) {
    const canvas = document.createElement('canvas')
    canvas.height = canvas.width = 32
    const ctx = canvas.getContext('2d')
    ctx.drawImage(img, 0, 0, width, height)
    const cursorImg = canvas.toDataURL('image/png')
    return `url(${cursorImg}) ${width / 2} ${height / 2}, auto`
}
