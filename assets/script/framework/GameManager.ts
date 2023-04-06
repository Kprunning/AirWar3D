import {_decorator, Component, instantiate, math, Node, Prefab, Vec3} from 'cc'
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
  // 开始计时, 用于计算队形变换
  private _beginTimer: number = 0

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

    // 队形组合计时
    if (this._beginTimer < 20) {
      this._beginTimer += deltaTime
    }
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
  }

  /**
   * 创建玩家子弹
   */
  private createPlayerBullet() {
    const bullet = instantiate(this.bullet1)
    bullet.setParent(this.bulletRoot)
    let playerPosition = this.playerPlane.position
    // 设置子弹位置
    bullet.setPosition(playerPosition.x, playerPosition.y, playerPosition.z - 7)
    // 设置子弹速度
    const component = bullet.getComponent(Bullet)
    component.init(this.bulletSpeed)
  }


  /**
   * 创建敌机子弹
   */
  public createEnemyBullet(enemyPosition: Vec3) {
    const bullet = instantiate(this.bullet1)
    bullet.setParent(this.bulletRoot)
    // 设置子弹位置
    bullet.setPosition(enemyPosition.x, enemyPosition.y, enemyPosition.z + 6)
    // 设置子弹速度
    const component = bullet.getComponent(Bullet)
    component.init(this.bulletSpeed, true)
  }


  /**
   * 根据队形生成飞机
   */
  private _creatEnemyByFormation(deltaTime: number) {
    this._currentCreateEnemyTime += deltaTime
    if (this._beginTimer < 10) {
      // 组合1
      if (this._currentCreateEnemyTime > this.createEnemyInterval) {
        this._createFormationOne()
        this._currentCreateEnemyTime = 0
      }
    } else if (this._beginTimer < 20) {
      // 组合2
      if (this._currentCreateEnemyTime > this.createEnemyInterval * 0.8) {
        let formationType = math.randomRangeInt(0, 2)
        if (formationType === Formation.One) {
          this._createFormationOne()
        } else {
          this._createFormationTwo()
        }
        this._currentCreateEnemyTime = 0
      }
    } else {
      // 组合3
      if (this._currentCreateEnemyTime > this.createEnemyInterval * 0.6) {
        let formationType = math.randomRangeInt(0, 3)
        if (formationType === Formation.One) {
          this._createFormationOne()
        } else if (formationType === Formation.Two) {
          this._createFormationTwo()
        } else {
          this._createFormationThree()
        }
        this._currentCreateEnemyTime = 0
      }
    }
  }

  /**
   * 随机选择敌机类型
   */
  private randomEnemy() {
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
    return {prefab, speed}
  }

  /**
   * 队形1: 随机生成单架飞机
   * 队形1特点: 发射字典
   */
  private _createFormationOne() {
    let {prefab, speed} = this.randomEnemy()
    const enemy = instantiate(prefab)
    let component = enemy.getComponent(EnemyPlane)
    // 队形1发射子弹
    component.init(speed, true, this)
    // 设置父节点,随机x位置,设置位置
    enemy.setParent(this.node)
    let x = math.randomRange(-24, 24)
    enemy.setPosition(x, 0, -50)
  }


  /**
   * 队形2: 一字型队列, 包含5个飞机
   */
  private _createFormationTwo() {
    let {prefab, speed} = this.randomEnemy()
    for (let i = 0; i < 5; i++) {
      const enemy = instantiate(prefab)
      let component = enemy.getComponent(EnemyPlane)
      component.init(speed)
      enemy.setParent(this.node)
      enemy.setPosition(-20 + i * 10, 0, -50)
    }
  }

  /**
   * 队形3: V字型队列,包含7个飞机
   */
  private _createFormationThree() {
    let {prefab, speed} = this.randomEnemy()
    let positionList = [new Vec3(-18, 0, -68), new Vec3(-12, 0, -62), new Vec3(-6, 0, -56)]
    for (let i = 0; i < 7; i++) {
      const enemy = instantiate(prefab)
      let component = enemy.getComponent(EnemyPlane)
      component.init(speed)
      enemy.setParent(this.node)
      if (i < 3) {
        enemy.setPosition(positionList[i])
      } else if (i === 3) {
        enemy.setPosition(0, 0, -50)
      } else {
        let vec3 = positionList[-i + 6]
        enemy.setPosition(-vec3.x, vec3.y, vec3.z)
      }
    }
  }
}


