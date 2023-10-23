import { YStack, ScrollView, Theme } from 'tamagui'
import {AppBar, useTint} from 'protolib'
import { useThemeSetting } from '@tamagui/next-theme'

export const PanelLayout = ({panelBgColor=undefined, menuContent, children, SideMenu, Layout, headerContents, HeaderMenu}) => {
    const appBarHeight = 55
    const { tint, setNextTint } = useTint()
    const { resolvedTheme } = useThemeSetting()
    const isDark = resolvedTheme == 'dark'
    const bgPanels = '$color1'//isDark ? '$color1': '$'+tint+'2'
    const _panelBgColor = '$color2'//isDark ? '$color2' : '$color1'

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
            {headerContents}
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
        <ScrollView $sm={{br:"$0"}} btlr={"$6"} mt={appBarHeight} height={'calc(100vh - '+appBarHeight+'px)'}>
          {/* <Tinted> */}
            <YStack btlr={"$6"} bc={panelBgColor ?? _panelBgColor} f={1} minHeight={'calc(100vh - '+appBarHeight+'px)'} flex={1}>
              {/* <Theme reset> */}
                {children}
              {/* </Theme> */}

            </YStack>
          {/* </Tinted> */}

        </ScrollView>
        {/* </Theme> */}
      </Layout>
    )
}
