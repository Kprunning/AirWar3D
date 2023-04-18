import {_decorator, Collider, Component, ITriggerEvent} from 'cc'
import {BulletDirection} from '../framework/Const'

const {ccclass} = _decorator

// 地图边界
const OUT_OF_RANGE: number = 50


@ccclass('Bullet')
export class Bullet extends Component {

  private _speed: number = 1
  private _isEnemy: boolean = false
  private _direction: BulletDirection = 1


  start() {
    // 启用碰撞检测
    let collider = this.getComponent(Collider)
    collider.on('onTriggerEnter', this._onTriggerEnter, this)
  }

  update(deltaTime: number) {
    let position = this.node.position
    let z = this._isEnemy ? position.z + this._speed * deltaTime : position.z - this._speed * deltaTime
    let x
    if (this._direction === 1) {
      x = position.x
    } else if (this._direction === 0) {
      x = position.x - this._speed * deltaTime * 0.3
      this.node.setPosition(x, position.y, z)
    } else {
      x = position.x + this._speed * deltaTime * 0.3
    }
    this.node.setPosition(x, position.y, z)
    if (Math.abs(z) > Math.abs(OUT_OF_RANGE)) {
      this.node.destroy()
    }
  }


  onDisable() {
    let collider = this.getComponent(Collider)
    collider.off('onTriggerEnter', this._onTriggerEnter, this)
  }

  /**
   * 子弹初始化
   * @param speed 子弹速度
   * @param isEnemy 玩家/敌机
   * @param direction 子弹方向(用于3方向发射时,有用)
   */
  init(speed: number, isEnemy: boolean = false, direction: BulletDirection = 1) {
    this._speed = speed
    this._isEnemy = isEnemy
    this._direction = direction
  }

  /**
   * 子弹碰撞消失
   * @param event 碰撞事件
   */
  private _onTriggerEnter(event: ITriggerEvent) {
    this.node.destroy()
  }
}


