import {_decorator, Component, Node} from 'cc'

const {ccclass, property} = _decorator

@ccclass('BgControl')
export class BgControl extends Component {
  @property(Node)
  private bg1: Node = null

  @property(Node)
  private bg2: Node = null

  @property
  private _bgSpeed: number = 10

  private _bgMovingRange: number = 90

  start() {

  }

  update(deltaTime: number) {
    this._moveBackground(deltaTime)
  }

  /**
   * 背景移动
   * @param deltaTime 帧间隔时间
   * @private
   */
  private _moveBackground(deltaTime) {
    // 1.移动背景
    this.bg1.setPosition(0, 0, this.bg1.position.z + this._bgSpeed * deltaTime)
    this.bg2.setPosition(0, 0, this.bg2.position.z + this._bgSpeed * deltaTime)
    // 2.边界判断
    if (this.bg1.position.z > this._bgMovingRange) {
      this.bg1.setPosition(0, 0, this.bg2.position.z - 90)
    } else if (this.bg2.position.z > this._bgMovingRange) {
      this.bg2.setPosition(0, 0, this.bg1.position.z - 90)
    }
  }

  resetBackground() {
    this.bg1.setPosition(0, 0, 0)
    this.bg2.setPosition(0, 0, this._bgMovingRange)
  }
}


