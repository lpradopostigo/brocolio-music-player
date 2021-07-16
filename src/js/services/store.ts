import { createStore } from 'redux'
import { AudioActionType, AudioAction } from './audioActions'

export enum AudioState {
  PLAYING = 'playing',
  PAUSED = 'paused',
  STOPPED = 'stopped'
}

export interface StoreState {
  audioState: AudioState
  audioFile: File | null
  lastActionType: AudioActionType
}

function audioReducer (state: StoreState = {
  audioState: AudioState.STOPPED,
  audioFile: null,
  lastActionType: AudioActionType.STOP
}, action: AudioAction): StoreState {
  state.lastActionType = action.type
  switch (action.type) {
    case AudioActionType.PLAY: {
      state.audioState = AudioState.PLAYING
      if (action.audioFile == null) {
        throw Error('Audio File missing')
      }
      state.audioFile = action.audioFile
      break
    }

    case AudioActionType.PAUSE: {
      state.audioState = AudioState.PAUSED
      break
    }

    case AudioActionType.STOP: {
      state.audioState = AudioState.STOPPED
      state.audioFile = null
      break
    }

    case AudioActionType.RESUME: {
      state.audioState = AudioState.PLAYING
      break
    }
  }
  return state
}

export const store = createStore(audioReducer)
