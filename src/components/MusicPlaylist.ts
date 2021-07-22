import { html, LitElement, TemplateResult } from 'lit'
import { until } from 'lit/directives/until.js'
import './FileAttachment'
import type { Attachment, FileAttachmentElement } from './FileAttachment'
import AudioMetadataParser from '../services/AudioMetadataParser'

import './MusicPlaylistItem'
import { styles } from '../styles/MusicPlaylist.styles'
import { customElement, state } from 'lit/decorators.js'
import type MusicPlaylistItem from './MusicPlaylistItem'
import { store, StoreState } from '../services/store'
import * as audioActions from '../services/audioActions'
import { AudioActionType } from '../services/audioActions'
import { Ref, createRef, ref } from 'lit/directives/ref.js'

@customElement('music-playlist')
export class MusicPlaylist extends LitElement {
  static styles = styles

  @state() playlistItems: Array<TemplateResult<1>> = []

  private playlistItemRefs: Array<Ref<MusicPlaylistItem>> = []
  private fileAttachment: FileAttachmentElement | null = null
  private fileInputLabel: HTMLLabelElement | null = null
  private selectedPlaylistItem: MusicPlaylistItem | null = null

  constructor () {
    super()
    this.handleAttachmentAccepted = this.handleAttachmentAccepted.bind(this)
    this.handleAddPlaylist = this.handleAddPlaylist.bind(this)
    this.handleAudioItemClick = this.handleAudioItemClick.bind(this)
    this.handleActionDispatched = this.handleActionDispatched.bind(this)
  }

  connectedCallback (): void {
    super.connectedCallback()
    store.subscribe(this.handleActionDispatched)
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

  private handleAddPlaylist (state: StoreState): void {
    const { audioPlaylist: { files } } = state

    this.playlistItemRefs = new Array(files.length)
    for (let i = 0; i < this.playlistItemRefs.length; i += 1) {
      this.playlistItemRefs[i] = createRef<MusicPlaylistItem>()
    }

    this.playlistItems = files.map((file, index) => {
      const metadataParser = new AudioMetadataParser(file)
      const content = metadataParser.parse().then((data) => {
        return html`
            <audio-item @click=${(event: MouseEvent) => { this.handleAudioItemClick(event, index) }}
                        audio-title=${data.title}
                        audio-duration=${data.duration} ${ref(this.playlistItemRefs[index])}>`
      })
      return html`${until(content, null)}`
    })
  }

  private handleActionDispatched (): void {
    const state = store.getState()
    const { lastActionType, audioPlaylist: { currentIndex } } = state
    switch (lastActionType) {
      case AudioActionType.ADD_PLAYLIST:
        this.handleAddPlaylist(state)
        break

      case AudioActionType.PREVIOUS:
      case AudioActionType.NEXT:
        if (currentIndex != null) {
          const playlistItem = this.playlistItemRefs[currentIndex]?.value
          if (playlistItem != null) this.selectPlaylistItem(playlistItem)
        }
        break
    }
  }

  private handleAudioItemClick (event: MouseEvent, index: number): void {
    store.dispatch(audioActions.play(index))

    const target = event.target as MusicPlaylistItem
    this.selectPlaylistItem(target)
  }

  private selectPlaylistItem (playlistItem: MusicPlaylistItem): void {
    if (this.selectedPlaylistItem != null) {
      this.selectedPlaylistItem.active = false
    }
    playlistItem.active = true
    this.selectedPlaylistItem = playlistItem
  }

  private handleAttachmentAccepted (e: CustomEvent): void {
    this.fileInputLabel?.classList.add('label--hidden')

    const attachments = e.detail.attachments as Attachment[]
    const files = attachments.map(attachment => attachment.file)
    store.dispatch(audioActions.addPlaylist(files))
  }
}
