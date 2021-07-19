import { css } from 'lit'

export const styles = css`
  :host {
    --media-button-size: 1.5rem;
    --media-button-color: var(--color-secondary);
    --audio-player-gap: 1.25rem;
    --audio-player-picture-size: 9rem;

    font-family: sans-serif;
    box-sizing: border-box;
    display: grid;
    grid-template-areas:  
                "audio-info__picture audio-info__text"
                "audio-info__picture media-button-wrapper"
                "slider-seek slider-seek";

    grid-template-rows: max-content auto auto;
    grid-template-columns: var(--audio-player-picture-size) minmax(0, 1fr);
    border-radius: 0 0 var(--border-radious-base) var(--border-radious-base);
    padding: 1.25rem;
    box-shadow: 0 4px 4px rgba(0, 0, 0, 0.25);
    gap: var(--audio-player-gap);
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
    grid-area: audio-info__picture;
    overflow: hidden;
    height: var(--audio-player-picture-size);
    width: var(--audio-player-picture-size);
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


  .slider-seek {
    --slider-seek-height: 1.6rem;
    grid-area: slider-seek;
    width: 100%;
    height: var(--slider-seek-height); /* hitbox size, actual size is 1/4 of the hitbox */
    margin-top: calc(var(--slider-seek-height) * 3 / 8 * -1);
    margin-bottom: calc(var(--slider-seek-height) * 3 / 8 * -1);
  }

  .button-pause {
    display: none;
  }

  .audio-info__text {
    display: flex;
    grid-area: audio-info__text;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;
  }

  .audio-info__text--active {
    align-items: center;
    justify-content: space-between;
    padding-top: 0.5rem;
  }

  media-button {
    height: var(--media-button-size);
    width: var(--media-button-size);
  }

  .media-button-wrapper {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-bottom: 0.5rem;
    grid-area: media-button-wrapper;
  }

  @media screen and (min-width: 600px) {
    :host {
      --audio-player-picture-size: 7rem;
      --media-button-size: 2.5rem;
      grid-template-areas:
              "media-button-wrapper audio-info__picture audio-info__text" 
              "media-button-wrapper audio-info__picture slider-seek";

      grid-template-columns: 1fr var(--audio-player-picture-size) minmax(0, 1fr);
      grid-template-rows: 1fr min-content;
    }

    .audio-info__picture {
      grid-area: audio-info__picture;
    }

    .audio-info__text {
      align-items: center;
      text-align: center;
    }

    .slider-seek {
      box-sizing: border-box;
      grid-area: slider-seek;
      align-self: center;
      justify-self: center;
      margin-bottom: calc(var(--slider-seek-height) * 3 / 8 * -1 + 0.5rem);

    }

    .media-button-wrapper {
      padding-bottom: 0;
      grid-area: media-button-wrapper;
      justify-content: initial;
      gap: var(--audio-player-gap);
    }

  }

`
