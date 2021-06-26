import { css } from 'lit'

export const styles = css`
  :host {
    display: block;
  }

  label {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    cursor: pointer;
    color: var(--color-secondary-light);
  }

  input {
    opacity: 0;
    width: 0;
    height: 0;
  }


  file-attachment {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    align-items: center;
    height: 100%;
  }

  audio-item {
    width: 90%;
  }
`
