import { isMainThread } from 'node:worker_threads'

const w = new Worker('./test.ts')
w.onmessage = e => console.log(e.data)

if (isMainThread) {
  console.log('nope')
} else {
  postMessage('is worker')
}



