import { createStore } from 'redux'
import { AudioAction, AudioActionType } from './audioActions'
import produce from 'immer'
import { InitAction, InitActionType } from './initActions'

type StoreAction = AudioAction | InitAction
type StoreActionType = AudioActionType | InitActionType

export enum AudioState {
  PLAYING = 'playing',
  PAUSED = 'paused',
  STOPPED = 'stopped'
}

export interface StoreState {
  readonly audioState: AudioState
  readonly audioFile: File | null
  readonly audioCurrentTime: (() => number | undefined) | null
  readonly audioDuration: (() => number | undefined) | null
  readonly audioSeekTime: number | null
  readonly audioPlaylist: File[]
  readonly lastActionType: StoreActionType
}

const initialState: StoreState = {
  audioState: AudioState.STOPPED,
  audioFile: null,
  audioCurrentTime: null,
  audioDuration: null,
  audioSeekTime: null,
  audioPlaylist: [],
  lastActionType: AudioActionType.STOP
}

function reducer (state: StoreState = initialState, action: StoreAction): StoreState {
  return produce(state, (draft) => {
    draft.lastActionType = action.type
    switch (action.type) {
      case InitActionType.SET_AUDIO_TIME: {
        draft.audioDuration = action.audioDuration
        draft.audioCurrentTime = action.audioCurrentTime
        break
      }

      case AudioActionType.PLAY: {
        draft.audioState = AudioState.PLAYING
        if (action.audioFile == null) {
          throw Error('Audio File missing')
        }
        draft.audioFile = action.audioFile
        break
      }

      case AudioActionType.PAUSE: {
        draft.audioState = AudioState.PAUSED
        break
      }

      case AudioActionType.STOP: {
        draft.audioState = AudioState.STOPPED
        draft.audioFile = null
        break
      }

      case AudioActionType.RESUME: {
        draft.audioState = AudioState.PLAYING
        break
      }

      case AudioActionType.SEEK: {
        if (action.audioSeekTime == null) {
          throw Error('Audio seek time missing')
        }
        draft.audioSeekTime = action.audioSeekTime
        break
      }

      case AudioActionType.ADD_PLAYLIST: {
        if (action.audioPlaylist == null) {
          throw Error('Audio playlist  missing')
        }
        draft.audioPlaylist = action.audioPlaylist
      }
    }
  })
}

export const store = createStore(reducer)
