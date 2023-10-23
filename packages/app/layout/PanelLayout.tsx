import {PanelLayout as ProtoPanelLayout} from 'protolib'
import { SideMenu } from './SideMenu'
import { HeaderContents } from './HeaderContents'
import { DefaultLayout } from './DefaultLayout'
import { HeaderMenu } from './HeaderMenu'
import { HeaderMenuContent } from './HeaderMenuContent'

export const PanelLayout = (props) => <ProtoPanelLayout menu={<HeaderMenu menuPlacement={'bottom'} />} Layout={DefaultLayout} headerContents={<HeaderContents menu={<HeaderMenu menuPlacement={'bottom'}>
<HeaderMenuContent />
</HeaderMenu>} />} SideMenu={SideMenu} {...props} />
