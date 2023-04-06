import {_decorator, Component} from 'cc'
import {GameManager} from '../framework/GameManager'

const {property, ccclass} = _decorator


const OUT_OF_BOTTOM: number = 50

@ccclass('EnemyPlane')
export class EnemyPlane extends Component {
  // 敌机速度,通过gameManager设置
  private _speed: number = 0
  // 是否发射子弹
  private _isFire: boolean = false
  // 开火计时,设置等于fireInterval保证开始就开火
  private _fireTimer: number = 0.5
  // 开火间隔
  @property
  public fireInterval: number = 0.5
  // 游戏管理
  private _gameManager: GameManager = null

  start() {

  }

  update(deltaTime: number) {
    let position = this.node.getPosition()
    let z = position.z + this._speed * deltaTime
    // 1.飞机移动
    this.node.setPosition(position.x, position.y, z)
    // 超出屏幕下方销毁敌机
    if (z > OUT_OF_BOTTOM) {
      this.node.destroy()
    }
    // 2.子弹发射
    if (this._isFire) {
      this._fireTimer += deltaTime
      if (this._fireTimer > this.fireInterval) {
        this._gameManager.createEnemyBullet(this.node.getPosition())
        this._fireTimer = 0
      }
    }
  }

  init(speed: number, isFire: boolean = false, gameManager: GameManager = null) {
    this._speed = speed
    this._isFire = isFire
    this._gameManager = gameManager
  }
}


