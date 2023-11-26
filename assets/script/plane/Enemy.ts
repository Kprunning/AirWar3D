import {_decorator, Collider, Component, ITriggerEvent} from 'cc'
import {GameManager} from '../framework/GameManager'
import {PoolManager} from '../framework/PoolManager'
import {CollisionType} from '../framework/Const'

const {property, ccclass} = _decorator


const OUT_OF_BOTTOM: number = 50

@ccclass('Enemy')
export class Enemy extends Component {
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

  // 从节点池拿取时需要重新启用碰撞检测
  onEnable() {
    // 启用碰撞检测
    let collider = this.getComponent(Collider)
    collider.on('onTriggerEnter', this._onTriggerEnter, this)
  }

  update(deltaTime: number) {
    let position = this.node.getPosition()
    let z = position.z + this._speed * deltaTime
    // 1.飞机移动
    this.node.setPosition(position.x, position.y, z)
    // 超出屏幕下方销毁敌机
    if (z > OUT_OF_BOTTOM) {
      PoolManager.instance().putNode(this.node)
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


  onDisable() {
    let collider = this.getComponent(Collider)
    collider.off('onTriggerEnter', this._onTriggerEnter, this)
  }

  /**
   * 初始化
   * @param speed 速度
   * @param isFire 是否发射子弹
   * @param gameManager 游戏管理
   */
  init(speed: number, gameManager: GameManager, isFire: boolean = false) {
    this._speed = speed
    this._isFire = isFire
    this._gameManager = gameManager
  }

  /**
   * 监听敌机碰撞,敌机消失,玩家加分
   * @param event 碰撞事件
   */
  private _onTriggerEnter(event: ITriggerEvent) {
    this._gameManager.addScore()
    PoolManager.instance().putNode(this.node)
    this._gameManager.playAudio('enemy')
  }
}


