/**
 * 敌机枚举
 */
export enum EnemyType {
  One,
  Two
}

/**
 * 队形枚举
 * One:随机生成单架飞机
 * Two: 一字型队列, 包含5个飞机
 * Three: V字型队列,包含7个飞机
 * 0-10s, 包含队形1
 * 10-20s,包含队形1,2, 间隔 0.8s
 * 20s + ,包含队形1,2,3,间隔0.6s
 */

export enum Formation {
  One,
  Two,
  Three
}

/**
 * 碰撞分组
 */
export enum CollisionType {
  PLAYER = 1 << 1,
  ENEMY = 1 << 2,
  PLAYER_BULLET = 1 << 3,
  ENEMY_BULLET = 1 << 4,
  BULLET_PROP = 1 << 5
}

/**
 * 子弹道具类型
 */
export enum BulletPropType {
  BULLET_M,
  BULLET_H,
  BULLET_S,
  BULLET_DEFAULT
}


/**
 * 子弹方向
 */
export enum BulletDirection {
  LEFT,
  MIDDLE,
  RIGHT,
  TRACE
}