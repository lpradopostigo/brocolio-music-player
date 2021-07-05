import { html, LitElement, TemplateResult } from 'lit'
import { customElement, property } from 'lit/decorators.js'
import { styles } from './MediaButton.styles'

export enum MediaRole {
  Play,
  Pause,
  Previous,
  Next
}

@customElement('media-button')
export default class MediaButton extends LitElement {
  static styles = styles
  @property({ type: MediaRole, attribute: 'media-role' })
  mediaRole

  mediaSvg: SVGElement | null = null

  constructor (mediaRole = MediaRole.Play) {
    super()
    this.mediaRole = mediaRole
    this.startAnimation = this.startAnimation.bind(this)
    this.cleanAnimation = this.cleanAnimation.bind(this)
  }

  render (): TemplateResult {
    switch (this.mediaRole) {
      case MediaRole.Previous:
        return html`
            <svg viewBox="0 0 24 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M24 0V14L12 7L24 0ZM12 0V14L0 7L12 0Z" fill="black"/>
            </svg>

        `
      case MediaRole.Next:
        return html`
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M0 20V6L12 13L0 20ZM12 20V6L24 13L12 20Z"/>
            </svg>
        `
      case MediaRole.Pause:
        return html`
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M11 22H7V2H11V22ZM17 2H13V22H17V2Z"/>
            </svg>
        `
      case MediaRole.Play:
        return html`
            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M2 24V0L22 12L2 24Z"/>
            </svg>
        `

      default:
        return html``
    }
  }

  firstUpdated (): void {
    if (this.shadowRoot == null) {
      throw Error('Cannot get ShadowRoot')
    }

    this.mediaSvg = this.shadowRoot.querySelector('svg')

    this.mediaSvg?.addEventListener('click', this.startAnimation)
    this.mediaSvg?.addEventListener('animationend', this.cleanAnimation)
  }

  disconnectedCallback (): void {
    super.disconnectedCallback()
    this.mediaSvg?.removeEventListener('click', this.startAnimation)
    this.mediaSvg?.removeEventListener('click', this.cleanAnimation)
  }

  startAnimation (): void {
    this.mediaSvg?.classList.add('active')
  }

  cleanAnimation (): void {
    this.mediaSvg?.classList.remove('active')
  }
}
