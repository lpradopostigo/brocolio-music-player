export class AudioPlayer {
  private audioElement: HTMLAudioElement | null = null

  get duration (): number | undefined {
    return this.audioElement?.duration
  }

  get currentTime (): number | undefined {
    return this.audioElement?.currentTime
  }

  changeAudio (file: File | null): void {
    this.stop()
    this.audioElement = file != null ? new Audio(URL.createObjectURL(file)) : null
  }

  play (): void {
    this.audioElement?.play()
  }

  pause (): void {
    this.audioElement?.pause()
  }

  stop (): void {
    this.pause()
    this.audioElement = null
  }

  seek (time: number): void {
    if (this.audioElement != null) this.audioElement.currentTime = time
  }
}
