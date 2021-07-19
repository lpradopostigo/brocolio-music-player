import { Action } from '@reduxjs/toolkit'

export enum InitActionType {
  SET_AUDIO_TIME = 'setAudioPlayer'
}

export interface InitAction extends Action {
  readonly type: InitActionType
  readonly audioCurrentTime: () => number | undefined
  readonly audioDuration: () => number | undefined
}

export function setAudioTime (audioCurrentTime: () => number | undefined, audioDuration: () => number | undefined): InitAction {
  return { type: InitActionType.SET_AUDIO_TIME, audioCurrentTime: audioCurrentTime, audioDuration: audioDuration }
}
