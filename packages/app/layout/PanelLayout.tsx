import { PanelLayout as ProtoPanelLayout } from 'protolib/components/layout/PanelLayout'
import { SearchContext } from 'protolib/context/SearchContext'
import { Search } from 'protolib/components/Search'
import { SideMenu } from './SideMenu'
import { HeaderContents } from './HeaderContents'
import { DefaultLayout } from './DefaultLayout'
import { HeaderMenu } from './HeaderMenu'
import { HeaderMenuContent } from './HeaderMenuContent'
import { useContext } from 'react'

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
