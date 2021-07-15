import { html, LitElement, TemplateResult } from 'lit'
import { customElement } from 'lit/decorators.js'
import './MiniMusicPlayer'
import './MusicPlaylist'
import AudioPlayer from '../services/AudioPlayer'
import { styles } from './MusicPlayer.styles'
import { AudioActionType, store } from '../services/store'
import { Unsubscribe } from '@reduxjs/toolkit'

@customElement('music-player')
export default class MusicPlayer extends LitElement {
  static styles = styles
  private readonly audioPlayer = new AudioPlayer()
  private storeUnsubscribe: Unsubscribe | null = null

  constructor () {
    super()
    this.handleActionDispatched = this.handleActionDispatched.bind(this)
  }

  render (): TemplateResult {
    return html`
        <mini-music-player></mini-music-player>
        <music-playlist></music-playlist>
    `
  }

  connectedCallback (): void {
    super.connectedCallback()
    this.storeUnsubscribe = store.subscribe(this.handleActionDispatched)
  }

  handleActionDispatched (): void {
    const state = store.getState()
    switch (state.lastActionType) {
      case AudioActionType.PLAY: {
        this.audioPlayer.changeAudio(state.audioFile)
        this.audioPlayer.play()
      }
    }
  }
}
