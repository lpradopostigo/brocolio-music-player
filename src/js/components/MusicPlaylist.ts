import { html, LitElement, TemplateResult } from 'lit'
import { until } from 'lit/directives/until.js'
import FileAttachmentElement from '@github/file-attachment-element'
import type { Attachment } from '@github/file-attachment-element'
import AudioMetadataParser from '../services/AudioMetadataParser'

import './MusicPlaylistItem'
import { styles } from './MusicPlaylist.styles'
import { customElement, state } from 'lit/decorators.js'
import type MusicPlaylistItem from './MusicPlaylistItem'

declare global {
  interface HTMLElementEventMap {
    'file-attachment-accepted': CustomEvent
  }
}

@customElement('music-playlist')
export default class MusicPlaylist extends LitElement {
  static styles = styles
  @state()
  attachments: Attachment[] = []

  private fileAttachment: FileAttachmentElement | null = null
  private fileInputLabel: HTMLLabelElement | null = null
  private selectedAudioItem: MusicPlaylistItem | null = null

  constructor () {
    super()
    this.handleAttachmentAccepted = this.handleAttachmentAccepted.bind(this)
  }

  get playlistItems (): TemplateResult[] {
    return this.attachments.map(({ file }) => {
      const metadataParser = new AudioMetadataParser(file)
      const content = metadataParser.parse().then((data) => {
        return html`
            <audio-item @click=${(e: MouseEvent) => { this.handleAudioItemClick(e, file) }}
                        audio-title=${data.title}
                        audio-duration=${data.duration}>`
      })
      return html`${until(content, null)}`
    })
  }

  handleAudioItemClick (e: MouseEvent, file: File): void {
    const target = e.target as MusicPlaylistItem

    if (this.selectedAudioItem != null) {
      this.selectedAudioItem.active = false
    }
    this.selectedAudioItem = target
    this.selectedAudioItem.active = true
  }

  render (): TemplateResult {
    return html`
        <file-attachment>
            <label for="input-file">Start adding some files </label>
            <input type="file" id="input-file" accept="audio/*" multiple>
            ${this.playlistItems}
        </file-attachment>
    `
  }

  firstUpdated (): void {
    if (this.shadowRoot == null) {
      throw Error('Cannot get ShadowRoot')
    }

    this.fileInputLabel = this.shadowRoot.querySelector('label')
    this.fileAttachment = this.shadowRoot.querySelector('file-attachment')
    this.addEventListener('file-attachment-accepted', this.handleAttachmentAccepted)
  }

  handleAttachmentAccepted (e: CustomEvent): void {
    const { detail: { attachments } } = e
    this.fileInputLabel?.classList.add('label--hidden')
    this.attachments = attachments
  }
}
