import { YStack, ScrollView, XStack, getTokens } from 'tamagui'
import { AppBar } from '../AppBar'
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";

export const PanelLayout = ({ panelBgColor = undefined, menuContent, children, SideMenu, Layout, headerContents, HeaderMenu, panelBottom = true }) => {
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
      <XStack f={1} p="$3" pl={0} bc={bgPanels}>
        <PanelGroup direction="vertical" style={{ height: '100%', width: '100%' }}>
          <Panel>
            <div style={{ display: 'flex', flexDirection: 'column', flex: 1, height: '100%', overflow: 'auto' }}>
              <XStack bc={"bgPanels"} elevation={3} br={"$6"} mt={appBarHeight} f={1} paddingBottom={panelBottom ? '20px' : '0px'} style={{ flex: 1 }}>
                <ScrollView f={1} $sm={{ br: "$0" }} style={{
                  flexGrow: 1,
                  overflowY: 'auto',
                  display: 'flex',
                  flexDirection: 'column'
                }}
                  contentContainerStyle={{ flexGrow: 1 }}
                >
                  <YStack f={1} br={"$6"} bc={panelBgColor ?? _panelBgColor} style={{ flex: 1, overflowY: 'auto' }}>
                    {children}
                  </YStack>
                </ScrollView>
              </XStack>
            </div>
          </Panel>
          {panelBottom && <><PanelResizeHandle>
            <div style={{ backgroundColor: '#ccc', width: '100%', height: '4px', cursor: 'row-resize' }}></div>
          </PanelResizeHandle>
            <Panel>
              <div style={{ display: 'flex', flex: 1, height: '100%', backgroundColor: 'grey' }}>
                <p>Contenido del panel inferior</p>
              </div>
            </Panel>
          </>}
        </PanelGroup>
      </XStack>
    </Layout>
  )
}
