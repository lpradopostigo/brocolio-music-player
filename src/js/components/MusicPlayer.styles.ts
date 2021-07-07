import { css } from 'lit'

export const styles = css`
  :host {
    height: 100vh;
    display: flex;
    flex-direction: column;
  }

  mini-music-player {
    position: sticky;
    top: 0;
    --grid-height-xs: 9rem;
  }


  music-playlist {
    flex: 1;
  }
`
