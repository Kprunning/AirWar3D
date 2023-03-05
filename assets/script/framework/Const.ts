/**
 * 敌机枚举
 */
export enum Enemy {
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