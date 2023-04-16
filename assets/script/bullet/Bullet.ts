import {_decorator, Collider, Component, ITriggerEvent} from 'cc'

const {ccclass} = _decorator

// 地图边界
const OUT_OF_RANGE: number = 50

@ccclass('Bullet')
export class Bullet extends Component {

  private _speed: number = 1
  private _isEnemy: boolean = false

  start() {
    // 启用碰撞检测
    let collider = this.getComponent(Collider)
    collider.on('onTriggerEnter', this._onTriggerEnter, this)
  }

  update(deltaTime: number) {
    let position = this.node.position
    let moveLength = this._isEnemy ? position.z + this._speed * deltaTime : position.z - this._speed * deltaTime
    this.node.setPosition(position.x, position.y, moveLength)
    if (Math.abs(moveLength) > Math.abs(OUT_OF_RANGE)) {
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
   */
  init(speed: number, isEnemy: boolean = false) {
    this._speed = speed
    this._isEnemy = isEnemy
  }

  /**
   * 子弹碰撞消失
   * @param event 碰撞事件
   */
  private _onTriggerEnter(event: ITriggerEvent) {
    this.node.destroy()
  }
}


