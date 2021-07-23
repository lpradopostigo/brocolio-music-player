import { css } from 'lit'

export const styles = css`
  :host {
    display: block;
  }

  div {
    box-sizing: border-box;
    display: flex;
    border-radius: var(--border-radious-base);
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.25);
    align-items: center;
    padding: 0.75rem 1.25rem 0.75rem 1.25rem;
    gap: 0.75rem;
  }

  .active {
    background-color: var(--color-primary);
    color: white;
  }

  span {
    display: inline-block;
  }

  media-text {
    width: 100%;
  }
`
