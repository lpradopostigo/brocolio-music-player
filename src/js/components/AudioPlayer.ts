export default class AudioPlayer {
  private audioElement: HTMLAudioElement | null = null

  get duration (): number | undefined {
    return this.audioElement?.duration
  }

  get currentTime (): number | undefined {
    return this.audioElement?.currentTime
  }

  get currentAudio (): HTMLAudioElement | null {
    return this.audioElement
  }

  changeAudio (file: File): void {
    this.audioElement = new Audio(URL.createObjectURL(file))
  }

  play (): void {
    this.audioElement?.play()
  }

  pause (): void {
    this.audioElement?.pause()
  }

  stop (): void {
    this.pause()
    this.seek(0)
  }

  seek (time: number): void {
    if (this.audioElement != null) this.audioElement.currentTime = time
  }
}
