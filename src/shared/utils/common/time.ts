/* eslint-disable @typescript-eslint/ban-types */
import { log } from './log'

export const asyncTime = async (cb: Function, fnName: string): Promise<any> => {
  const startTime = performance.now()

  const data = await cb()

  const endTime = performance.now()

  log(`Call ${fnName} took ${endTime - startTime} milliseconds`)

  return data
}

export const time = (cb: Function, fnName: string): any => {
  const startTime = performance.now()

  const data = cb()

  const endTime = performance.now()

  log(`Call ${fnName} took ${endTime - startTime} milliseconds`)

  return data
}

export const createAsyncCb = (promise: Promise<any>): (() => Promise<any>) => {
  return async () => await promise
}
