import { html, LitElement, TemplateResult } from 'lit'
import { customElement } from 'lit/decorators.js'
import './MiniMusicPlayer'
import './MusicPlaylist'
import AudioPlayer from '../services/AudioPlayer'
import { styles } from './MusicPlayer.styles'

@customElement('music-player')
export default class MusicPlayer extends LitElement {
  static styles = styles
  private readonly audioPlayer = new AudioPlayer()

  render (): TemplateResult {
    return html`
        <mini-music-player></mini-music-player>
        <music-playlist></music-playlist>
    `
  }
}
