import { html, LitElement } from 'lit'
import './media-text'
import './media-progress'
import './media-button'
import { percentageToValue, valueToPercentage } from '../utils'
import { styles } from './audio-player.styles'

class AudioPlayer extends LitElement {
  constructor () {
    super()
    this.currentAudio = null

    this.buttonPlay = undefined
    this.buttonPause = undefined
    this.sliderSeek = undefined

    this.audioDetails = undefined
    this.currentData = {}
    this.currentAudioTime = 0

    this.handleAudioSelected = this.handleAudioSelected.bind(this)
    this.seek = this.seek.bind(this)
  }

  static get properties () {
    return {
      currentAudioTime: { state: true },
      currentAudio: { state: true }
    }
  }

  static get styles () {
    return styles
  }

  static get audioArtDefault () {
    return html`
        <svg class="audio-art__default" viewBox="0 0 114 108" xmlns="http://www.w3.org/2000/svg">
            <path d="M86.3333 22L43.6773 31.56V66.3333C35.7333 64.7627 27.6667 70.7893 27.6667 77.4107C27.6667 83.1093 32.1227 86 36.96 86C42.7067 86 48.992 81.9253 49 73.632V44.5653L81 38.008V61.0053C73.0667 59.44 65 65.4427 65 72.048C65 77.7627 69.5733 80.6667 74.3893 80.6667C80.096 80.6667 86.3253 76.5973 86.3333 68.304V22Z"
                  fill="white"/>
        </svg>`
  }

  get audioArt () {
    if (this.currentData?.picture == null) {
      return AudioPlayer.audioArtDefault
    }
    const { data, format } = this.currentData.picture[0]
    const imageURL = URL.createObjectURL(new Blob([data], { type: format }))
    return html`<img src=${imageURL} alt="album-art">`
  }

  firstUpdated (_changedProperties) {
    this.buttonPlay = this.shadowRoot.querySelector('.button-play')
    this.buttonPause = this.shadowRoot.querySelector('.button-pause')
    this.audioDetails = this.shadowRoot.querySelector('.audio-info__text')
    this.sliderSeek = this.shadowRoot.querySelector('.slider-seek')

    this.sliderSeek.addEventListener('click', this.seek)
  }

  seek () {
    if (this.currentAudio != null) {
      this.currentAudio.currentTime = percentageToValue(this.sliderSeek.value, this.currentAudio.duration)
      this.currentAudioTime = this.currentAudio.currentTime
    }
  }

  connectedCallback () {
    super.connectedCallback()
    this.addEventListener('audio-selected', this.handleAudioSelected)
  }

  disconnectedCallback () {
    super.disconnectedCallback()
    this.removeEventListener('audio-selected', this.handleAudioSelected)
  }

  handleAudioSelected ({ detail: data }) {
    this.currentAudio?.pause()
    this.currentData = data
    this.audioDetails?.classList.add('audio-info__text--active')
    this.currentAudio = new Audio(URL.createObjectURL(data.file))
    this.playCurrentAudio()
    this.setProgressBarTick(1000)
  }

  setProgressBarTick (ms) {
    return setInterval(() => {
      this.currentAudioTime = this.currentAudio?.currentTime
    }, ms)
  }

  render () {
    return html`
        <div class="audio-info__picture">
            ${this.audioArt}
        </div>

        <div class="container">
            <div class="audio-info__text">
                ${this.currentAudio == null
                        ? html`<span>Nothing is playing</span>`
                        : html`
                            <media-text class="audio-title"
                                        value=${this.currentData?.title != null ? this.currentData.title : 'unknown title'}></media-text>
                            <media-text class="audio-artist"
                                        value=${this.currentData?.artist != null ? this.currentData.artist : 'unknown artist'}></media-text>
                            <media-text class="audio-album"
                                        value=${this.currentData?.album != null ? this.currentData.album : 'unknown album'}></media-text>
                        `}
            </div>

            <div class="media-button-wrapper">
                <media-button class="button-previous" media-role="previous"></media-button>
                <media-button class="button-play" media-role="play" @click=${this.playCurrentAudio}></media-button>
                <media-button class="button-pause" media-role="pause" @click=${this.pauseCurrentAudio}></media-button>
                <media-button class="button-next" media-role="next"></media-button>
            </div>
        </div>

        <media-progress class="slider-seek"
                        value=${this.currentAudio != null && !isNaN(this.currentAudio.duration)
                                ? valueToPercentage(this.currentAudioTime, this.currentAudio.duration)
                                : '0'}></media-progress>
    `
  }

  pauseCurrentAudio () {
    if (!this.currentAudio?.paused) {
      this.currentAudio.pause()
      this.buttonPause.style.display = 'none'
      this.buttonPlay.style.display = 'initial'
    }
  }

  playCurrentAudio () {
    if (this.currentAudio?.paused) {
      this.currentAudio.play()
      this.buttonPause.style.display = 'initial'
      this.buttonPlay.style.display = 'none'
    }
  }
}

window.customElements.define('audio-player', AudioPlayer)
