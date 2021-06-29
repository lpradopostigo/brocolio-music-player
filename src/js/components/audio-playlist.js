import { html, LitElement } from 'lit'
import { until } from 'lit/directives/until.js'
import '@github/file-attachment-element'
import './audio-item'
import { parseBlob } from 'music-metadata-browser'
import { Buffer } from 'buffer'
import { styles } from './audio-playlist.styles'

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
    this.selectedAudioItem = null
    this.audioPlayer = document.querySelector('audio-player')

    this.handleAttachmentAccepted = this.handleAttachmentAccepted.bind(this)
  }

  static get properties () {
    return { attachments: { state: true } }
  }

  static get styles () {
    return styles
  }

  get playlistItems () {
    return this.attachments.map(({ file }) => {
      const content = this.getAudioData(file).then((data) => {
        return html`
            <audio-item @click=${(e) => { this.handleAudioItemClick(e, data) }}
                        audio-title=${data.title}
                        audio-duration=${this.formatDuration(data.duration)}>`
      })
      return html`${until(content, null)}`
    })
  }

  handleAudioItemClick (e, data) {
    this.dispatchAudioData(data)
    if (this.selectedAudioItem != null) {
      this.selectedAudioItem.active = false
    }
    this.selectedAudioItem = e.target
    e.target.active = true
  }

  getAudioData (file) {
    return new Promise((resolve, reject) => {
      parseBlob(file).then(
        ({
          common: {
            title,
            artist,
            album,
            picture
          },
          format: { duration }
        }) => { resolve({ file, title, artist, album, picture, duration }) })
        .catch((err) => { reject(err) })
    })
  }

  render () {
    return html`
        <file-attachment>
            <label for="input-file">Start adding some files </label>
            <input type="file" id="input-file" accept="audio/*" multiple>
            ${this.playlistItems}
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

    this.fileAttachment.addEventListener('file-attachment-accepted', this.handleAttachmentAccepted)
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
