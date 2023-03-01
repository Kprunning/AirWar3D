import {_decorator, Component, EventTouch, Input, input} from 'cc'

const {ccclass, property} = _decorator

@ccclass('SelfPlane')
export class SelfPlane extends Component {

  @property
  public speed: number = 5

  start() {
    input.on(Input.EventType.TOUCH_MOVE, this._touchMove, this)
  }

  update(deltaTime: number) {

  }

  /**
   * 飞机移动
   */
  private _touchMove(event: EventTouch) {
    let delta = event.getDelta()
    let position = this.node.position
    this.node.setPosition(position.x + 0.01 * this.speed * delta.x, position.y, position.z - 0.01 * this.speed * delta.y)
  }
}


