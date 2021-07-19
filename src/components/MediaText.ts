import { html, LitElement, TemplateResult } from 'lit'
import { styles } from '../styles/MediaText.styles'
import { customElement, property } from 'lit/decorators.js'

@customElement('media-text')
export default class MediaText extends LitElement {
  static styles = styles

  @property({ type: String })
  value = ''

  @property({ type: Boolean })
  dynamic = false

  viewbox: HTMLSpanElement | null = null
  viewport: HTMLSpanElement | null = null
  viewportWidth = 0
  viewboxWidth = 0

  render (): TemplateResult {
    return html`
        <span class=${`viewport ${this.dynamic ? '' : 'ellipsis'}`}>
            <span class="viewbox">${this.value}</span>
        </span>
    `
  }

  firstUpdated (): void {
    if (this.shadowRoot == null) {
      throw Error('Cannot get ShadowRoot')
    }
    this.viewbox = this.shadowRoot.querySelector('.viewbox')
    this.viewport = this.shadowRoot.querySelector('.viewport')

    if (this.viewport == null || this.viewbox == null) {
      throw Error('Cannot get children elements from the Shadow Root')
    }

    this.viewportWidth = this.viewport.getBoundingClientRect().width
    this.viewboxWidth = this.viewbox.getBoundingClientRect().width

    if (this.dynamic) {
      // add animation here
    }
  }
}
