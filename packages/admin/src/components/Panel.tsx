import { Box, Flex } from '@radix-ui/themes'
import styled, { css } from 'styled-components'

export const panelStyle = css`
  border-radius: var(--radius-4);
  background-color: var(--gray-a2);
  backdrop-filter: blur(10px) saturate(180%);
`

const BoxPanel = styled(Box)`
  ${panelStyle}
`

const FlexPanel = styled(Flex)`
  ${panelStyle}
`

export default {
  Box: BoxPanel,
  Flex: FlexPanel,
}
