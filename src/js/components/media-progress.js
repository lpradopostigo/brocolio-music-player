import { css, html, LitElement } from 'lit'
import { toPercentage } from '../utils'

class MediaProgress extends LitElement {
  constructor () {
    super()
    this.value = 0
    this.bar = null
  }

  static get styles () {
    return css`
      :host {
        display: flex;
        align-items: center;
      }

      :host > div {
        display: block;
        background-color: var(--color-secondary-light);
        overflow: hidden;
        height: 50%;
        width: 100%;
        border-radius: var(--border-radious-base);

      }

      div > div {
        height: 100%;
        width: 0;
        background-color: var(--color-primary);

      }
    `
  }

  static get properties () {
    return {
      value: {
        attribute: 'value'
      }
    }
  }

  render () {
    if (this.bar) {
      this.bar.style.width = (this.value >= 0 && this.value <= 100) ? `${this.value}%` : '100%'
    }
    return html`
        <div>
            <div></div>
        </div>
    `
  }

  firstUpdated (_changedProperties) {
    this.bar = this.shadowRoot.querySelector('div>div')
    this.addEventListener('click', (e) => {
      const value = e.x - this.getBoundingClientRect().x
      const referenceValue = this.getBoundingClientRect().width
      this.value = toPercentage(value, referenceValue)
    })
  }
}

window.customElements.define('media-progress', MediaProgress)
