import {_decorator, Collider, Component, ITriggerEvent} from 'cc'
import {BulletDirection} from '../framework/Const'
import {GameManager} from '../framework/GameManager'
import {PoolManager} from '../framework/PoolManager'

const {ccclass} = _decorator

// 地图边界
const OUT_OF_RANGE: number = 50


@ccclass('Bullet')
export class Bullet extends Component {

  private _speed: number = 1
  private _isEnemy: boolean = false
  private _direction: BulletDirection = 1
  private _gameManager: GameManager = null
  private _targetEnemyId: string = ''


  onEnable() {
    // 启用碰撞检测
    let collider = this.getComponent(Collider)
    collider.on('onTriggerEnter', this._onTriggerEnter, this)
  }

  update(deltaTime: number) {
    let position = this.node.position
    let z = this._isEnemy ? position.z + this._speed * deltaTime : position.z - this._speed * deltaTime
    let x = position.x
    if (this._direction === BulletDirection.LEFT) {
      x = position.x - this._speed * deltaTime * 0.3
      this.node.setPosition(x, position.y, z)
    } else if (this._direction === BulletDirection.RIGHT) {
      x = position.x + this._speed * deltaTime * 0.3
    } else if (this._direction === BulletDirection.TRACE) {
      if (this._targetEnemyId) {
        let enemy = this._gameManager.node.getChildByUuid(this._targetEnemyId)
        let targetPosition
        if (enemy) {
          targetPosition = enemy.position
          let next = this._followUpBullet(targetPosition.x, targetPosition.z, position.x, position.z, this._speed, deltaTime)
          x = next.x
          z = next.y
        } else {
          PoolManager.instance().putNode(this.node)
        }
      }
    }
    this.node.setPosition(x, position.y, z)
    if (Math.abs(z) > Math.abs(OUT_OF_RANGE)) {
      PoolManager.instance().putNode(this.node)
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
   * @param gameManager 游戏管理类
   * @param targetEnemyId 追踪子弹追踪敌人id
   */
  init(speed: number, isEnemy: boolean = false, direction: BulletDirection = 1, gameManager: GameManager = null, targetEnemyId: string = '') {
    this._speed = speed
    this._isEnemy = isEnemy
    this._direction = direction
    this._gameManager = gameManager
    this._targetEnemyId = targetEnemyId
  }


  /**
   * 子弹碰撞消失
   * @param event 碰撞事件
   */
  private _onTriggerEnter(event: ITriggerEvent) {
    PoolManager.instance().putNode(this.node)
  }


  /**
   * @description: 追踪目标
   * @param {number} x1 追踪目标x轴
   * @param {number} y1 追踪目标y轴
   * @param {number} x2 追踪者x轴
   * @param {number} y2 追踪者y轴
   * @param {number} speed 追踪者速度
   * @param deltaTime 间隔时间
   * @return {Object} {x, y} 返回下一次要移动的位置
   */
  private _followUpBullet(x1, y1, x2, y2, speed, deltaTime) {
    // 向量
    let deltaX = x1 - x2
    let deltaY = y1 - y2
    // 微小偏移
    if (deltaX == 0) {
      if (y1 >= y2) {
        deltaX = 0.0000001
      } else {
        deltaX = -0.0000001
      }
    }
    if (deltaY == 0) {
      if (x1 >= x2) {
        deltaY = 0.0000001
      } else {
        deltaY = -0.0000001
      }
    }
    let angle
    // 右下角
    if (deltaX > 0 && deltaY > 0) {
      angle = Math.atan(Math.abs(deltaY / deltaX)) // 第一项限
      // 左下角
    } else if (deltaX < 0 && deltaY > 0) {
      angle = Math.PI - Math.atan(Math.abs(deltaY / deltaX)) // 第二项限
      // 左上角
    } else if (deltaX < 0 && deltaY < 0) {
      angle = Math.PI + Math.atan(Math.abs(deltaY / deltaX)) // 第三项限
      // 右上角
    } else {
      angle = 2 * Math.PI - Math.atan(Math.abs(deltaY / deltaX)) // 第四项限
    }
    let x = speed * deltaTime * Math.cos(angle)
    let y = speed * deltaTime * Math.sin(angle)
    return {x, y, angle: this._calAngle(x2, y2, x1, y1)}
  }

  // 计算角度
  private _calAngle(cx, cy, x, y) {
    const radian = getCosBy2pt(x, y, cx, cy)
    let angle = (Math.acos(radian) * 180) / Math.PI
    if (x < cx) angle = -angle
    return angle

    // 计算 点1指点2形成 的向量
    function getCosBy2pt(x, y, cx, cy) {
      let a = [x - cx, y - cy]
      let b = [0, -1]
      return calCos(a, b)
    }

    function calCos(a, b) {
      // 点积
      let dotProduct = a[0] * b[0] + a[1] * b[1]
      let d =
        Math.sqrt(a[0] * a[0] + a[1] * a[1]) *
        Math.sqrt(b[0] * b[0] + b[1] * b[1])
      return dotProduct / d
    }
  }

}


