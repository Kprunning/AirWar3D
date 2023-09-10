import {_decorator, BoxCollider, Component, instantiate, Label, macro, math, Node, Prefab, Vec3} from 'cc'
import {Bullet} from '../bullet/Bullet'
import {BulletDirection, BulletPropType, CollisionType, EnemyType, Formation} from './Const'
import {Enemy} from '../plane/Enemy'
import {BULLET_PROP_X_RANGE, BulletProp} from '../bullet/BulletProp'
import {Player} from '../plane/Player'

const {ccclass, property} = _decorator

@ccclass('GameManager')
export class GameManager extends Component {
  @property(Player)
  public playerPlane: Player = null
  /**
   * 除了1为敌机子弹,其他都为玩家子弹
   */
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

  // 子弹道具
  @property(Prefab)
  public bulletH: Prefab = null
  @property(Prefab)
  public bulletS: Prefab = null
  @property(Prefab)
  public bulletM: Prefab = null


  // 射击周期
  @property
  public shootTime: number = 0.3
  private _currentShootTime: number = 0
  private _isShooting: boolean = false
  public isGameStart: boolean = false

  // 子弹管理节点
  @property(Node)
  public bulletRoot: Node = null
  @property
  public bulletSpeed: number = 1
  @property
  public traceBulletSpeed: number = 1
  // 当前玩家子弹类型
  private _playBulletType: BulletPropType = BulletPropType.BULLET_DEFAULT

  // 敌机管理
  @property(Prefab)
  public enemy01: Prefab = null
  @property(Prefab)
  public enemy02: Prefab = null
  // 敌机速度设置
  @property
  public enemy01Speed: number = 20
  @property
  public enemy02Speed: number = 30
  // 子弹道具速度
  @property
  public bulletPropSpeed: number = 15


  // 生成飞机间隔
  @property
  public createEnemyInterval: number = 2
  // 当前飞机类型
  private _currentCreateEnemyTime: number = 0
  // 开始计时, 用于计算队形变换
  private _beginTimer: number = 0
  // 存放已经被追踪的敌人id
  private _tracedEnemyIdList: string[] = []


  // 分数
  private _score: number = 0

  // 游戏节点
  @property(Node)
  public gamePage: Node = null
  // 游戏结束节点
  @property(Node)
  public gameOverPage: Node = null
  // 游戏进行时, 实时分数
  @property(Label)
  public gameScore: Label = null
  // 游戏结束时分数
  @property(Label)
  public gameOverScore: Label = null


  start() {
    this._init()
  }

