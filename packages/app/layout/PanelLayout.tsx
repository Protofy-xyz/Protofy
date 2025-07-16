import { PanelLayout as ProtoPanelLayout } from 'protolib/components/layout/PanelLayout'
import { SearchContext } from 'protolib/context/SearchContext'
import { SideMenu } from './SideMenu'
import { HeaderContents } from './HeaderContents'
import { DefaultLayout } from './DefaultLayout'
import { useContext } from 'react'

export const PanelLayout = (props) => {
  const { search, setSearch, searchName } = useContext(SearchContext)
  return <ProtoPanelLayout
    Layout={DefaultLayout}
    headerContents={<HeaderContents
      topBar={props.topBar}
    />
    }
    SideMenu={SideMenu}
    {...props}></ProtoPanelLayout>
}
