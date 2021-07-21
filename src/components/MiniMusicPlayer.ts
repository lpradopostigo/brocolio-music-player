import { html, LitElement, svg, TemplateResult } from 'lit'
import { customElement, state } from 'lit/decorators.js'
import { ref, createRef } from 'lit/directives/ref.js'
import type { Ref } from 'lit/directives/ref.js'

import './MediaText'
import './MediaProgress'
import { MediaRole } from './MediaButton'
import { styles } from '../styles/MiniMusicPlayer.styles'
import { AudioState, store } from '../services/store'
import * as audioActions from '../services/audioActions'

import type MediaProgress from './MediaProgress'
import type { AudioMetadata } from '../services/AudioMetadataParser'
import AudioMetadataParser from '../services/AudioMetadataParser'
import { percentageToValue, valueToPercentage } from '../services/utilities'

@customElement('mini-music-player')
export class MiniMusicPlayer extends LitElement {
  static styles = styles
  static defaultAudioArt = svg`
        <svg class="audio-art__default" viewBox="0 0 114 108" xmlns="http://www.w3.org/2000/svg">
            <path d="M86.3333 22L43.6773 31.56V66.3333C35.7333 64.7627 27.6667 70.7893 27.6667 77.4107C27.6667 83.1093 32.1227 86 36.96 86C42.7067 86 48.992 81.9253 49 73.632V44.5653L81 38.008V61.0053C73.0667 59.44 65 65.4427 65 72.048C65 77.7627 69.5733 80.6667 74.3893 80.6667C80.096 80.6667 86.3253 76.5973 86.3333 68.304V22Z"
                  fill="white"/>
        </svg>`

  @state()
  audioMetadata: AudioMetadata | null = null

  @state()
  active = false

  @state()
  audioIsPlaying = false

  private readonly audioCurrentTime: () => (number | undefined)
  private readonly audioDuration: () => (number | undefined)
  private readonly seekBarRef: Ref<MediaProgress> = createRef()
  private seekBarIntervalId: NodeJS.Timeout | null = null

  constructor () {
    super()
    const {
      audioInformation:
        { duration, currentTime }
    } = store.getState()
    if (duration == null || currentTime == null) {
      throw Error('failed to retrieve audio time getters')
    }
    this.audioDuration = duration
    this.audioCurrentTime = currentTime

    this.handleActionDispatched = this.handleActionDispatched.bind(this)
    this.seekBarValue = this.seekBarValue.bind(this)
  }

  get audioArt (): TemplateResult {
    if (this.audioMetadata?.albumArt == null) {
      return MiniMusicPlayer.defaultAudioArt
    }
    const { data, format } = this.audioMetadata.albumArt
    const imageURL = URL.createObjectURL(new Blob([data], { type: format }))
    return html`<img src=${imageURL} alt="album-art">`
  }

  get audioTextMetadata (): TemplateResult<1> {
    if (this.active && this.audioMetadata != null) {
      return html`
          <media-text class="audio-title"
                      value=${this.audioMetadata.title}>
          </media-text>

          <media-text class="audio-artist"
                      value=${this.audioMetadata.artist}>
          </media-text>

          <media-text class="audio-album"
                      value=${this.audioMetadata.album}>
          </media-text>
      `
    }

    return html`<span>Nothing is playing</span>`
  }

  get mediaButtons (): Array<TemplateResult<1>> {
    const buttonPrevious = html`
        <media-button media-role=${MediaRole.PREVIOUS}></media-button>`
    const buttonNext = html`
        <media-button media-role=${MediaRole.NEXT}></media-button>`
    const buttonPlay = html`
        <media-button media-role=${MediaRole.PLAY} @click=${this.handlePlay}></media-button>`
    const buttonPause = html`
        <media-button media-role=${MediaRole.PAUSE} @click=${this.handlePause}></media-button>`

    return [buttonPrevious, this.active && this.audioIsPlaying ? buttonPause : buttonPlay, buttonNext]
  }

  handleSeek (): void {
    if (this.seekBarRef.value == null) {
      throw Error('Cannot retrieve seek bar')
    }

    const duration = this.audioDuration()
    if (duration != null) {
      store.dispatch(audioActions.seek(percentageToValue(this.seekBarRef.value.value, duration)))
    }
  }

  connectedCallback (): void {
    super.connectedCallback()
    store.subscribe(this.handleActionDispatched)
  }

  handleActionDispatched (): void {
    const { audioInformation: { state }, audioPlaylist: { files, currentIndex } } = store.getState()
    if (state === AudioState.PLAYING) {
      const metadataParser = new AudioMetadataParser(files[currentIndex])
      metadataParser.parse().then((metadata) => { this.audioMetadata = metadata }, (err) => { console.log(err) })
      this.active = true
      this.audioIsPlaying = true
      this.seekBarIntervalId = setInterval(this.seekBarValue, 1000)
    } else {
      this.audioIsPlaying = false
      if (this.seekBarIntervalId != null) {
        clearInterval(this.seekBarIntervalId)
      }
    }
  }

  render (): TemplateResult<1> {
    return html`
        <div class="audio-info__picture">
            ${this.audioArt}
        </div>

        <div class="audio-info__text">
            ${this.audioTextMetadata}
        </div>


        <div class="media-button-wrapper">
            ${this.mediaButtons}
        </div>
        <media-progress ${ref(this.seekBarRef)} class="slider-seek" @click=${this.handleSeek}></media-progress>
    `
  }

  handlePause (): void {
    store.dispatch(audioActions.pause())
  }

  handlePlay (): void {
    store.dispatch(audioActions.resume())
  }

  seekBarValue (): void {
    if (this.seekBarRef.value == null) {
      throw Error('Cannot retrieve seek bar')
    }

    const currentTime = this.audioCurrentTime()
    const duration = this.audioDuration()
    if (currentTime !== undefined && duration !== undefined) {
      this.seekBarRef.value.value = valueToPercentage(currentTime, duration)
    }
  }
}
