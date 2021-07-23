import { html, LitElement, TemplateResult } from 'lit'
import { customElement } from 'lit/decorators.js'
import '../music-playlist/music-playlist'
import '../mini-music-player/mini-music-player'
import { AudioPlayer } from '../../services/audio-player'
import { styles } from './music-player.styles'
import { reduxStore } from '../../services/redux-store'
import { Unsubscribe } from '@reduxjs/toolkit'
import * as initActions from '../../redux-actions/init-actions'
import { AudioActionType } from '../../redux-actions/audio-actions'

@customElement('music-player')
export class MusicPlayer extends LitElement {
  static styles = styles
  private readonly audioPlayer = new AudioPlayer()
  private storeUnsubscribe: Unsubscribe | null = null

  constructor () {
    super()
    reduxStore.dispatch(initActions.setAudioGetters(
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
    this.storeUnsubscribe = reduxStore.subscribe(this.handleActionDispatched)
  }

  disconnectedCallback (): void {
    super.disconnectedCallback()
    if (this.storeUnsubscribe == null) {
      throw Error('Cannot Unsubscribe')
    }
    this.storeUnsubscribe()
  }

  handleActionDispatched (): void {
    const { lastActionType, audioPlaylist: { files, currentIndex }, audioSeekTime } = reduxStore.getState()
    switch (lastActionType) {
      case AudioActionType.PLAY: {
        if (currentIndex != null) {
          this.audioPlayer.changeAudio(files[currentIndex])
          this.audioPlayer.play()
        }
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

      case AudioActionType.NEXT: {
        if (currentIndex != null) {
          this.audioPlayer.changeAudio(files[currentIndex])
          this.audioPlayer.play()
        }
        break
      }

      case AudioActionType.PREVIOUS: {
        if (currentIndex != null) {
          this.audioPlayer.changeAudio(files[currentIndex])
          this.audioPlayer.play()
        }
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
