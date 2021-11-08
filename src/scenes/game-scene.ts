import { Vector } from '../simulation/utils';
import { World, WorldJson } from '../simulation/world';

const sceneConfig: Phaser.Types.Scenes.SettingsConfig = {
  active: false,
  visible: false,
  key: 'Game',
};

export class GameScene extends Phaser.Scene {
  public speed = 200;

  private world: World

  private burned: number = 0
  private escaped: number = 0

  constructor() {
    super(sceneConfig);
  }

  public create(): void {
    const burnedCounter = document.querySelector('#burned-counter') as HTMLDivElement
    const escapedCounter = document.querySelector('#escaped-counter') as HTMLDivElement

    let peopleGroup = new Phaser.GameObjects.Group(this);
    let wallsGroup = new Phaser.GameObjects.Group(this);

    this.physics.add.collider(peopleGroup, peopleGroup)
    this.physics.add.collider(peopleGroup, wallsGroup)

    const buttonEvents = {
      "actor": (p: Vector) => {
        this.world.spawn(p.x, p.y)
      },
      "arrow-right": (p: Vector) => {
        this.world.addArrow(this.world.absoluteToCell(p), 'Right')
      },
      "arrow-left": (p: Vector) => {
        this.world.addArrow(this.world.absoluteToCell(p), 'Left')
      },
      "arrow-up": (p: Vector) => {
        this.world.addArrow(this.world.absoluteToCell(p), 'Up')
      },
      "arrow-down": (p: Vector) => {
        this.world.addArrow(this.world.absoluteToCell(p), 'Down')
      },
      "exit": (p: Vector) => {
        this.world.addExit(this.world.absoluteToCell(p))
      },
      "wall": (p: Vector) => {
        this.world.addWall(p)
      },
      "fire": (p: Vector) => {
        this.world.addFire(this.world.absoluteToCell(p))
      },
      "delete": (p: Vector) => {
        this.world.delete(p)
      },
    }

    const buttons = document.querySelectorAll(".level-button")
    let onButtonAction = (p: Vector) => { }
    buttons.forEach(button => {
      const type = button.getAttribute("data-object")
      if (type === 'kill-all') {
        button.addEventListener('click', () => {
          this.world.killAll()
        })
        return
      } else if (type === 'spawn-all') {
        button.addEventListener('click', () => {
          this.world.spawnAll()
        })
        return
      } else if (!(type in buttonEvents)) {
        return
      }
      const callback = buttonEvents[type]
      button.addEventListener('click', () => {
        onButtonAction = callback
      })
    })

    const content = document.querySelector("#content")
    content.addEventListener('click', (e: MouseEvent) => {
      const rect = content.getBoundingClientRect()
      onButtonAction({ x: e.x - rect.x, y: e.y - rect.y })
    })

    const worldCreator = (json: WorldJson) => new World(
      { x: 13, y: 13 },
      (coords, direction) => {
        return this.physics.add.sprite(coords.x, coords.y, 'arrow-' + direction.toLowerCase())
      },
      (x, y, r) => {
        const sprite = this.physics.add.sprite(x, y, 'man');
        sprite.setMaxVelocity(100)
        sprite.body.bounce.set(1)
        peopleGroup.add(sprite)
        sprite.body.setCollideWorldBounds(true);
        return sprite
      },
      ({ x, y }, { x: w, y: h }) => {
        const sprite = this.physics.add.staticSprite(x, y, 'wall');
        sprite.body.setSize(w, h)
        sprite.setScale(w / sprite.width, h / sprite.height)
        wallsGroup.add(sprite)
        return sprite
      },
      ({ x, y }, { x: w, y: h }) => {
        const sprite = this.physics.add.sprite(x, y, 'fire');
        sprite.setScale(w / sprite.width, h / sprite.height)

        this.physics.add.overlap(sprite, peopleGroup, (fire, person) => {
          this.world.deletePersonBySprite(person)
          this.burned += 1
          burnedCounter.textContent = this.burned + ""
        })
        return sprite
      },
      ({ x, y }, { x: w, y: h }) => {
        const sprite = this.physics.add.sprite(x, y, 'exit');
        sprite.setScale(w / sprite.width, h / sprite.height)

        this.physics.add.overlap(sprite, peopleGroup, (fire, person) => {
          this.world.deletePersonBySprite(person)
          this.escaped += 1
          escapedCounter.textContent = this.escaped + ""
        })
        return sprite
      }, json)

    const loadJsonButton = document.querySelector("#worldjson-load")
    const saveJsonButton = document.querySelector("#worldjson-save")
    const worldJsonText = document.querySelector("#worldjson") as HTMLInputElement
    loadJsonButton.addEventListener('click', () => {
      console.log(JSON.parse(worldJsonText.value))
      this.world.deleteAll()
      this.world = worldCreator(JSON.parse(worldJsonText.value))
    })
    saveJsonButton.addEventListener('click', () => {
      worldJsonText.value = JSON.stringify(this.world.toJson())
    })

    this.world = worldCreator({})
  }

  public update(): void {
    this.world.tick();
  }
}
