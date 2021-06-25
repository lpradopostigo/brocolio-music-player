import { html, LitElement } from 'lit'
import { valueToPercentage } from '../utils'
import { styles } from './media-progress.styles'

class MediaProgress extends LitElement {
  constructor () {
    super()
    this.value = 0
    this.barProgress = null
    this.disabled = false
  }

  static get styles () {
    return styles
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
        <div class="container">
            <div class="bar">
                <div class="bar__progress"></div>
            </div>
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
