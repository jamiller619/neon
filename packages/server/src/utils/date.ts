export function toUnixTime(date = Date.now()) {
  return Math.round(date / 1000)
}

export function fromUnixTime(date: number) {
  return new Date(date * 1000)
}
