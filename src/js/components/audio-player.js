import { css, html, LitElement } from 'lit'

class AudioPlayer extends LitElement {
  static get properties () {
    return {
      audioTitle: { attribute: 'audio-title' },
      audioArtist: { attribute: 'audio-artist' },
      audioAlbum: { attribute: 'audio-album' }
    }
  }

  constructor () {
    super()
    this.audioTitle = ''
    this.audioArtist = ''
    this.audioAlbum = ''
  }

  static get styles () {
    return css`
      :host {
        display: grid;
        grid-template-areas:  
                "left right"
                "bottom bottom";
        font-family: sans-serif;
        grid-template-rows: 40vw 1fr;
        grid-template-columns: 40vw 1fr;
        padding: 1.25rem;
        border-radius: 0 0 10px 10px;
        box-shadow: 0 4px 4px rgba(0, 0, 0, 0.25);

      }

      ::slotted(img), svg {
        border-radius: 10px;
        width: 100%;
      }

      slot[name=audio-art] {
        display: flex;
        justify-content: center;
        align-items: center;
        grid-area: left;
        overflow: hidden;
      }

      :host > div {
        display: flex;
        flex-direction: column;
        grid-area: right;
        margin-left: 1.25rem;
        justify-content: space-between;
      }

      slot[name=control-progress] {
        grid-area: bottom;
        display: block;
        margin-top: 0.5rem;
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

      span {
        color: var(--color-text-inactive);
        margin: 0;
      }


      svg {
        background-color: var(--color-secondary);

      }

      .main-controls {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding-bottom: 0.5rem;
        padding-right: 1rem;
        padding-left: 1rem;

      }


    `
  }

  render () {
    return html`
        <slot name="audio-art">
            <svg viewBox="0 0 114 108" xmlns="http://www.w3.org/2000/svg">
                <path d="M86.3333 22L43.6773 31.56V66.3333C35.7333 64.7627 27.6667 70.7893 27.6667 77.4107C27.6667 83.1093 32.1227 86 36.96 86C42.7067 86 48.992 81.9253 49 73.632V44.5653L81 38.008V61.0053C73.0667 59.44 65 65.4427 65 72.048C65 77.7627 69.5733 80.6667 74.3893 80.6667C80.096 80.6667 86.3253 76.5973 86.3333 68.304V22Z"
                      fill="white"/>
            </svg>
        </slot>
        <div>
            <div class="audio-details">
                <slot name="audio-title"><span>Nothing is playing</span></slot>
                <slot name="audio-artist"></slot>
                <slot name="audio-album"></slot>
            </div>
            <div class="main-controls">
                <slot name="control-previous"></slot>
                <slot name="control-play"></slot>
                <slot name="control-pause"></slot>
                <slot name="control-next"></slot>
            </div>

        </div>
        <slot name="control-progress"></slot>

    `
  }
}

window.customElements.define('audio-player', AudioPlayer)
