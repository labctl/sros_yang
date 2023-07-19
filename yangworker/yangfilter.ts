import { Item, YangFilter } from "./types"
import { areas } from "./const"

/** first word map */
let fwmap = [] as number[]
/** first word options
 * start searching from the longest possible match
 */
const fwoptions = areas
  .map((itm) => itm.value)
  .sort((a, b) => b.length - a.length)

export function filtered(data: Item[], f: YangFilter): Item[] {
  if (Object.keys(f).length == 0) {
    return data
  }

  const startswithi = f.startswith
    ? f.startswith.map((i) => fwoptions.indexOf(i))
    : []

  if (fwmap.length != data.length) {
    // Re-create first word map
    fwmap = calcFwMap(data, fwoptions, fwoptions.indexOf("other"))
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
    for (let i = 0; i < expected.length; i++) {
      if (item.k.startsWith(expected[i])) {
        return i
      }
      // Include 'state openconfig' with 'configure openconfig'
      if (
        expected[i] == "configure openconfig" &&
        item.k.startsWith("state openconfig")
      ) {
        return i
      }
    }
    return nomatch
  })
}
