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

interface AudioInformation {
  readonly state: AudioState
  readonly currentTime: (() => number | undefined) | null
  readonly duration: (() => number | undefined) | null
}

interface AudioPlaylist {
  readonly files: File[]
  readonly currentIndex: number
}

export interface StoreState {
  readonly audioPlaylist: AudioPlaylist
  readonly audioInformation: AudioInformation
  readonly audioSeekTime?: number
  readonly lastActionType: StoreActionType
}

const initialState: StoreState = {
  audioPlaylist: { files: [], currentIndex: 0 },
  audioInformation: { state: AudioState.STOPPED, currentTime: null, duration: null },
  lastActionType: AudioActionType.STOP
}

function reducer (state: StoreState = initialState, action: StoreAction): StoreState {
  return produce(state, (draft) => {
    draft.lastActionType = action.type
    switch (action.type) {
      case InitActionType.SET_AUDIO_GETTERS: {
        draft.audioInformation.duration = action.audioDuration
        draft.audioInformation.currentTime = action.audioCurrentTime
        break
      }

      case AudioActionType.PLAY: {
        draft.audioInformation.state = AudioState.PLAYING
        if (action.payload?.index == null) {
          throw Error('audio index is missing')
        }
        draft.audioPlaylist.currentIndex = action.payload.index
        break
      }

      case AudioActionType.PAUSE: {
        draft.audioInformation.state = AudioState.PAUSED
        break
      }

      case AudioActionType.STOP: {
        draft.audioInformation.state = AudioState.STOPPED
        draft.audioPlaylist.currentIndex = 0
        break
      }

      case AudioActionType.RESUME: {
        draft.audioInformation.state = AudioState.PLAYING
        break
      }

      case AudioActionType.SEEK: {
        if (action.payload?.seekTime == null) {
          throw Error('audio seek time missing')
        }
        draft.audioSeekTime = action.payload.seekTime
        break
      }

      case AudioActionType.ADD_PLAYLIST: {
        if (action.payload?.files == null) {
          throw Error('audio playlist files are  missing')
        }
        draft.audioPlaylist.files = action.payload.files
      }
    }
  })
}

export const store = createStore(reducer)
