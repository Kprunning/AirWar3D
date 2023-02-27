import {_decorator, Component, instantiate, Node, Prefab} from 'cc'
import {Bullet} from '../bullet/Bullet'

const {ccclass, property} = _decorator

@ccclass('GameManager')
export class GameManager extends Component {
  @property(Node)
  public playerPlane: Node = null
  @property(Prefab)
  public bullet1: Prefab = null
  @property(Prefab)
  public bullet2: Prefab = null
  @property(Prefab)
  public bullet3: Prefab = null
  @property(Prefab)
  public bullet4: Prefab = null
  @property(Prefab)
  public bullet5: Prefab = null
  // 射击周期
  @property
  public shootTime: number = 0.3
  private _currentShootTime: number = 0
  private _isShooting: boolean = false

  // 子弹管理节点
  @property(Node)
  public bulletRoot: Node = null
  @property
  public bulletSpeed: number = 1

  start() {
    this._init()
  }

  update(deltaTime: number) {
    this._currentShootTime += deltaTime
    if (this._isShooting && this._currentShootTime > this.shootTime) {
      this.createPlayerBullet()
      this._currentShootTime = 0
    }
  }

  public isShooting(flag: boolean) {
    this._isShooting = flag
  }

  private _init() {
    // 确保按下时立刻发出子弹
    this._currentShootTime = this.shootTime
  }

  /**
   * 创建玩家子弹
   * @private
   */
  private createPlayerBullet() {
    const bullet = instantiate(this.bullet1)
    bullet.setParent(this.bulletRoot)
    let playerPosition = this.playerPlane.position
    // 设置子弹位置
    bullet.setPosition(playerPosition.x, playerPosition.y, playerPosition.z - 7)
    // 设置子弹速度
    const component = bullet.getComponent(Bullet)
    component.speed = this.bulletSpeed
  }
}


