import { Diff, Item } from "./types"

function changed(e0: Item, e1: Item): boolean {
  return e0.d !== e1.d || e0.w !== e1.w || e0.p !== e1.p || e0.t !== e1.t
}

export function compare(l0: Item[], l1: Item[]): Diff[] {
  const res = [] as Diff[]
  let i0 = 0
  let i1 = 0
  for (; i0 < l0.length && i1 < l1.length; ) {
    const e0 = l0[i0]
    const e1 = l1[i1]
    const c = e0.k.localeCompare(e1.k)
    if (c === 0) {
      //console.debug(c, e0.d, e1.d)
      if (changed(e0, e1)) {
        res.push({
          k: e0.k,
          change: "mod",
          old: e0,
          item: e1,
        })
      }
      i0++
      i1++
    } else if (c < 0) {
      res.push({ change: "del", k: e0.k, item: e0 })
      i0++
    } else {
      res.push({ change: "add", k: e1.k, item: e1 })
      i1++
    }
  }
  while (i0 < l0.length) {
    res.push({ change: "del", k: l0[i0].k, item: l0[i0] })
    i0++
  }
  while (i1 < l1.length) {
    res.push({ change: "add", k: l1[i1].k, item: l1[i1] })
    i1++
  }
  console.debug(`${res.length} differences`)

  return res
}
