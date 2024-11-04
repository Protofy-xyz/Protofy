export function LoadFont(props: { cssFile?: string; woff2File?: string, ttfFile?: string }) {
  return (
    <>
      {props.cssFile && (
        <link crossOrigin="anonymous" href={props.cssFile} rel="stylesheet" />
      )}
      {props.woff2File && (
        <link
          crossOrigin="anonymous"
          rel="preload"
          href={props.woff2File}
          as="font"
          type="font/woff2"
        />
      )}

      {props.ttfFile && (
          <link
          crossOrigin="anonymous"
          rel="preload"
          href={props.ttfFile}
          as="font"
        />
      )}
    </>
  )
}

export const LoadSilkscreen = () => (
  <LoadFont woff2File="/public/fonts/slkscr.woff2" cssFile="/public/fonts/silkscreen.css" />
)

export const LoadInter100 = () => (
  <LoadFont
    woff2File="/public/fonts/subset-Inter-Thin.woff2"
    cssFile="/public/fonts/inter-100.css"
  />
)

export const LoadInter200 = () => (
  <LoadFont
    woff2File="/public/fonts/subset-Inter-ExtraLight.woff2"
    cssFile="/public/fonts/inter-200.css"
  />
)

export const LoadInter300 = () => (
  <LoadFont
    woff2File="/public/fonts/subset-Inter-Light.woff2"
    cssFile="/public/fonts/inter-300.css"
  />
)

export const LoadInter400 = () => (
  <LoadFont
    woff2File="/public/fonts/subset-Inter-Regular.woff2"
    cssFile="/public/fonts/inter-400.css"
  />
)

export const LoadInter500 = () => (
  <LoadFont
    woff2File="/public/fonts/subset-Inter-Medium.woff2"
    cssFile="/public/fonts/inter-500.css"
  />
)

export const LoadInter600 = () => (
  <LoadFont
    woff2File="/public/fonts/subset-Inter-SemiBold.woff2"
    cssFile="/public/fonts/inter-600.css"
  />
)

export const LoadInter700 = () => (
  <LoadFont
    woff2File="/public/fonts/subset-Inter-Bold.woff2"
    cssFile="/public/fonts/inter-700.css"
  />
)

export const LoadInter800 = () => (
  <LoadFont
    woff2File="/public/fonts/subset-Inter-ExtraBold.woff2"
    cssFile="/public/fonts/inter-800.css"
  />
)

export const LoadInter900 = () => (
  <LoadFont woff2File="/public/fonts/subset-Inter-Black.woff2" cssFile="/public/fonts/inter-900.css" />
)

export const LoadJostRegular = () => (
  <LoadFont
    woff2File="/public/fonts/Jost-Regular.ttf"
    cssFile="/public/fonts/Jost-Regular.css"
  />
)

export const LoadJostMedium = () => (
  <LoadFont
    woff2File="/public/fonts/Jost-Medium.ttf"
    cssFile="/public/fonts/Jost-Medium.css"
  />
)

export const LoadGlusp = () => (
  <LoadFont woff2File="/public/fonts/glusp.woff2" cssFile="/public/fonts/glusp.css" />
)

export const LoadMunro = () => (
  <LoadFont woff2File="/public/fonts/munro.woff2" cssFile="/public/fonts/munro.css" />
)

export const LoadCherryBomb = () => (
  <LoadFont woff2File="/public/fonts/cherry-bomb.woff2" cssFile="/public/fonts/cherry-bomb.css" />
)
