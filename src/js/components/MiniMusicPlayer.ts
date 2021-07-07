import { html, LitElement, svg, TemplateResult } from 'lit'
import { customElement, property, state } from 'lit/decorators.js'

import './MediaText'
import './MediaProgress'
import MediaButton, { MediaRole } from './MediaButton'
import { styles } from './MiniMusicPlayer.styles'

import type MediaProgress from './MediaProgress'
import type { IAudioMetadata } from '../services/AudioMetadataParser'

@customElement('mini-music-player')
export default class MiniMusicPlayer extends LitElement {
  static styles = styles
  static defaultAudioArt = svg`
        <svg class="audio-art__default" viewBox="0 0 114 108" xmlns="http://www.w3.org/2000/svg">
            <path d="M86.3333 22L43.6773 31.56V66.3333C35.7333 64.7627 27.6667 70.7893 27.6667 77.4107C27.6667 83.1093 32.1227 86 36.96 86C42.7067 86 48.992 81.9253 49 73.632V44.5653L81 38.008V61.0053C73.0667 59.44 65 65.4427 65 72.048C65 77.7627 69.5733 80.6667 74.3893 80.6667C80.096 80.6667 86.3253 76.5973 86.3333 68.304V22Z"
                  fill="white"/>
        </svg>`

  active = false
  buttonPlay = new MediaButton(MediaRole.Play)
  buttonPause = new MediaButton(MediaRole.Pause)
  buttonPrevious = new MediaButton(MediaRole.Previous)
  buttonNext = new MediaButton(MediaRole.Next)
  sliderSeek: MediaProgress | null = null

  @state()
  currentAudioData: IAudioMetadata | null = null

  get audioArt (): TemplateResult {
    if (this.currentAudioData?.albumArt == null) {
      return MiniMusicPlayer.defaultAudioArt
    }
    const { data, format } = this.currentAudioData.albumArt
    const imageURL = URL.createObjectURL(new Blob([data], { type: format }))
    return html`<img src=${imageURL} alt="album-art">`
  }

  get audioTextMetadata (): TemplateResult {
    if (this.active && this.currentAudioData != null) {
      return html`
          <media-text class="audio-title"
                      value=${this.currentAudioData.title}>
          </media-text>

          <media-text class="audio-artist"
                      value=${this.currentAudioData.artist}>
          </media-text>

          <media-text class="audio-album"
                      value=${this.currentAudioData.album}>
          </media-text>
      `
    }

    return html`<span>Nothing is playing</span>`
  }

  //
  // seek () {
  //   if (this.player != null) {
  //     this.player.currentTime = percentageToValue(this.sliderSeek.value, this.player.duration)
  //   }
  // }

  get mediaButtons (): MediaButton[] {
    return [this.buttonPrevious, this.active ? this.buttonPause : this.buttonPlay, this.buttonNext]
  }

  render (): TemplateResult {
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
        <media-progress class="slider-seek"></media-progress>
    `
  }

  connectedCallback (): void {
    super.connectedCallback()
    this.addEventListener('play', () => { console.log('play received') })
  }

  // onPause () {
  //   this.player?.pause()
  //   this.buttonPause.style.display = 'none'
  //   this.buttonPlay.style.display = 'initial'
  // }
  //
  // onPlay () {
  //   this.player?.play()
  //   this.buttonPause.style.display = 'initial'
  //   this.buttonPlay.style.display = 'none'
  // }
}
