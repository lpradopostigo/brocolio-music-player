import { Action } from '@reduxjs/toolkit'

export enum AudioActionType {
  PLAY = 'play',
  PAUSE = 'pause',
  STOP = 'stop',
  RESUME = 'resume'
}

export interface AudioAction extends Action {
  type: AudioActionType
  audioFile?: File
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
