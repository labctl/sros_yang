# Yang module web worker

The yang worker decompresses, filters and compares compressed yang models.

Usage

```javascript
// vite supports the ?worker syntax
import YangWorker from "./yangworker/worker.js?worker"

version = '23.3.R1'

const worker = new YangWorker()
worker.postMessage({ load: version } as WorkerRx)

worker.onmessage = (eventmsg) => {
  const msg = eventmsg.data as WorkerTx
  if (msg.info) {
    console.debug(`Loaded ${msg.info}`)
    // perform your first "get"...
    worker.postMessage({ get: {
        marks:['bgp'], ...other_options
    } } as WorkerRx)
  }
  if (msg.data) {
    console.debug(`WTx new data! ${msg.data.length}`)
  }
  if (msg.diffdata) {
    console.debug(`WTx new data! ${msg.diffdata.length}`)
  }
}
```
