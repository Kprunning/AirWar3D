import {_decorator, Component} from 'cc'

const {ccclass, property} = _decorator

const OUT_OF_RANGE: number = -50

@ccclass('Bullet')
export class Bullet extends Component {

  @property
  public speed: number = 1

  start() {

  }

  update(deltaTime: number) {
    let position = this.node.position
    let moveLength = position.z - this.speed * deltaTime
    this.node.setPosition(position.x, position.y, moveLength)
    if (moveLength < OUT_OF_RANGE) {
      this.node.destroy()
    }
  }
}


