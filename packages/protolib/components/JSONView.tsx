import dynamic from 'next/dynamic'
import { useThemeSetting } from '@tamagui/next-theme'

// Carga dinámica
const ReactJsonView = dynamic(() => import('@microlink/react-json-view'), { ssr: false })

const overrideCss = `
  .string-value { color: var(--color9) !important; }
`

export const JSONView = ({ src, onSelectKey=(key) => {}, ...props }) => {
  const { resolvedTheme } = useThemeSetting()
  const darkMode = resolvedTheme === 'dark'

  let value = src
  if (typeof value !== 'object') {
    value = { value }
  }

  return (
    <>
      <style>{overrideCss}</style>
      <ReactJsonView
        theme={darkMode ? 'eighties' : 'rjv-default'}
        name={false}
        indentWidth={2}
        displayDataTypes={false}
        quotesOnKeys={false}
        displayObjectSize={false}
        {...props}
        style={{
          backgroundColor: 'transparent',
          ...props?.style,
        }}
        src={value}
      />
    </>
  )
}