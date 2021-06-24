import { css, html, LitElement } from 'lit'

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
    return css`
      :host {
        display: inline-block;
        overflow: hidden;
      }

      :host > span {
        display: inline-block;
        width: inherit;
        height: inherit;
        line-height: 150%;
      }

      span > span {
        transition-property: transform;
        transition-duration: 2s;
        white-space: nowrap;
      }

      .ellipsis {
        text-overflow: ellipsis;
        overflow: hidden;
      }
    `
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
