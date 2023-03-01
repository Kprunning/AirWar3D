import {_decorator, Component} from 'cc'

const {ccclass} = _decorator


const OUT_OF_BOTTOM: number = 50

@ccclass('EnemyPlane')
export class EnemyPlane extends Component {
  // 敌机速度,通过gameManager设置
  private _speed: number = 0

  start() {

  }

  update(deltaTime: number) {
    let position = this.node.getPosition()
    let z = position.z + this._speed * deltaTime
    this.node.setPosition(position.x, position.y, z)
    // 超出屏幕下方销毁敌机
    if (z > OUT_OF_BOTTOM) {
      this.node.destroy()
    }
  }

  set speed(value: number) {
    this._speed = value
  }
}


