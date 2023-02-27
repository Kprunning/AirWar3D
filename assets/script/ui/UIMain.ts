import {_decorator, Component, EventTouch, Input, Node} from 'cc'
import {GameManager} from '../framework/GameManager'

const {ccclass, property} = _decorator

@ccclass('UIMain')
export class UIMain extends Component {

  @property
  public speed: number = 5
  @property(Node)
  public plane: Node = null
  @property(GameManager)
  public gameManager: GameManager = null

  start() {
    this.node.on(Input.EventType.TOUCH_START, this._touchStart, this)
    this.node.on(Input.EventType.TOUCH_MOVE, this._touchMove, this)
    this.node.on(Input.EventType.TOUCH_END, this._touchEnd, this)
  }

  update(deltaTime: number) {

  }

  /**
   * 触摸开始时, 发射子弹
   */
  private _touchStart() {
    this.gameManager.isShooting(true)
  }

  /**
   * 飞机移动
   */
  private _touchMove(event: EventTouch) {
    let delta = event.getDelta()
    let position = this.plane.position
    this.plane.setPosition(position.x + 0.01 * this.speed * delta.x, position.y, position.z - 0.01 * this.speed * delta.y)
  }

  /**
   * 触摸结束时, 停止发射子弹
   */
  private _touchEnd() {
    this.gameManager.isShooting(false)
  }

}


