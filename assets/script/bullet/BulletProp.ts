import {_decorator, Collider, Component, ITriggerEvent} from 'cc'
import {GameManager} from '../framework/GameManager'
import {BulletPropType} from '../framework/Const'

const {ccclass} = _decorator

// x轴范围
export const BULLET_PROP_X_RANGE: number = 21

@ccclass('BulletProp')
export class BulletProp extends Component {
  // x轴方向的速度
  private _speedX = 0.3
  // y轴方向的速度
  private _speedZ = 0.3


  // z轴范围
  private _rangeZ: number = 50

  private _gameManager: GameManager = null


  start() {
    // 启用碰撞检测
    let collider = this.getComponent(Collider)
    collider.on('onTriggerEnter', this._onTriggerEnter, this)
  }

  update(deltaTime: number) {
    let position = this.node.getPosition()
    if (Math.abs(position.x) >= BULLET_PROP_X_RANGE) {
      this._speedX = -this._speedX
    }
    let z = position.z + this._speedZ * deltaTime
    this.node.setPosition(position.x + this._speedX * deltaTime, position.y, z)
    if (z > this._rangeZ) {
      this.node.destroy()
    }
  }


  onDisable() {
    let collider = this.getComponent(Collider)
    collider.off('onTriggerEnter', this._onTriggerEnter, this)
  }


  /**
   * 初始化方法
   * @param speed 运动速度,x和z速度相同
   * @param gameManager 管理类
   */
  init(speed: number, gameManager: GameManager) {
    this._speedX = speed
    this._speedZ = speed
    this._gameManager = gameManager
  }

  /**
   * 道具碰撞消失
   * @param event 碰撞事件
   */
  private _onTriggerEnter(event: ITriggerEvent) {
    let name = event.selfCollider.name
    if (name === 'bulletH') {
      this._gameManager.changeBulletType(BulletPropType.BULLET_H)
    } else if (name === 'bulletS') {
      this._gameManager.changeBulletType(BulletPropType.BULLET_S)
    } else {
      this._gameManager.changeBulletType(BulletPropType.BULLET_M)
    }
    this.node.destroy()
  }
}

