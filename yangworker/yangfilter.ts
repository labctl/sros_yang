import { Item, YangFilter } from "./types"
import { areas } from "./const"

/** first word map */
let fwmap = [] as number[]
/** first word options */
const fwoptions = areas.map((itm) => itm.value)

export function filtered(data: Item[], f: YangFilter): Item[] {
  const startswithi = f.startswith
    ? f.startswith.map((i) => fwoptions.indexOf(i))
    : []

  if (fwmap.length != data.length) {
    // Re-create first word map
    fwmap = calcFwMap(data, fwoptions, areas.length - 1)
  }

  return data.filter((item: Item, idx: number) => {
    if (f.startswith && !startswithi.includes(fwmap[idx])) {
      return false
    }

    if (f.tick || f.cross) {
      //const pmatch = platforms.map((p)=>item.p.includes(p))
      if (
        f.cross &&
        f.platforms &&
        !f.platforms.some((p) => !item.p.includes(p))
      ) {
        return false
      }
      if (
        f.tick &&
        f.platforms &&
        !f.platforms.some((p) => item.p.includes(p))
      ) {
        return false
      }
    }
    if (!f.marks) {
      return true
    }
    let i = 0
    while (i < f.marks.length) {
      if (!item.k.includes(f.marks[i]) && !item.t.includes(f.marks[i])) {
        return false
      }
      i += 1
    }
    return true
  })
}

function calcFwMap(data: Item[], expected: string[], nomatch: number) {
  return data.map((item: Item) => {
    for (let i = expected.length - 1; i >= 0; i--) {
      if (item.k.startsWith(expected[i])) {
        return i
      }
    }
    return nomatch
  })
}
