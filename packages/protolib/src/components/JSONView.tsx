import dynamic from 'next/dynamic'
import { useThemeSetting } from '@tamagui/next-theme'

//load reactjsonview with dynamic 
const ReactJsonView = dynamic(() => import('@microlink/react-json-view'), { ssr: false })
const overrideCss = `
  .string-value { color: var(--color9) !important; }
`;

export const JSONView = (props) => {
    const { resolvedTheme } = useThemeSetting()
      const darkMode = resolvedTheme == 'dark'
    return <>
    <style>{overrideCss}</style>
    <ReactJsonView 
        theme={darkMode?'eighties':'rjv-default'}
        enableClipboard={false}
        name={false}
        indentWidth={2}
        displayDataTypes={false}
        quotesOnKeys={false}
        displayObjectSize={false} 
        style={{
            dataTypes: {
                string: 'red'
            }
        }}
        {...props}
    /></>
}