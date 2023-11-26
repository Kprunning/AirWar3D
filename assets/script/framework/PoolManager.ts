import {_decorator, Component, instantiate, Node, NodePool, Prefab} from 'cc'

const {ccclass, property} = _decorator

interface IDictPool {
  [name: string]: NodePool
}


@ccclass('PoolManager')
export class PoolManager extends Component {
  private _dictPool: IDictPool = {}
  private static _poolManager: PoolManager

  public static instance() {
    if (!this._poolManager) {
      this._poolManager = new PoolManager()
    }
    return this._poolManager
  }

  /**
   * 从节点池获取节点
   * @param prefab 预制体
   */
  public getNode(prefab: Prefab) {
    let node: Node = null
    const name = prefab.data.name
    let pool = this._dictPool[name]
    if (pool) {
      if (pool.size() > 0) {
        node = pool.get()
      } else {
        node = instantiate(prefab)
      }
    } else {
      this._dictPool[name] = new NodePool()
      node = instantiate(prefab)
    }
    node.active = true
    return node
  }


  /**
   * 将不用的节点放到节点池当中
   * @param node 不用的节点
   */
  public putNode(node: Node) {
    node.parent = null
    node.active = false
    const name = node.name
    if (!this._dictPool[name]) {
      this._dictPool[name] = new NodePool()
    }
    this._dictPool[name].put(node)
  }
}