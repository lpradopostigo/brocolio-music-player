import { html, LitElement, TemplateResult } from 'lit'
import './MediaText'
import { styles } from './AudioItem.styles'
import { customElement, property } from 'lit/decorators.js'

@customElement('audio-item')
export default class AudioItem extends LitElement {
  static styles = styles
  @property({ attribute: 'audio-title' })
  audioTitle = ''

  @property({ attribute: 'audio-duration', type: Number })
  audioDuration = 0

  @property({ type: Boolean })
  active = false

  render (): TemplateResult {
    return html`
        <div class=${this.active ? 'active' : ''}>
            <media-text value=${this.audioTitle}></media-text>
            <span>${this.audioDuration}</span>
        </div>
    `
  }
}
