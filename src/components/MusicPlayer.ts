import { html, LitElement, TemplateResult } from 'lit'
import { customElement } from 'lit/decorators.js'
import './MusicPlaylist'
import './MiniMusicPlayer'
import { AudioPlayer } from '../services/AudioPlayer'
import { styles } from '../styles/MusicPlayer.styles'
import { store } from '../services/store'
import { Unsubscribe } from '@reduxjs/toolkit'
import * as initActions from '../services/initActions'
import { AudioActionType } from '../services/audioActions'

@customElement('music-player')
export class MusicPlayer extends LitElement {
  static styles = styles
  private readonly audioPlayer = new AudioPlayer()
  private storeUnsubscribe: Unsubscribe | null = null

  constructor () {
    super()
    store.dispatch(initActions.setAudioGetters(
      () => { return this.audioPlayer.currentTime },
      () => { return this.audioPlayer.duration }))
    this.handleActionDispatched = this.handleActionDispatched.bind(this)
  }

  render (): TemplateResult<1> {
    return html`
        <mini-music-player></mini-music-player>
        <music-playlist></music-playlist>
    `
  }

  connectedCallback (): void {
    super.connectedCallback()
    this.storeUnsubscribe = store.subscribe(this.handleActionDispatched)
  }

  disconnectedCallback (): void {
    super.disconnectedCallback()
    if (this.storeUnsubscribe == null) {
      throw Error('Cannot Unsubscribe')
    }
    this.storeUnsubscribe()
  }

  handleActionDispatched (): void {
    const { lastActionType, audioPlaylist: { files, currentIndex }, audioSeekTime } = store.getState()
    switch (lastActionType) {
      case AudioActionType.PLAY: {
        this.audioPlayer.changeAudio(files[currentIndex])
        this.audioPlayer.play()
        break
      }

      case AudioActionType.RESUME: {
        this.audioPlayer.play()
        break
      }

      case AudioActionType.PAUSE: {
        this.audioPlayer.pause()
        break
      }

      case AudioActionType.SEEK: {
        if (audioSeekTime != null) {
          this.audioPlayer.seek(audioSeekTime)
        }
        break
      }
    }
  }
}
