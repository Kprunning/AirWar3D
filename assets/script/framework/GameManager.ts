import {_decorator, Component, instantiate, math, Node, Prefab} from 'cc'
import {Bullet} from '../bullet/Bullet'
import {Enemy, Formation} from './Const'
import {EnemyPlane} from '../plane/EnemyPlane'

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

  // 敌机管理
  @property(Prefab)
  public enemy01: Prefab = null
  @property(Prefab)
  public enemy02: Prefab = null
  // 敌机速度设置
  @property
  public enemy01Speed: number = 1
  @property
  public enemy02Speed: number = 0.5

  // 生成飞机间隔
  @property
  public createEnemyInterval: number = 1
  // 当前飞机类型
  private _currentCreateEnemyTime: number = 0
  // 当前队形
  private _currentFormation: number = Formation.One


  start() {
    this._init()
  }

  update(deltaTime: number) {
    this._currentShootTime += deltaTime
    // 控制玩家子弹发射
    if (this._isShooting && this._currentShootTime > this.shootTime) {
      this.createPlayerBullet()
      this._currentShootTime = 0
    }

    // 原:保证立刻创建敌机,现: 考虑到开始留白时间,注掉此行代码
    // this._currentCreateEnemyTime = this.createEnemyInterval
    // 创建敌机
    this._creatEnemyByFormation(deltaTime)
  }

  public isShooting(flag: boolean) {
    this._isShooting = flag
  }

  /**
   * 初始化方法
   */
  private _init() {
    // 确保按下时立刻发出子弹
    this._currentShootTime = this.shootTime
    // 定时器变换队形,间隔10s变换队形
    this.schedule(this._changeFormation, 10)
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

  /**
   * 队形变换
   */
  private _changeFormation() {
    this._currentFormation++
    if (this._currentFormation > Formation.Three) {
      this._currentFormation = Formation.One
    }
  }

  /**
   * 根据队形生成飞机
   */
  private _creatEnemyByFormation(deltaTime: number) {
    this._currentCreateEnemyTime += deltaTime
    if (this._currentCreateEnemyTime > this.createEnemyInterval) {
      switch (this._currentFormation) {
        case Formation.One:
          if (this._currentCreateEnemyTime > this.createEnemyInterval) {
            this._createEnemyPlane()
            this._currentCreateEnemyTime = 0
          }
          break
        case Formation.Two:
          break
        case Formation.Three:
          break
        default:
          console.log('队形状态异常')
      }
      this._currentCreateEnemyTime = 0
    }
  }

  /**
   * 生成敌机
   */
  private _createEnemyPlane() {
    // 随机敌机类型,设置速度,创建飞机
    let enemyType = math.randomRangeInt(0, 2)
    let prefab: Prefab = null
    let speed: number = 0
    if (enemyType === Enemy.One) {
      prefab = this.enemy01
      speed = this.enemy01Speed
    } else if (enemyType === Enemy.Two) {
      prefab = this.enemy02
      speed = this.enemy02Speed
    }
    const enemy = instantiate(prefab)
    let component = enemy.getComponent(EnemyPlane)
    component.speed = speed
    // 设置父节点,随机x位置,设置位置
    enemy.setParent(this.node)
    let x = math.randomRange(-24, 24)
    enemy.setPosition(x, 0, -50)
  }
}


