import { describe, expect, test } from "vitest"
import { compare } from "./yangdiff"
import { Diff, Item } from "./types"

describe("yangdiff", () => {
  test("compare", () => {
    const i_a = { k: "a", d: "aa" } as Item
    const i_a1 = { k: "a", d: "aa", t: "a" } as Item
    const i_b = { k: "b", d: "bb" } as Item
    const i_c = { k: "c", d: "cc" } as Item

    let res = [] as Diff[]

    res = compare([i_a], [i_a1])
    expect(res).toEqual([
      {
        change: "mod",
        k: i_a.k,
        old: i_a,
        item: i_a1,
      },
    ])

    res = compare([i_a, i_b, i_c], [i_b, i_c])
    expect(res).toEqual([
      {
        k: i_a.k,
        change: "del",
        item: i_a,
      },
    ])

    res = compare([i_a, i_b], [i_b, i_c])
    expect(res).toEqual([
      {
        k: i_a.k,
        change: "del",
        item: i_a,
      },
      {
        k: i_c.k,
        change: "add",
        item: i_c,
      },
    ])

    res = compare([i_a], [i_a])
    expect(res).toEqual([])

    res = compare([], [i_a, i_b])
    expect(res).toEqual([
      {
        k: i_a.k,
        change: "add",
        item: i_a,
      },
      {
        k: i_b.k,
        change: "add",
        item: i_b,
      },
    ])

    res = compare([i_a, i_b], [])
    expect(res).toEqual([
      {
        k: i_a.k,
        change: "del",
        item: i_a,
      },
      {
        k: i_b.k,
        change: "del",
        item: i_b,
      },
    ])
  })
})
