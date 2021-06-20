import { css, html, LitElement } from 'lit'
import '@github/file-attachment-element'

class AudioPlaylist extends LitElement {
  static get styles () {
    return css`
      :host{
        display: block;
      }
      label{
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        height: 100%;
        cursor: pointer;

      }
      
      input{
        opacity: 0;
        width: 0;
        height: 0;
      }

      
      file-attachment{
        display: flex;
        align-items: center;
        justify-content: center;
      }
      
    `
  }

  render () {
    return html`
        <file-attachment>
            <label for="input-file">Add some files </label>
            <input type="file" id="input-file" multiple>
            
        </file-attachment>
    `
  }

  firstUpdated (_changedProperties) {
    const fileAttachment = this.shadowRoot.querySelector('file-attachment')
    fileAttachment.style.height = `${this.getBoundingClientRect().height}px`
  }
}

window.customElements.define('audio-playlist', AudioPlaylist)
