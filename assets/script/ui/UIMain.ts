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

  @property(Node)
  public gameStart: Node = null

  @property(Node)
  public game: Node = null

  @property(Node)
  public gameOver: Node = null


  start() {
    this.node.on(Input.EventType.TOUCH_START, this._touchStart, this)
    this.node.on(Input.EventType.TOUCH_MOVE, this._touchMove, this)
    this.node.on(Input.EventType.TOUCH_END, this._touchEnd, this)
    this.gameStart.active = true
  }

  update(deltaTime: number) {

  }

  /**
   * 游戏结束界面按钮: 重新开始游戏
   */
  public reStart() {
    this.gameOver.active = false
    this.game.active = true
    this.gameManager.playAudio('button')
    this.gameManager.reStart()
  }

  /**
   * 游戏结束界面按钮: 返回主界面
   */
  public returnMain() {
    this.gameOver.active = false
    this.gameStart.active = true
    this.gameManager.playAudio('button')
    this.gameManager.returnMain()
  }

  /**
   * 触摸开始时, 发射子弹
   */
  private _touchStart() {
    if (this.gameManager.isGameStart) {
      this.gameManager.isShooting(true)
    } else {
      this.gameStart.active = false
      this.game.active = true
      this.gameManager.playAudio('button')
      this.gameManager.gameStart()
    }
  }

  /**
   * 飞机移动
   */
  private _touchMove(event: EventTouch) {
    if (this.gameManager.isGameStart) {
      let delta = event.getDelta()
      let position = this.plane.position
      this.plane.setPosition(position.x + 0.01 * this.speed * delta.x, position.y, position.z - 0.01 * this.speed * delta.y)
    }
  }

  /**
   * 触摸结束时, 停止发射子弹
   */
  private _touchEnd() {
    if (this.gameManager.isGameStart) {
      this.gameManager.isShooting(false)
    }
  }

}


