import {_decorator, Collider, Component, EventTouch, input, Input, ITriggerEvent} from 'cc'

const {ccclass, property} = _decorator

@ccclass('Player')
export class Player extends Component {

  @property
  public speed: number = 5

  start() {
    input.on(Input.EventType.TOUCH_MOVE, this._touchMove, this)
    // 启用碰撞检测
    let collider = this.getComponent(Collider)
    collider.on('onTriggerEnter', this._onTriggerEnter, this)
  }

  update(deltaTime: number) {

  }

  onDisable() {
    let collider = this.getComponent(Collider)
    collider.off('onTriggerEnter', this._onTriggerEnter, this)
  }

  /**
   * 飞机移动
   */
  private _touchMove(event: EventTouch) {
    let delta = event.getDelta()
    let position = this.node.position
    this.node.setPosition(position.x + 0.01 * this.speed * delta.x, position.y, position.z - 0.01 * this.speed * delta.y)
  }

  /**
   * 监听玩家碰撞, 玩家减少血量
   * @param event 碰撞事件
   */
  private _onTriggerEnter(event: ITriggerEvent) {
    console.log('play hit')
  }
}


