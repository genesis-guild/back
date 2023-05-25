/* eslint-disable @typescript-eslint/ban-types */
import { log } from './log'

export const time = (cb: Function): void => {
  const startTime = performance.now()

  cb()

  const endTime = performance.now()

  log(`Call to doSomething took ${endTime - startTime} milliseconds`)
}
