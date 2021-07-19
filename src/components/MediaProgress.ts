import { html, LitElement, TemplateResult } from 'lit'
import { valueToPercentage } from '../services/utilities'
import { styles } from '../styles/MediaProgress.styles'
import { customElement, property } from 'lit/decorators.js'

@customElement('media-progress')
export default class MediaProgress extends LitElement {
  static styles = styles
  @property({ type: Number })
  value = 0

  @property({ type: Boolean })
  disabled = false

  barProgress: HTMLDivElement | null = null

  render (): TemplateResult {
    if (this.barProgress != null) {
      this.barProgress.style.width = (this.value >= 0 && this.value <= 100) ? `${this.value}%` : '0%'
    }

    return html`
        <div class="container" @click=${this.handleClick}>
            <div class="bar">
                <div class="bar__progress"></div>
            </div>
        </div>
    `
  }

  firstUpdated (): void {
    if (this.shadowRoot == null) {
      throw Error('Cannot get ShadowRoot')
    }
    this.barProgress = this.shadowRoot.querySelector('.bar__progress')
  }

  handleClick (e: MouseEvent): void {
    if (!this.disabled) {
      const { width, x } = this.getBoundingClientRect()
      const relX = e.x - x
      this.value = valueToPercentage(relX, width)
    }
  }
}
