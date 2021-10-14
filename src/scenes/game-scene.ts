import { World } from '../simulation/world';

const sceneConfig: Phaser.Types.Scenes.SettingsConfig = {
  active: false,
  visible: false,
  key: 'Game',
};

export class GameScene extends Phaser.Scene {
  public speed = 200;

  private world: World

  constructor() {
    super(sceneConfig);
  }

  public create(): void {
    let group = new Phaser.GameObjects.Group(this);

    this.physics.add.collider(group, group)

    this.world = new World((x, y, r) => {
      const sprite = this.physics.add.sprite(x, y, 'man');
      sprite.setMaxVelocity(100)
      sprite.body.bounce.set(1)
      group.add(sprite)
      sprite.body.setCollideWorldBounds(true);
      return sprite
    })

    for (const arrow of this.world.arrows){
      this.physics.add.sprite(arrow.x, arrow.y, 'arrow-' + arrow.direction.toLowerCase())
    }

  }

  public update(): void {
    this.world.tick();
  }
}
