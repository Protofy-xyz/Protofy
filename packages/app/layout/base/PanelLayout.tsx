import { YStack, ScrollView, XStack, getTokens } from 'tamagui'
import { AppBar } from 'protolib/dist/components/AppBar'

export const PanelLayout = ({ panelBgColor = undefined, menuContent, children, SideMenu, Layout, headerContents, HeaderMenu }) => {
  const appBarHeight = 55
  const bgPanels = '$bgPanel'
  const _panelBgColor = '$bgContent'

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
          <XStack marginLeft={"$5"} justifyContent="space-between" flex={1}>{headerContents}</XStack>
        </AppBar>
      }
      sideMenu={<SideMenu marginTop={appBarHeight} sideBarColor={bgPanels}>{menuContent}</SideMenu>}
      footer={
        null
        // <AppBar dettached={false} translucid={false} position="bottom">
        //   <HeaderContents menuPlacement={"top"} />
        // </AppBar>
      }>
      {/* <Theme name={tint as any}> */}
      <XStack flex={1} padding="$3" paddingLeft={0} backgroundColor={bgPanels}>
        <XStack backgroundColor={bgPanels} elevation={3} borderRadius={"$6"} marginTop={appBarHeight} flex={1} height={'calc(100vh - ' + (appBarHeight + 30) + 'px)'}>
          <ScrollView $sm={{  borderRadius: "$0" }} height={'calc(100vh - ' + (appBarHeight + 30) + 'px)'}>
            {/* <Tinted> */}
            <YStack borderRadius={"$6"} backgroundColor={panelBgColor ?? _panelBgColor} flex={1} minHeight={'calc(100vh - ' + (appBarHeight + 30) + 'px)'}>
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
