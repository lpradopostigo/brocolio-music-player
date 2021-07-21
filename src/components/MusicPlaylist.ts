import { html, LitElement, TemplateResult } from 'lit'
import { until } from 'lit/directives/until.js'
import './FileAttachment'
import type { Attachment, FileAttachmentElement } from './FileAttachment'
import AudioMetadataParser from '../services/AudioMetadataParser'

import './MusicPlaylistItem'
import { styles } from '../styles/MusicPlaylist.styles'
import { customElement, state } from 'lit/decorators.js'
import type MusicPlaylistItem from './MusicPlaylistItem'
import { store } from '../services/store'
import * as audioActions from '../services/audioActions'
import { AudioActionType } from '../services/audioActions'

@customElement('music-playlist')
export class MusicPlaylist extends LitElement {
  static styles = styles
  @state() playlistItems: Array<TemplateResult<1>> = []

  private fileAttachment: FileAttachmentElement | null = null
  private fileInputLabel: HTMLLabelElement | null = null
  private selectedAudioItem: MusicPlaylistItem | null = null

  constructor () {
    super()
    this.handleAttachmentAccepted = this.handleAttachmentAccepted.bind(this)
    this.handleAddPlaylist = this.handleAddPlaylist.bind(this)
  }

  connectedCallback (): void {
    super.connectedCallback()
    store.subscribe(this.handleAddPlaylist)
  }

  handleAddPlaylist (): void {
    const { lastActionType, audioPlaylist: { files } } = store.getState()
    if (lastActionType === AudioActionType.ADD_PLAYLIST) {
      this.playlistItems = files.map((file, index) => {
        const metadataParser = new AudioMetadataParser(file)
        const content = metadataParser.parse().then((data) => {
          return html`
              <audio-item @click=${(event: MouseEvent) => { this.handleAudioItemClick(event, index) }}
                          audio-title=${data.title}
                          audio-duration=${data.duration}>`
        })
        return html`${until(content, null)}`
      })
    }
  }

  handleAudioItemClick (event: MouseEvent, index: number): void {
    if (this.selectedAudioItem != null) {
      this.selectedAudioItem.active = false
    }
    store.dispatch(audioActions.play(index))
    this.selectedAudioItem = event.target as MusicPlaylistItem
    this.selectedAudioItem.active = true
  }

  render (): TemplateResult<1> {
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
      throw Error('cannot get ShadowRoot')
    }

    this.fileInputLabel = this.shadowRoot.querySelector('label')
    this.fileAttachment = this.shadowRoot.querySelector('file-attachment')
    this.fileAttachment?.addEventListener('file-attachment-accepted', this.handleAttachmentAccepted)
  }

  handleAttachmentAccepted (e: CustomEvent): void {
    this.fileInputLabel?.classList.add('label--hidden')

    const attachments = e.detail.attachments as Attachment[]
    const files = attachments.map(attachment => attachment.file)
    store.dispatch(audioActions.addPlaylist(files))
  }
}
