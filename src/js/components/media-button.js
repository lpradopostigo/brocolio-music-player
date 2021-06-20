import { css, html, LitElement } from 'lit'

// noinspection JSUnresolvedVariable
export default class MediaButton extends LitElement {
  static get properties () {
    return {
      mediaRole: { attribute: 'media-role' }
    }
  }

  static get styles () {
    return css`
      :host {
        display: flex;
        align-items: center;
        justify-content: center;
        
      }
      svg{
        height: 100%;
        width: 100%;
      }
      
      svg path {
        fill: var(--media-button-color);
      }

      .active {
        animation-name: media-button-animation;
        animation-duration: 0.5s;
        animation-timing-function: ease-in-out;

      }

      @keyframes media-button-animation {
        0% {
          transform: scale(1);
        }
        50% {
          transform: scale(1.125);
        }
        100% {
          transform: scale(1);
        }
      }
    `
  }

  constructor () {
    super()
    this.mediaRole = 'previous'
    this.mediaButton = null
  }

  render () {
    switch (this.mediaRole) {
      case 'previous':
        return html`
            <svg viewBox="0 0 24 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M24 0V14L12 7L24 0ZM12 0V14L0 7L12 0Z" fill="black"/>
            </svg>

        `
      case 'next':
        return html`
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M0 20V6L12 13L0 20ZM12 20V6L24 13L12 20Z"/>
            </svg>
        `
      case 'pause':
        return html`
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M11 22H7V2H11V22ZM17 2H13V22H17V2Z"/>
            </svg>
        `
      case 'play':
        return html`
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M2 24V0L22 12L2 24Z"/>
            </svg>
        `

      default:
        return html``
    }
  }

  firstUpdated (_changedProperties) {
    this.mediaButton = this.shadowRoot.querySelector('svg')
    this.mediaButton.addEventListener('click', () => {
      this.mediaButton.classList.add('active')
    })

    this.mediaButton.addEventListener('animationend', () => {
      this.mediaButton.classList.remove('active')
    })
  }
}

window.customElements.define('media-button', MediaButton)
