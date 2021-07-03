import { css } from 'lit'

export const styles = css`
  :host {
    display: flex;
    align-items: center;
    justify-content: center;

  }

  svg {
    height: 100%;
    width: 100%;
  }

  svg path {
    fill: var(--media-button-color);
  }

  .active {
    animation-name: media-button-animation;
    animation-duration: 0.5s;
    animation-timing-function: ease-in-out;

  }

  @keyframes media-button-animation {
    0% {
      transform: scale(1);
    }
    50% {
      transform: scale(1.125);
    }
    100% {
      transform: scale(1);
    }
  }
`
