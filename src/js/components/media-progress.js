import { css, html, LitElement } from 'lit'
import { valueToPercentage } from '../utils'

class MediaProgress extends LitElement {
  constructor () {
    super()
    this.value = 0
    this.barProgress = null
    this.disabled = false
  }

  static get styles () {
    return css`
      :host {
        display: flex;
        align-items: center;
      }

      .bar {
        background-color: var(--color-secondary-light);
        overflow: hidden;
        height: 50%;
        width: 100%;
        border-radius: var(--border-radious-base);
      }

      .bar__progress {
        height: 100%;
        width: 0;
        background-color: var(--color-primary);
      }
    `
  }

  static get properties () {
    return {
      value: { attribute: 'value' },
      disabled: { type: Boolean }
    }
  }

  connectedCallback () {
    super.connectedCallback()
    this.addEventListener('click', (e) => {
      this.handleClick(e)
    })
  }

  disconnectedCallback () {
    super.disconnectedCallback()
    this.removeEventListener('click', this.handleClick)
  }

  render () {
    if (this.barProgress != null) {
      this.barProgress.style.width = (this.value != null && this.value >= 0 && this.value <= 100)
        ? `${this.value}%`
        : '0%'
    }

    return html`
        <div class="bar">
            <div class="bar__progress"></div>
        </div>
    `
  }

  firstUpdated (_changedProperties) {
    this.barProgress = this.shadowRoot.querySelector('.bar__progress')
  }

  handleClick (e) {
    if (!this.disabled) {
      const { width, x } = this.getBoundingClientRect()
      const relX = e.x - x
      this.value = valueToPercentage(relX, width)
    }
  }
}

window.customElements.define('media-progress', MediaProgress)
