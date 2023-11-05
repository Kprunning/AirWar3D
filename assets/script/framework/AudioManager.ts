import {_decorator, AudioClip, AudioSource, Component} from 'cc'

const {ccclass, property} = _decorator

interface IAudioMap {
  [name: string]: AudioClip
}


@ccclass('AudioManager')
export class AudioManager extends Component {
  @property([AudioClip])
  public audioList: AudioClip[] = []

  private _dict: IAudioMap = {}
  private _audioSource: AudioSource = null

  start() {
    this.audioList.forEach(item => {
      this._dict[item.name] = item
    })

    this._audioSource = this.getComponent(AudioSource)
  }


  public play(name: string) {
    const audioClip = this._dict[name]
    if (audioClip) {
      this._audioSource.playOneShot(audioClip)
    }
  }

}


