import { Item } from "./types"
import { decompressFromUint8Array } from "lz-string"

/** a set containing all platforms that has been loaded */
export const allPlatforms = new Set()

export function jsonFetchDecomp(url: string): Promise<any> {
  const opt = {
    method: "GET",
    credentials: "include" as const,
    headers: {
      Accept: "application/json",
    },
    redirect: "error" as const,
  }

  return fetch(url, opt)
    .then((response) => response.arrayBuffer())
    .then((arrayBuf) => {
      const jsn = decompressFromUint8Array(new Uint8Array(arrayBuf))
      return JSON.parse(jsn)
    })
}

export function loadModel(ver: string): Promise<Item[]> {
  const p1 = jsonFetchDecomp(`/yang/paths${ver}.lzs`).then(
    (res) => (res ?? []) as string[]
  )
  const p2 = jsonFetchDecomp(`/yang/descriptions${ver}.lzs`).then(
    (res) => (res ?? []) as string[]
  )
  const p3 = jsonFetchDecomp(`/yang/platforms${ver}.lzs`).then(
    (res) => (res ?? []) as string[]
  )
  return Promise.all([p1, p2, p3])
    .then(([dPath, dDesc, dPlat]) => {
      console.debug(`loaded ${ver}`)
      return dPath.map((s, index) => {
        const sp: string[] = s.split(",")
        return {
          k: sp[0],
          t: sp[2],
          w: sp[1] ? sp[1].toUpperCase() : "T", // t for tools/cli
          p: fixPlatform(dPlat[index]),
          d: dDesc[index] ?? "", // description can be shorter
        }
      })
    })
    .catch((e) => {
      console.error(`Could not load ${ver}: ${e}`)
      return [] as Item[]
    })
}

/** basic replacement on platform */
function fixPlatform(s: string): string {
  let res = ""
  s.split(",").forEach((s) => {
    if (s.startsWith("S")) s = s.replace("S", "SR-")
    else if (s.startsWith("E")) s = s.replace("E", "ESS-")
    else if (s.startsWith("I")) s = s.replace("I", "IXR-")
    else if (s.startsWith("X")) s = s.replace("X", "XRS-")
    else if (s.startsWith("N")) s = s.replace("N", "VSR-NRC")
    if (!s) return
    if (s.endsWith("-")) s = s.slice(0, s.length - 1)

    if (res) res += ","
    allPlatforms.add(s)
    res += s
  })
  return res
}
