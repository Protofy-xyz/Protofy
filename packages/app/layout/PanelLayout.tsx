import {PanelLayout as ProtoPanelLayout, Search} from 'protolib'
import {SearchContext} from 'protolib/context/SearchContext'
import { SideMenu } from './SideMenu'
import { HeaderContents } from './HeaderContents'
import { DefaultLayout } from './DefaultLayout'
import { HeaderMenu } from './HeaderMenu'
import { HeaderMenuContent } from './HeaderMenuContent'
import { useContext } from 'react'
import { Theme } from '@my/ui'

export const PanelLayout = (props) => {
  const {search, setSearch, searchName} = useContext(SearchContext)
  return <ProtoPanelLayout 
    Layout={DefaultLayout} 
    headerContents={<HeaderContents 
        leftArea={<Search placeholder={"Search in "+searchName} initialState={search} defaultOpened={true} onSearch={setSearch} />}
        topBar={props.topBar}
        menu={<HeaderMenu menuPlacement={'bottom'}><HeaderMenuContent /></HeaderMenu>} />} 
        SideMenu={SideMenu} 
    {...props}></ProtoPanelLayout>
}
