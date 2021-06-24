import { css, html, LitElement } from 'lit'
import './media-text'

class AudioItem extends LitElement {
  constructor () {
    super()
    this.audioTitle = ''
    this.audioDuration = ''
  }

  static get properties () {
    return {
      audioTitle: { attribute: 'audio-title' },
      audioDuration: { attribute: 'audio-duration' }
    }
  }

  static get styles () {
    return css`
      :host {
        box-sizing: border-box;
        display: flex;
        border-radius: var(--border-radious-base);
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.25);
        align-items: center;
        padding: 0.75rem 1.25rem 0.75rem 1.25rem;
        gap: 0.75rem;
      }

      span {
        display: inline-block;
      }
      
      media-text{
        width:100%;
      }
    `
  }

  render () {
    return html`
        <media-text value=${this.audioTitle ? this.audioTitle : ''}></media-text>
        <span>${this.audioDuration ? this.audioDuration : ''}</span>
    `
  }
}

window.customElements.define('audio-item', AudioItem)
