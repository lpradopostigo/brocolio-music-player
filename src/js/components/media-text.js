import { html, LitElement } from 'lit'
import { styles } from './media-text.styles'

class MediaText extends LitElement {
  constructor () {
    super()
    this.value = ''
    this.dynamic = false
    this.viewbox = null
    this.viewportWidth = undefined
    this.viewboxWidth = undefined
  }

  static get properties () {
    return {
      value: { attribute: 'value' },
      dynamic: { type: Boolean }
    }
  }

  static get styles () {
    return styles
  }

  render () {
    return html`
        <span class=${this.dynamic ? null : 'ellipsis'}>
            <span>${this.value}</span>
        </span>
    `
  }

  firstUpdated (_changedProperties) {
    this.viewbox = this.shadowRoot.querySelector('span > span')
    this.viewportWidth = this.shadowRoot.querySelector(':host > span').getBoundingClientRect().width
    this.viewboxWidth = this.viewbox.getBoundingClientRect().width

    if (this.dynamic) {
      this.viewbox?.addEventListener('transitionend', () => {
        setTimeout(() => {
          this.viewbox.style.transitionProperty = 'none'
          this.viewbox.style.transform = 'none'
          setTimeout(() => { this.viewbox.style.transitionProperty = 'transform' })
        }, 2000)
      })
      setInterval(() => {
        this.viewbox.style.transform = `translateX(${this.viewportWidth - this.viewboxWidth}px)`
      }, 4000)
    }
  }
}

window.customElements.define('media-text', MediaText)
