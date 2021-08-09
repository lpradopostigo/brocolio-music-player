import { html, LitElement, svg, TemplateResult } from 'lit'
import { customElement, state } from 'lit/decorators.js'
import { createRef, ref } from 'lit/directives/ref.js'

import '../media-text/media-text'
import '../media-progress/media-progress'
import { MediaRole } from '../media-button/media-button'
import { styles } from './mini-music-player.styles'
import { AudioState, reduxStore } from '../../services/redux-store'
import * as audioActions from '../../redux-actions/audio-actions'
import { AudioActionType } from '../../redux-actions/audio-actions'
import type { AudioMetadata } from '../../services/audio-metadata-parser'
import { AudioMetadataParser } from '../../services/audio-metadata-parser'
import { percentageToValue, valueToPercentage } from '../../services/utilities'

import type { MediaProgress } from '../media-progress/media-progress'

@customElement('mini-music-player')
export class MiniMusicPlayer extends LitElement {
  static styles = styles
  static defaultAudioArt = svg`
        <svg class="audio-art__default" viewBox="0 0 114 108" xmlns="http://www.w3.org/2000/svg">
            <path d="M86.3333 22L43.6773 31.56V66.3333C35.7333 64.7627 27.6667 70.7893 27.6667 77.4107C27.6667 83.1093 32.1227 86 36.96 86C42.7067 86 48.992 81.9253 49 73.632V44.5653L81 38.008V61.0053C73.0667 59.44 65 65.4427 65 72.048C65 77.7627 69.5733 80.6667 74.3893 80.6667C80.096 80.6667 86.3253 76.5973 86.3333 68.304V22Z"
                  fill="white"/>
        </svg>`

  @state() audioMetadata: AudioMetadata | null = null
  @state() active = false
  @state() audioIsPlaying = false
  private readonly audioCurrentTime: () => (number | undefined)
  private readonly audioDuration: () => (number | undefined)
  private readonly seekBarRef = createRef<MediaProgress>()
  private seekBarIntervalId: NodeJS.Timeout | null = null

  constructor () {
    super()
    const { audioInformation: { duration, currentTime } } = reduxStore.getState()
    if (duration == null || currentTime == null) {
      throw Error('failed to retrieve audio time getters')
    }

    this.audioDuration = duration
    this.audioCurrentTime = currentTime

    this.handleActionDispatched = this.handleActionDispatched.bind(this)
    this.updateSeekBarValue = this.updateSeekBarValue.bind(this)
    this.handleSeek = this.handleSeek.bind(this)
  }

  private get audioArt (): TemplateResult {
    if (this.audioMetadata?.albumArt == null) return MiniMusicPlayer.defaultAudioArt
    const { data, format } = this.audioMetadata.albumArt
    const imageURL = URL.createObjectURL(new Blob([data], { type: format }))
    return html`<img src=${imageURL} alt="album-art">`
  }

  private get audioTextMetadata (): TemplateResult<1> {
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

  private get mediaButtons (): Array<TemplateResult<1>> {
    const buttonPrevious = html`
        <media-button media-role=${MediaRole.PREVIOUS} @click=${MiniMusicPlayer.handlePrevious}></media-button>`
    const buttonNext = html`
        <media-button media-role=${MediaRole.NEXT} @click=${MiniMusicPlayer.handleNext}></media-button>`
    const buttonPlay = html`
        <media-button media-role=${MediaRole.PLAY} @click=${MiniMusicPlayer.handlePlay}></media-button>`
    const buttonPause = html`
        <media-button media-role=${MediaRole.PAUSE} @click=${MiniMusicPlayer.handlePause}></media-button>`

    return [buttonPrevious, this.active && this.audioIsPlaying ? buttonPause : buttonPlay, buttonNext]
  }

  private static handlePause (): void {
    reduxStore.dispatch(audioActions.pause())
  }

  private static handlePlay (): void {
    reduxStore.dispatch(audioActions.resume())
  }

  private static handleNext (): void {
    reduxStore.dispatch(audioActions.next())
  }

  private static handlePrevious (): void {
    reduxStore.dispatch(audioActions.previous())
  }

  // todo unsubscribe
  connectedCallback (): void {
    super.connectedCallback()
    reduxStore.subscribe(this.handleActionDispatched)
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
        <media-progress ?disabled=${!this.active}
                        ${ref(this.seekBarRef)}
                        class="slider-seek"
                        @click=${this.handleSeek}></media-progress>
    `
  }

  private handleSeek (): void {
    if (!this.active) return
    if (this.seekBarRef.value == null) throw Error('cannot retrieve seek bar')

    const duration = this.audioDuration()
    if (duration != null) {
      reduxStore.dispatch(audioActions.seek(percentageToValue(this.seekBarRef.value.value, duration)))
    }
  }

  // todo clear interval
  private handleActionDispatched (): void {
    const {
      audioInformation: { state },
      lastActionType,
      audioPlaylist: { files, currentIndex }
    } = reduxStore.getState()
    this.audioIsPlaying = state === AudioState.PLAYING

    switch (lastActionType) {
      case AudioActionType.PLAY: {
        if (currentIndex == null) {
          throw Error('index is missing')
        }
        const metadataParser = new AudioMetadataParser(files[currentIndex])
        metadataParser.parse().then((metadata) => { this.audioMetadata = metadata }, (err) => { console.log(err) })
        this.active = true
        this.seekBarIntervalId = setInterval(this.updateSeekBarValue, 500)
        break
      }
    }
  }

  private updateSeekBarValue (): void {
    if (this.seekBarRef.value == null) throw Error('cannot retrieve seek bar')

    const currentTime = this.audioCurrentTime()
    const duration = this.audioDuration()
    if (currentTime !== undefined && duration !== undefined) {
      this.seekBarRef.value.value = valueToPercentage(currentTime, duration)
    }
  }
}
