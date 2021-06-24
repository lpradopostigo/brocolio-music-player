import { css, html, LitElement } from 'lit'
import { until } from 'lit/directives/until.js'
import '@github/file-attachment-element'
import './audio-item'
import { parseBlob } from 'music-metadata-browser'
import { Buffer } from 'buffer'

// polyfill for music-metadata-browser
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

  static get properties () {
    return { attachments: { state: true } }
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
        height: 100%;
      }

      audio-item {
        width: 90%;
      }
    `
  }

  render () {
    return html`
        <file-attachment>
            <label for="input-file">Start adding some files </label>
            <input type="file" id="input-file" accept="audio/*" multiple>

            ${this.attachments.map(({ file }) => {
                const content = parseBlob(file).then(
                        ({
                            common: {
                                title,
                                artist,
                                album,
                                picture
                            },
                            format: { duration }
                        }) => {
                            const data = { file, title, artist, album, picture }

                            return html`
                                <audio-item @click=${() => { this.dispatchAudioData(data) }}
                                            audio-title=${title} audio-duration=${this.formatDuration(duration)}>`
                        }
                )

                return html`${until(content, null)}`
            })}
        </file-attachment>
    `
  }

  dispatchAudioData ({ file, title, artist, album, picture }) {
    const audioSelectedEvent = new CustomEvent('audio-selected',
      {
        detail: {
          file: file,
          title: title,
          artist: artist,
          album: album,
          picture: picture
        }
      })

    this.audioPlayer.dispatchEvent(audioSelectedEvent)
  }

  firstUpdated (_changedProperties) {
    this.fileInputLabel = this.shadowRoot.querySelector('label')
    this.fileAttachment = this.shadowRoot.querySelector('file-attachment')

    this.fileAttachment.addEventListener('file-attachment-accepted', (e) => { this.handleAttachmentAccepted(e) })
  }

  formatDuration (duration) {
    const minutes = Math.trunc(duration / 60)
    const seconds = Math.trunc(duration % 60)
    return `${minutes < 10 ? '0' + minutes : minutes}:${seconds < 10 ? '0' + seconds : seconds}`
  }

  handleAttachmentAccepted ({ detail: { attachments } }) {
    this.fileInputLabel.style.display = 'none'
    this.attachments = attachments
  }
}

window.customElements.define('audio-playlist', AudioPlaylist)
