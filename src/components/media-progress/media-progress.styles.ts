import { css } from 'lit'

export const styles = css`
  :host {
    display: block;
  }

  .container {
    display: flex;
    align-items: center;
    width: inherit;
    height: inherit;
  }

  .bar {
    background-color: var(--color-secondary-light);
    overflow: hidden;
    height: 25%;
    width: 100%;
    border-radius: var(--border-radious-base);
  }

  .bar__progress {
    height: 100%;
    width: 0;
    background-color: var(--color-primary);
  }
`