  update(deltaTime: number) {
    if (!this.isGameStart) {
      return
    }
    if (this.playerPlane.isDie) {
      this.gameOver()
      return
    }
    this._currentShootTime += deltaTime
    // 控制玩家子弹发射
    if (this._isShooting && this._currentShootTime > this.shootTime) {
      this._playerFire()
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
   * 创建敌机子弹
   */
  public createEnemyBullet(enemyPosition: Vec3) {
    const bullet = instantiate(this.bullet1)
    bullet.setParent(this.bulletRoot)
    // 设置子弹位置
    bullet.setPosition(enemyPosition.x, enemyPosition.y, enemyPosition.z + 6)
    // 设置子弹速度
    const bulletComponent = bullet.getComponent(Bullet)
    bulletComponent.init(this.bulletSpeed, true)
    // 因为子弹共用,所以设置下分组
    let collider = bullet.getComponent(BoxCollider)
    collider.setGroup(CollisionType.ENEMY_BULLET)
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
    if (enemyType === EnemyType.One) {
      prefab = this.enemy01
      speed = this.enemy01Speed
    } else if (enemyType === EnemyType.Two) {
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
    let component = enemy.getComponent(Enemy)
    // 队形1发射子弹
    component.init(speed, this, true)
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
      let component = enemy.getComponent(Enemy)
      component.init(speed, this)
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
      let component = enemy.getComponent(Enemy)
      component.init(speed, this)
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

  /**
   * 创建子弹道具
   * @private
   */
  private _createBulletProp() {
    let type = math.randomRangeInt(0, 3)
    let prefab: Prefab
    if (type === BulletPropType.BULLET_H) {
      prefab = this.bulletH
    } else if (type === BulletPropType.BULLET_S) {
      prefab = this.bulletS
    } else {
      prefab = this.bulletM
    }
    let bulletProp = instantiate(prefab)
    bulletProp.setParent(this.node)
    // 初始化放在右边
    bulletProp.setPosition(BULLET_PROP_X_RANGE, 0, -50)
    let component = bulletProp.getComponent(BulletProp)
    // 初始化道具脚本属性
    component.init(this.bulletPropSpeed, this)
  }

  /**
   * 消灭敌机,分数增加
   */
  public addScore() {
    this._score += 1
    this.gameScore.string = this._score.toString()
  }

  /**
   * 根据道具切换子弹类型
   * @param bulletPropType 子弹道具类型
   */
  public changeBulletType(bulletPropType: BulletPropType) {
    this._playBulletType = bulletPropType
  }

  /**
   * 玩家开火发射子弹
   * @private
   */
  private _playerFire() {
    switch (this._playBulletType) {
      case BulletPropType.BULLET_H:
        this._createBulletH()
        break
      case BulletPropType.BULLET_S:
        this._createBulletS()
        break
      case BulletPropType.BULLET_M:
        this._createBulletM()
        break
      default:
        this._createBulletFault()
    }
  }

  /**
   * 创建子弹类型M
   * 两列平行发射
   */
  private _createBulletM() {
    for (let i = 0; i < 2; i++) {
      const bullet = instantiate(this.bullet2)
      bullet.setParent(this.bulletRoot)
      let playerPosition = this.playerPlane.node.position
      // 设置子弹位置
      bullet.setPosition(i === 0 ? playerPosition.x - 3 : playerPosition.x + 3, playerPosition.y, playerPosition.z - 7)
      // 设置子弹速度
      const bulletComponent = bullet.getComponent(Bullet)
      bulletComponent.init(this.bulletSpeed)
    }
  }


  /**
   * 创建子弹类型H
   * 3条子弹,呈扇形
   */
  private _createBulletH() {
    for (let i = 0; i < 3; i++) {
      const bullet = instantiate(this.bullet3)
      bullet.setParent(this.bulletRoot)
      let playerPosition = this.playerPlane.node.position
      // 设置子弹位置
      bullet.setPosition(playerPosition.x, playerPosition.y, playerPosition.z - 7)
      // 设置子弹速度
      const bulletComponent = bullet.getComponent(Bullet)
      bulletComponent.init(this.bulletSpeed, false, i)
    }
  }


  /**
   * 创建子弹类型S
   * 追踪敌机,持续15s后切换回默认子弹
   */
  private _createBulletS() {
    const bullet = instantiate(this.bullet5)
    bullet.setParent(this.bulletRoot)
    let playerPosition = this.playerPlane.node.position
    // 设置子弹位置
    bullet.setPosition(playerPosition.x, playerPosition.y, playerPosition.z - 7)
    // 设置子弹速度
    const bulletComponent = bullet.getComponent(Bullet)
    // // 获取追踪的敌人id列表
    // let enemyList = this.node.children
    // let enemyIdList = enemyList.map(item => item.uuid)
    // // 过滤已经销毁的敌人
    // this._tracedEnemyIdList = this._tracedEnemyIdList.filter(item => enemyIdList.indexOf(item) !== -1)
    // // 获取要追踪的敌人
    // let targetEnemyList = enemyList.filter(item => (item.name === 'enemy01' || item.name === 'enemy02') && this._tracedEnemyIdList.indexOf(item.uuid) === -1)
    // let enemyId
    // if (targetEnemyList.length === 0) {
    //   enemyId = ''
    // } else {
    //   enemyId = targetEnemyList[0].uuid
    // }
    // this._tracedEnemyIdList.push(enemyId)
    bulletComponent.init(this.traceBulletSpeed, false, BulletDirection.TRACE, this, '')
  }


  /**
   * 创建玩家默认子弹
   */
  private _createBulletFault() {
    const bullet = instantiate(this.bullet1)
    bullet.setParent(this.bulletRoot)
    let playerPosition = this.playerPlane.node.position
    // 设置子弹位置
    bullet.setPosition(playerPosition.x, playerPosition.y, playerPosition.z - 7)
    // 设置子弹速度
    const bulletComponent = bullet.getComponent(Bullet)
    bulletComponent.init(this.bulletSpeed)
    // 因为子弹共用,所以设置下分组
    let collider = bullet.getComponent(BoxCollider)
    collider.setGroup(CollisionType.PLAYER_BULLET)
    collider.setMask(CollisionType.ENEMY)
  }

  public returnMain() {
    this._resetProp()
  }

  public gameStart() {
    this.isGameStart = true
    this.schedule(this._createBulletProp, 10, macro.REPEAT_FOREVER)
  }

  public reStart() {
    this._resetProp()
    this.gameStart()
  }

  public gameOver() {
    // 每隔10s生成道具
    this.schedule(this._createBulletProp, 10, macro.REPEAT_FOREVER)
    this.isGameStart = false
    this.gamePage.active = false
    this.gameOverPage.active = true
    this.gameOverScore.string = this._score.toString()
    this._isShooting = false
    this.unschedule(this._createBulletProp)
    // 销毁场景中的敌机和子弹
    this.node.destroyAllChildren()
    this.bulletRoot.destroyAllChildren()
  }

  private _resetProp() {
    this._currentShootTime = 0
    this._isShooting = false
    this._currentCreateEnemyTime = 0
    this._beginTimer = 0
    this._playBulletType = BulletPropType.BULLET_DEFAULT
    this.playerPlane.node.setPosition(0, 0, 20)
    this._score = 0
    this.gameScore.string = '0'
    this.playerPlane.init()
  }
}


