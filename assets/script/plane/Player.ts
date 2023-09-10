import {_decorator, Collider, Component, EventTouch, input, Input, ITriggerEvent} from 'cc'
import {CollisionType} from '../framework/Const'

const {ccclass, property} = _decorator

@ccclass('Player')
export class Player extends Component {
  // 初始玩家血量
  @property
  public lifeValue: number = 5
  // 当前玩家血量
  private _currentLife: number = 0

  public isDie: boolean = false

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

  public init() {
    this.isDie = false
    this._currentLife = this.lifeValue
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
    let group = event.otherCollider.getGroup()
    // 如果碰撞的不是道具,玩家掉血
    if (group !== CollisionType.BULLET_PROP) {
      console.log('play hit')
      this._currentLife -= 1
      if (this._currentLife <= 0) {
        this.isDie = true
      }
    }
  }
}


