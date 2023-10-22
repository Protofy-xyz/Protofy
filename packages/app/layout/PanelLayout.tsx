import { DefaultLayout } from './DefaultLayout'
import { YStack, ScrollView, Theme } from 'tamagui'
import {AppBar} from 'protolib'
import { HeaderContents } from './HeaderContents'
import { SideMenu } from './SideMenu'
import { useTint } from '@tamagui/logo'
import {Tinted} from 'protolib'
import { Stack } from '@my/ui'

export const PanelLayout = ({panelBgColor='var(--color2)', menuContent, children}) => {
    const appBarHeight = 55
    const { tint, setNextTint } = useTint()
    return (
      <DefaultLayout
        header={
          <AppBar 
            height={appBarHeight} 
            fullscreen={true} 
            dettached={false} 
            translucid={false} 
            position="top"
            backgroundColor={'var(--color1)'}
          >
            <HeaderContents logoSize={40}/>
          </AppBar>
        }
        sideMenu={<SideMenu mt={appBarHeight} sideBarColor={'var(--color1)'}>{menuContent}</SideMenu>}
        footer={
          null
          // <AppBar dettached={false} translucid={false} position="bottom">
          //   <HeaderContents menuPlacement={"top"} />
          // </AppBar>
        }>
        {/* <Theme name={tint as any}> */}
        <Stack $sm={{br:"$0"}} btlr={"$6"} mt={appBarHeight} height={'calc(100vh - '+appBarHeight+'px)'}>
          {/* <Tinted> */}
            <YStack $sm={{br:"$0"}} btlr={"$6"} bc={panelBgColor} f={1} minHeight={'calc(100vh - '+appBarHeight+'px)'} flex={1}>
              {/* <Theme reset> */}
                {children}
              {/* </Theme> */}
            </YStack>
          {/* </Tinted> */}

        </Stack>
        {/* </Theme> */}
      </DefaultLayout>
    )
}
