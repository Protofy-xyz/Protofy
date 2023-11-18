import { YStack, ScrollView, Theme, XStack } from 'tamagui'
import {AppBar, useTint} from 'protolib'
import { useThemeSetting } from '@tamagui/next-theme'
import { getTokens } from '@tamagui/core'

export const PanelLayout = ({panelBgColor=undefined, menuContent, children, SideMenu, Layout, headerContents, HeaderMenu}) => {
    const appBarHeight = 55
    const { tint, setNextTint } = useTint()
    const { resolvedTheme } = useThemeSetting()
    const isDark = resolvedTheme == 'dark'
    const bgPanels = isDark ? '$color1': '$color2'
    const _panelBgColor = isDark ? '$color2' : '$color1'

    return (
      <Layout
        header={
          <AppBar 
            height={appBarHeight} 
            fullscreen={true} 
            dettached={false} 
            translucid={false} 
            position="top"
            backgroundColor={bgPanels}
            
          >
            <XStack ml={"$5"} justifyContent="space-between" f={1}>{headerContents}</XStack>
          </AppBar>
        } 
        sideMenu={<SideMenu mt={appBarHeight} sideBarColor={bgPanels}>{menuContent}</SideMenu>}
        footer={
          null
          // <AppBar dettached={false} translucid={false} position="bottom">
          //   <HeaderContents menuPlacement={"top"} />
          // </AppBar>
        }>
        {/* <Theme name={tint as any}> */}
        <XStack f={1} p="$3" bc={bgPanels}>
          <XStack bc={bgPanels} elevation={3} br={"$6"} mt={appBarHeight} f={1} height={'calc(100vh - '+(appBarHeight+30)+'px)'}>
            <ScrollView $sm={{br:"$0"}} height={'calc(100vh - '+(appBarHeight+30)+'px)'}>
              {/* <Tinted> */}
                <YStack br={"$6"} bc={panelBgColor ?? _panelBgColor} f={1} minHeight={'calc(100vh - '+(appBarHeight+30)+'px)'} flex={1}>
                  {/* <Theme reset> */}
                    {children}
                  {/* </Theme> */}

                </YStack>
              {/* </Tinted> */}
            </ScrollView>
          </XStack>
        {/* </Theme> */}
        </XStack>
      </Layout>
    )
}
