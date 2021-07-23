import { html, LitElement, TemplateResult } from 'lit'
import { valueToPercentage } from '../../services/utilities'
import { styles } from './media-progress.styles'
import { customElement, property } from 'lit/decorators.js'

@customElement('media-progress')
export class MediaProgress extends LitElement {
  static styles = styles
  @property({ type: Number }) value = 0
  @property({ type: Boolean }) disabled = false

  private get barProgressWidth (): string {
    return (this.value >= 0 && this.value <= 100) ? `${this.value}%` : '0%'
  }

  render (): TemplateResult {
    return html`
        <div class="container" @click=${this.handleClick}>
            <div class="bar">
                <div class="bar__progress"
                     style="width: ${this.barProgressWidth}"
                ></div>
            </div>
        </div>
    `
  }

  private handleClick (event: MouseEvent): void {
    if (!this.disabled) {
      const { width, x } = this.getBoundingClientRect()
      const relX = event.x - x
      this.value = valueToPercentage(relX, width)
    }
  }
}
