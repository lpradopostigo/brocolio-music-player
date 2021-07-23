/* eslint-disable import/no-duplicates */
// noinspection JSUnusedGlobalSymbols

import '@github/file-attachment-element'
import type FileAttachmentElement from '@github/file-attachment-element'
import type { Attachment } from '@github/file-attachment-element'

declare global {
  interface HTMLElementEventMap {
    'file-attachment-accepted': CustomEvent
  }
}

export { FileAttachmentElement, Attachment }
