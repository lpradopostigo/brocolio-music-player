import { css, html, LitElement } from 'lit'
import './media-text'

class AudioPlayer extends LitElement {
  constructor () {
    super()
    this.audio = null
    this.controlPlay = null
    this.controlPause = null
    this.audioDetails = null
    this.currentData = {}
  }

  static get styles () {
    return css`
      :host {
        font-family: sans-serif;
        box-sizing: border-box;
        display: grid;
        grid-template-areas:  
                "left right"
                "bottom bottom";

        grid-template-rows: 40vw minmax(0, 1fr);
        grid-template-columns: 40vw minmax(0, 1fr);
        border-radius: 0 0 var(--border-radious-base) var(--border-radious-base);
        gap: 1.25rem;
        padding: 1.25rem;
        box-shadow: 0 4px 4px rgba(0, 0, 0, 0.25);

      }

      span {
        color: var(--color-text-inactive);
      }

      media-text {
        width: 100%;
      }

      .audio-art {
        display: flex;
        justify-content: center;
        align-items: center;
        grid-area: left;
        overflow: hidden;
      }

      .audio-art__default {
        border-radius: var(--border-radious-base);
        background-color: var(--color-secondary);
        width: 100%;
        height: 100%;
      }

      :host > div:nth-child(2) {
        display: flex;
        flex-direction: column;
        grid-area: right;
        justify-content: space-between;
        width: 100%;
      }

      slot[name=control-progress] {
        grid-area: bottom;
        display: block;
      }

      slot[name=control-pause] {
        display: none;
      }

      .audio-details {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        height: calc(100% - var(--media-button-size));

      }

      .audio-details--active {
        gap: 0.5rem;
        align-items: flex-start;
        justify-content: flex-start;
        padding-top: 0.5rem;
      }

      .main-controls {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 0 0.5rem 0.5rem 0.5rem;
      }

    `
  }

  firstUpdated (_changedProperties) {
    this.controlPlay = this.shadowRoot.querySelector('slot[name=control-play]')
    this.controlPause = this.shadowRoot.querySelector('slot[name=control-pause]')
    this.audioDetails = this.shadowRoot.querySelector('.audio-details')
  }

  connectedCallback () {
    super.connectedCallback()
    this.addEventListener('audio-selected', ({ detail }) => {
      if (this.audio != null) {
        this.audio.pause()
        this.audio.currentTime = 0
      }
      this.currentData = detail
      this.audioDetails?.classList.add('audio-details--active')
      this.audio = new Audio(URL.createObjectURL(this.currentData.file))
      this.playAudio()
      this.requestUpdate()
    })
  }

  render () {
    return html`
        <div class="audio-art">
            <svg class="audio-art__default" viewBox="0 0 114 108" xmlns="http://www.w3.org/2000/svg">
                <path d="M86.3333 22L43.6773 31.56V66.3333C35.7333 64.7627 27.6667 70.7893 27.6667 77.4107C27.6667 83.1093 32.1227 86 36.96 86C42.7067 86 48.992 81.9253 49 73.632V44.5653L81 38.008V61.0053C73.0667 59.44 65 65.4427 65 72.048C65 77.7627 69.5733 80.6667 74.3893 80.6667C80.096 80.6667 86.3253 76.5973 86.3333 68.304V22Z"
                      fill="white"/>
            </svg>
        </div>
        <div>
            <div class="audio-details">
                ${this.audio == null
                        ? html`<span>Nothing is playing</span>`
                        : html`
                            <media-text class="audio-title" value=${this.currentData?.title}></media-text>
                            <media-text class="audio-artist" value=${this.currentData?.artist}></media-text>
                            <media-text class="audio-album" value=${this.currentData?.album}></media-text>
                        `}

            </div>
            <div class="main-controls">
                <slot name="control-previous"></slot>
                <slot @click=${this.playAudio} name="control-play"></slot>
                <slot @click=${this.pauseAudio} name="control-pause"></slot>
                <slot name="control-next"></slot>
            </div>
        </div>
        <slot name="control-progress"></slot>
    `
  }

  pauseAudio () {
    if (!this.audio?.paused) {
      this.audio.pause()
      this.controlPause.style.display = 'none'
      this.controlPlay.style.display = 'initial'
    }
  }

  playAudio () {
    if (this.audio?.paused) {
      this.audio.play()
      this.controlPause.style.display = 'initial'
      this.controlPlay.style.display = 'none'
    }
  }
}

window.customElements.define('audio-player', AudioPlayer)
