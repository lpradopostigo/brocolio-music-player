import { css } from 'lit'

export const styles = css`
  :host {
    --audio-player-gap: 1.25rem;
    font-family: sans-serif;
    box-sizing: border-box;
    display: grid;
    grid-template-areas:  
                "left right"
                "bottom bottom";

    grid-template-rows: var(--grid-height-xs) minmax(0, 1fr);
    grid-template-columns: var(--grid-height-xs) minmax(0, 1fr);
    border-radius: 0 0 var(--border-radious-base) var(--border-radious-base);
    gap: var(--audio-player-gap);
    padding: 1.25rem;
    box-shadow: 0 4px 4px rgba(0, 0, 0, 0.25);
  }

  span {
    color: var(--color-text-inactive);
  }

  media-text {
    width: 100%;
  }

  .audio-info__picture {
    display: flex;
    justify-content: center;
    align-items: center;
    grid-area: left;
    overflow: hidden;
  }

  .audio-info__picture img {
    width: 100%;
    border-radius: var(--border-radious-base);

  }

  .audio-art__default {
    border-radius: var(--border-radious-base);
    background-color: var(--color-secondary);
    width: 100%;
    height: 100%;
  }

  .container {
    display: flex;
    flex-direction: column;
    grid-area: right;
    gap: var(--audio-player-gap);
    width: 100%;
  }

  .slider-seek {
    grid-area: bottom;
    width: 100%;
    height: 1.6rem; /* hitbox size, actual size is 1/4 of the hitbox */
    margin-top: calc(-1.6rem * 3 / 8);
    margin-bottom: calc(-1.6rem * 3 / 8);
  }

  .button-pause {
    display: none;
  }

  .audio-info__text {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;
  }

  .audio-info__text--active {
    align-items: flex-start;
    justify-content: space-between;
    padding-top: 0.5rem;
  }

  media-button {
    height: var(--media-button-size, 1.5rem);
    width: var(--media-button-size, 1.5rem);
  }

  .media-button-wrapper {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-bottom: 0.5rem;
  }

  @media screen and (min-width: 600px) {
    :host {
      grid-template-areas:
              "audio-info__picture container" 
              "audio-info__picture  slider-seek";

      grid-template-columns: var(--grid-height-xs) 1fr;
      grid-template-rows: calc(var(--grid-height-xs) * 0.7)  calc(var(--grid-height-xs) * 0.3);
      gap: 0;
    }

    .audio-info__picture {
      grid-area: audio-info__picture;
    }

    .slider-seek {
      box-sizing: border-box;
      grid-area: slider-seek;
      align-self: center;
      justify-self: center;
      padding-left: var(--audio-player-gap);
    }

    .container {
      box-sizing: border-box;
      flex-direction: row;
      grid-area: container;
      padding-left: var(--audio-player-gap);

    }

    .audio-info__text {
    }

    .media-button-wrapper {
    }

  }

`
