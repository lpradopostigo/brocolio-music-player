import { html, LitElement, TemplateResult } from 'lit'
import './MediaText'
import { styles } from '../styles/MusicPlaylistItem.styles'
import { customElement, property } from 'lit/decorators.js'

@customElement('audio-item')
export default class MusicPlaylistItem extends LitElement {
  static styles = styles
  @property({ attribute: 'audio-title' })
  audioTitle = ''

  @property({ attribute: 'audio-duration', type: Number })
  audioDuration = 0

  @property({ type: Boolean })
  active = false

  get formattedAudioDuration (): string {
    const minutes = Math.trunc(this.audioDuration / 60)
    const seconds = Math.trunc(this.audioDuration % 60)

    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes.toString()
    const formattedSeconds = seconds < 10 ? `0${seconds}` : seconds.toString()

    return `${formattedMinutes}:${formattedSeconds}`
  }

  render (): TemplateResult {
    return html`
        <div class=${this.active ? 'active' : ''}>
            <media-text value=${this.audioTitle}></media-text>
            <span>${this.formattedAudioDuration}</span>
        </div>
    `
  }
}
