import { css } from 'lit'

export const styles = css`
  :host {
    display: inline-block;
    overflow: hidden;
  }

  .viewport {
    display: inline-block;
    width: inherit;
    height: inherit;
    line-height: normal;
  }

  .viewbox {
    transition-property: transform;
    transition-duration: 2s;
    white-space: nowrap;
  }

  .ellipsis {
    text-overflow: ellipsis;
    overflow: hidden;
  }
`
