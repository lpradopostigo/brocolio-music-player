import { css, html, LitElement } from 'lit'

class AudioItem extends LitElement {
  constructor () {
    super()
    this.audioTitle = null
    this.audioDuration = null
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
        display: flex;
        border-radius: var(--border-radious-base);
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.25);
        align-items: center;
        justify-content: space-between;
        padding: 0.75rem 1.25rem 0.75rem 1.25rem;
      }

      span {
        display: inline-block;
      }
    `
  }

  render () {
    return html`
        <span>${this.audioTitle ? this.audioTitle : 'unknown'}</span>
        <span>${this.audioDuration ? this.audioDuration : '--:--'}</span>
    `
  }
}

window.customElements.define('audio-item', AudioItem)
