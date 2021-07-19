import { Action } from '@reduxjs/toolkit'

export enum AudioActionType {
  PLAY = 'play',
  PAUSE = 'pause',
  STOP = 'stop',
  RESUME = 'resume',
  SEEK = 'seek'
}

export interface AudioAction extends Action {
  readonly type: AudioActionType
  readonly audioFile?: File
  readonly audioSeekTime?: number
}

export function play (file: File): AudioAction {
  return { type: AudioActionType.PLAY, audioFile: file }
}

export function pause (): AudioAction {
  return { type: AudioActionType.PAUSE }
}

export function resume (): AudioAction {
  return { type: AudioActionType.RESUME }
}

export function stop (): AudioAction {
  return { type: AudioActionType.STOP }
}

export function seek (time: number): AudioAction {
  return { type: AudioActionType.SEEK, audioSeekTime: time }
}
