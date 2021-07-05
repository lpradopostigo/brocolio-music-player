import { IPicture, parseBlob } from 'music-metadata-browser'
import { Buffer } from 'buffer'

declare global {
  interface Window {Buffer: typeof Buffer}
}
window.Buffer = Buffer

export interface IAudioMetadata {
  albumArt: IPicture | undefined
  title: string | undefined
  artist: string | undefined
  album: string | undefined
}

export default class AudioMetadataParser {
  private readonly file: File

  constructor (file: File) {
    this.file = file
  }

  async parse (): Promise<IAudioMetadata> {
    return await new Promise((resolve, reject) => {
      parseBlob(this.file).then(
        ({
          common: {
            title,
            artist,
            album,
            picture
          }
        }) => {
          resolve({
            albumArt: picture === undefined ? undefined : picture[0],
            title: title,
            artist: artist,
            album: album
          })
        })
        .catch((err) => { reject(err) })
    })
  }
}
