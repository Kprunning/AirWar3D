import {_decorator, Component} from 'cc'

const {ccclass, property} = _decorator

// 地图边界
const OUT_OF_RANGE: number = 50

@ccclass('Bullet')
export class Bullet extends Component {

  private _speed: number = 1
  private _isEnemy: boolean = false

  start() {

  }

  update(deltaTime: number) {
    let position = this.node.position
    let moveLength = this._isEnemy ? position.z + this._speed * deltaTime : position.z - this._speed * deltaTime
    this.node.setPosition(position.x, position.y, moveLength)
    if (Math.abs(moveLength) > Math.abs(OUT_OF_RANGE)) {
      this.node.destroy()
    }
  }

  init(speed: number, isEnemy: boolean = false) {
    this._speed = speed
    this._isEnemy = isEnemy
  }
}


