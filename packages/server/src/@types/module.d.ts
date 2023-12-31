declare module '*.png' {
  const imagePath: string
  export default imagePath
}

declare module '*.sql' {
  const text: string
  export default text
}

declare module '*.env' {
  const text: string
  export default text
}

declare module '*.html' {
  const file: string
  export default file
}
