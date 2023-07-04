/**
Yang Item
*/
export interface Item {
  /** key or path */
  k: string
  /** type */
  t: string
  /** platform */
  p: string
  /** description */
  d: string
  /** rw/w/t */
  w: string
}

export interface Info {
  ver: string
  verOld?: string
  len: number
  platforms: string[]
}

export interface YangFilter {
  /** path/key/type should contain ALL these words */
  marks?: string[]
  /** only include paths starting with one of these words */
  startswith?: string[]
  tick?: boolean
  cross?: boolean
  platforms?: string[]
}

export interface WorkerRx {
  /** load a specific version */
  load?: string
  /** diff to target */
  compare?: string
  /** get results */
  get?: YangFilter
}

export interface WorkerTx {
  data?: Item[]
  diffdata?: Diff[]
  /** info on loaded model */
  info?: Info
}

export interface Diff {
  k: string
  change: "add" | "del" | "mod"
  old?: Item
  item: Item
}
