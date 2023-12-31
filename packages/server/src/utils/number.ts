export function isNumber(val?: unknown): val is number {
  const num = toNumber(val)

  return Number.isFinite(num)
}

export function toNumber(val?: unknown) {
  if (typeof val === 'string' && !val) {
    return undefined
  }

  const num = Number(val)

  if (Number.isFinite(num)) {
    return num
  }
}
