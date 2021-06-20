import { css, html, LitElement } from 'lit'

class AudioItem extends LitElement {
  static get styles () {
    return css`
      :host{
        display: flex;
        
      }
      span{
        display: inline-block;
      }
    `
  }

  render () {
    return html`
        <slot name="audio-title"><span>unknown</span></slot>
        <slot name="audio-duration"><span>--:--</span></slot>
    `
  }
}

window.customElements.define('audio-item', AudioItem)
