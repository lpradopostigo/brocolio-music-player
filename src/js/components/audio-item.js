import { html, LitElement } from 'lit'
import './media-text'
import { styles } from './audio-item.styles'

class AudioItem extends LitElement {
  constructor () {
    super()
    this.audioTitle = ''
    this.audioDuration = ''
    this.active = false
  }

  static get properties () {
    return {
      audioTitle: { attribute: 'audio-title' },
      audioDuration: { attribute: 'audio-duration' },
      active: { type: Boolean }
    }
  }

  static get styles () {
    return styles
  }

  render () {
    return html`
        <div class=${this.active ? 'active' : ''}>
            <media-text value=${this.audioTitle ? this.audioTitle : ''}></media-text>
            <span>${this.audioDuration ? this.audioDuration : ''}</span>
        </div>
    `
  }
}

window.customElements.define('audio-item', AudioItem)
