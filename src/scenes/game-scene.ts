import { Vector } from '../simulation/utils'
import { World, WorldJson } from '../simulation/world'
import { BodyFactory } from '../simulation/body-factory'

const sceneConfig: Phaser.Types.Scenes.SettingsConfig = {
    active: false,
    visible: false,
    key: 'Game',
}

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
            this.world.addArrow(this.world.absoluteToCell(p), 'Right')
        },
        'arrow-left': (p: Vector) => {
            this.world.addArrow(this.world.absoluteToCell(p), 'Left')
        },
        'arrow-up': (p: Vector) => {
            this.world.addArrow(this.world.absoluteToCell(p), 'Up')
        },
        'arrow-down': (p: Vector) => {
            this.world.addArrow(this.world.absoluteToCell(p), 'Down')
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
        const burnedCounter = document.querySelector('#burned-counter') as HTMLDivElement
        const escapedCounter = document.querySelector('#escaped-counter') as HTMLDivElement

        const actionButtons = document.querySelectorAll('.action-button')
        let onButtonAction = (p: Vector) => { }
        actionButtons.forEach(button => {
            const type = button.getAttribute('data-object')
            if (type === 'kill-all') {
                button.addEventListener('click', () => {
                    this.world.stopSimulation()
                })
                return
            } else if (type === 'spawn-all') {
                button.addEventListener('click', () => {
                    this.burned = 0;
                    this.escaped = 0;
                    burnedCounter.textContent = this.burned + ''
                    escapedCounter.textContent = this.escaped + ''
                    this.world.runSimulation()
                })
                return
            } else if (!(type in this.buttonEvents)) {
                return
            }
            const callback = this.buttonEvents[type]
            button.addEventListener('click', () => {
                onButtonAction = callback
            })
        })

        const content = document.querySelector('#content')
        content.addEventListener('click', (e: MouseEvent) => {
            if (this.world.isRunning()) return;
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
                burnedCounter.textContent = this.burned + ''
            },
            person => {
                this.world.deletePersonBySprite(person)
                this.escaped += 1
                escapedCounter.textContent = this.escaped + ''
            },
        )

        const worldCreator = (json: WorldJson) =>
            new World({ x: 13, y: 13 }, bodyFactory, json)

        const loadJsonButton = document.querySelector('#worldjson-load')
        const saveJsonButton = document.querySelector('#worldjson-save')
        const getLinkButton = document.querySelector('#worldjson-get-link')
        
        const worldJsonText = document.querySelector('#worldjson') as HTMLInputElement
        if (loadJsonButton) loadJsonButton.addEventListener('click', () => {
            console.log(JSON.parse(worldJsonText.value))
            this.world.deleteAll()
            this.world = worldCreator(JSON.parse(worldJsonText.value))
        })
        if (saveJsonButton) saveJsonButton.addEventListener('click', () => {
            worldJsonText.value = JSON.stringify(this.world.toJson())
        })
        if (getLinkButton) getLinkButton.addEventListener('click', () => {
            const url = new URL(window.location.href);
            url.searchParams.set("data", btoa(JSON.stringify(this.world.toJson())));
            url.pathname = url.pathname.replace("designer.html", "");
            worldJsonText.value = url.toString()
        })

        const levelButtons = document.querySelectorAll('.level-button');
        levelButtons.forEach((button, i) => {
            const url = button.getAttribute('data-object')
            button.addEventListener('click', () => {
                fetch(url)
                    .then(resp => {
                        return resp.json();
                    })
                    .then(resp => {
                        this.world.deleteAll()
                        this.world = worldCreator(resp)
                    })
                    .catch();
            })
        })

        const params = (new URL(window.location.href)).searchParams;
        const levelParamData = params.get("data");
        if (levelParamData)
            this.world = worldCreator(JSON.parse(atob(levelParamData)))
        else if(levelButtons.length > 0)
            (levelButtons[0] as HTMLElement).click();
        else
            this.world = worldCreator({})
    }

    public update(): void {
        this.world.tick()
    }
}
