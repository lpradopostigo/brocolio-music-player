import { IPicture, parseBlob } from 'music-metadata-browser'
import { Buffer } from 'buffer'

declare global {
  interface Window {Buffer: typeof Buffer}
}
window.Buffer = Buffer

export interface AudioMetadata {
  albumArt: IPicture | undefined
  title: string | undefined
  artist: string | undefined
  album: string | undefined
  duration: number | undefined
}

export class AudioMetadataParser {
  private readonly file: File

  constructor (file: File) {
    this.file = file
  }

  async parse (): Promise<AudioMetadata> {
    return await new Promise((resolve, reject) => {
      parseBlob(this.file).then(
        ({
          common: {
            title,
            artist,
            album,
            picture
          },
          format: { duration }
        }) => {
          resolve({
            albumArt: picture === undefined ? undefined : picture[0],
            title: title,
            artist: artist,
            album: album,
            duration: duration
          })
        })
        .catch((err) => { reject(err) })
    })
  }
}
