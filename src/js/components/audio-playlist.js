import { css, html, LitElement } from 'lit'
import { until } from 'lit/directives/until.js'
import '@github/file-attachment-element'
import './audio-item'
import * as musicMetadata from 'music-metadata-browser'
// polyfill for music-metadata-browser
import { Buffer } from 'buffer'

if (!window.buffer) {
  window.Buffer = Buffer
}

class AudioPlaylist extends LitElement {
  constructor () {
    super()
    this.fileInputLabel = null
    this.fileAttachment = null
    this.attachments = []
    this.audioPlayer = document.querySelector('audio-player')
  }

  static get styles () {
    return css`
      :host {
        display: block;
      }

      label {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        height: 100%;
        cursor: pointer;
        color: var(--color-secondary-light);
      }

      input {
        opacity: 0;
        width: 0;
        height: 0;
      }


      file-attachment {
        display: flex;
        flex-direction: column;
        gap: 1rem;
        align-items: center;
      }

      audio-item {
        width: 80%;
      }

    `
  }

  render () {
    return html`
        <file-attachment>
            <label for="input-file">Add some files </label>
            <input type="file" id="input-file" accept="audio/*" multiple>

            ${this.attachments.map((attachment) => {
                const content = musicMetadata.parseBlob(attachment.file).then(
                        (metadata) => {
                            const { common: { title, artist, album, picture }, format: { duration } } = metadata
                            const audioSelectedEvent = new CustomEvent('audio-selected',
                                    { detail: { file: attachment.file, title: title, artist: artist, album: album, picture: picture } })

                            return html`
                                <audio-item @click=${() => { this.audioPlayer.dispatchEvent(audioSelectedEvent) }}
                                            audio-title=${title} audio-duration=${this.formatDuration(duration)}>`
                        }
                )
                return html`
                    ${until(content, null)}
                `
            })}
        </file-attachment>
    `
  }

  firstUpdated (_changedProperties) {
    this.fileInputLabel = this.shadowRoot.querySelector('label')
    this.fileAttachment = this.shadowRoot.querySelector('file-attachment')

    this.fileAttachment.addEventListener('file-attachment-accepted', (e) => {
      this.fileInputLabel.style.display = 'none'
      this.attachments = e.detail.attachments
      this.requestUpdate()
    })
    this.fileAttachment.style.height = `${this.getBoundingClientRect().height}px`
  }

  formatDuration (duration) {
    const minutes = Math.trunc(duration / 60)
    const seconds = Math.trunc(duration % 60)
    return `${minutes < 10 ? '0' + minutes : minutes}:${seconds < 10 ? '0' + seconds : seconds}`
  }
}

window.customElements.define('audio-playlist', AudioPlaylist)
