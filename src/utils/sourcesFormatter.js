export {
  formatter,
  roundShare,
  formatShare
}

/**
 * @typedef {{
 *  funds: {
 *    type?: string
 *    name: string
 *  } | {
 *    type?: string
 *    name?: string
 *  }
 * }} Funded
 */

/**
 * @template {Funded & {
 *  share: number
 *  amount: number
 * }} S
 * @param {Array<S>} sources
 * @param {"funds.type"|({[k in keyof S]: S[k] extends string ? k : never }[keyof S])} prop
 */
function formatter(sources, prop) {
  /**
   * @type Record<string, S>
   */
  const groupedMap = {}
  , {length} = sources

  for (let s = 0; s < length; s++) {
    const source = sources[s]
    , {funds} = source

    if (!funds.type)
      funds.type = funds.name

    /** @type {string} */
    // @ts-expect-error Type 'undefined' is not assignable to type 'string'
    const key = prop === "funds.type" ? funds.type : source[prop]

    // eslint-disable-next-line no-prototype-builtins
    if (!groupedMap.hasOwnProperty(key)) {
      groupedMap[key] = {
        ...source,
      }
    } else {
      groupedMap[key].share += source.share
      groupedMap[key].amount += source.amount
    }
  }

  const grouped = Object.values(groupedMap)

  for (let g = grouped.length; g--;) {
    const source = grouped[g]
    source.share = roundShare(source.share)
  }

  return grouped
}

/**
 * @param {number} share
 */
function roundShare(share) {
  return Math.trunc(share * 10000 ) / 10000
}
/**
 * @param {number} share
 */
function formatShare(share) {
  return `${
    share < 0.0001
    ? "< 0.01"
    : (share * 100).toFixed(2)
  }%`
}
