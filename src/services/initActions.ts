import { Action } from '@reduxjs/toolkit'

export enum InitActionType {
  SET_AUDIO_GETTERS = 'setAudioGetters'
}

export interface InitAction extends Action {
  readonly type: InitActionType
  readonly audioCurrentTime: () => number | undefined
  readonly audioDuration: () => number | undefined
}

export function setAudioGetters (audioCurrentTime: () => number | undefined, audioDuration: () => number | undefined): InitAction {
  return { type: InitActionType.SET_AUDIO_GETTERS, audioCurrentTime: audioCurrentTime, audioDuration: audioDuration }
}
