// Yang worker by Johann Kellerman
import { allPlatforms, loadModel } from "./yangload"
import { Item, WorkerRx, WorkerTx } from "./types"
import { compare } from "./yangdiff"
import { filtered } from "./yangfilter"

let version = ""
let data = [] as Item[]

self.onmessage = (e: MessageEvent) => {
  const d = e.data as WorkerRx
  if (d.load) {
    load(d.load)
    return
  }
  if (d.compare) {
    compare_to(d.compare)
    return
  }
  if (d.get) {
    postMessage({ data: filtered(data, d.get) } as WorkerTx)
    return
  }
  console.log("unknown command", d)
}

function load(ver: string) {
  loadModel(ver).then((d) => {
    data = d
    version = ver
    post_info()
    // postMessage({ data: filtered(data) } as WorkerTx)
  })
}

function post_info() {
  postMessage({
    info: {
      ver: version,
      verOld: versionOld,
      len: data.length,
      platforms: [...allPlatforms],
    },
  } as WorkerTx)
}

let versionOld = undefined as string | undefined

function compare_to(oldver: string) {
  if (oldver === "x") {
    postMessage({ diffdata: [] } as WorkerTx)
    versionOld = undefined
    post_info()
    return
  }
  loadModel(oldver).then((old) => {
    console.log(`starting compare ${oldver} --> ${version}`)
    const res = compare(old, data)
    postMessage({ diffdata: res } as WorkerTx)
    versionOld = oldver
    post_info()
  })
}
