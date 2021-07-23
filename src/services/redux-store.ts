import { createStore } from 'redux'
import { AudioAction, AudioActionType } from '../redux-actions/audio-actions'
import produce from 'immer'
import { InitAction, InitActionType } from '../redux-actions/init-actions'

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
  readonly currentIndex?: number
}

export interface StoreState {
  readonly audioPlaylist: AudioPlaylist
  readonly audioInformation: AudioInformation
  readonly audioSeekTime?: number
  readonly lastActionType: StoreActionType
}

const initialState: StoreState = {
  audioPlaylist: { files: [] },
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

      case AudioActionType.NEXT: {
        const currentIndex = draft.audioPlaylist.currentIndex
        const filesLength = draft.audioPlaylist.files.length

        if (currentIndex == null) {
          throw Error('index is missing')
        }
        draft.audioPlaylist.currentIndex = (currentIndex + 1) % filesLength
        break
      }

      case AudioActionType.PREVIOUS: {
        let currentIndex = draft.audioPlaylist.currentIndex
        const filesLength = draft.audioPlaylist.files.length

        if (currentIndex == null) {
          throw Error('index is missing')
        }

        if (currentIndex > 0) {
          currentIndex -= 1
          draft.audioPlaylist.currentIndex = currentIndex
        } else {
          draft.audioPlaylist.currentIndex = filesLength - 1
        }
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
        break
      }
    }
  })
}

export const reduxStore = createStore(reducer)
