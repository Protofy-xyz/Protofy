import { useState, useEffect } from 'react'
import { API, Tinted } from 'protolib'
import { Pencil } from '@tamagui/lucide-icons'
import { Button } from 'tamagui'
import { useRouter } from "next/router"
import dynamic from 'next/dynamic';
import protolibPalette from './index'
import { Session } from 'protolib'
import { useAtom } from 'jotai'
import {useIsEditing} from './useIsEditing'

const UiManager = dynamic(() => import('visualui'), { ssr: false })



export const useEdit = (fn, userComponents = {}, path = "/apps/next/pages/test.tsx") => {
  const router = useRouter()
  const [session] = useAtom(Session)
  const edit = useIsEditing()

  const isAdmin = session.user?.type == 'admin'
  if (!isAdmin) return fn()
  else if (edit) {
    return <VisualUILoader userComponents={userComponents} path={path} />
  }
  else {
    const onEdit = () => {
      router.push({
        pathname: router.pathname,
        query: { _visualui_edit_: 'page' }
      })
    }
    return <div style={{ flex: 1, display: 'flex' }}>
      {fn()}
      <Tinted>
        <Button
          t="$4"
          r="$4"
          br={"$6"}
          pos='fixed'
          bc={"$color8"}
          zIndex={9999999999}
          circular
          onPress={onEdit}
        >
          <Pencil fillOpacity={0} color='white' />
        </Button>
      </Tinted>
    </div>
  }
}

const VisualUILoader = ({ userComponents, path }) => { // Should be in a component
  const [res, setRes] = useState<any>()
  const [fileContent, setFileContent] = useState()
  const onSave = (content: string) => {
    writeFileContent(content)
  }
  const getFileContent = () => {
    const url = ('/adminapi/v1/files/' + path).replace(/\/+/g, '/')
    API.get(url, setRes, true)
  }
  const writeFileContent = (content: string) => {
    const url = ('/adminapi/v1/files/' + path).replace(/\/+/g, '/')
    API.post(url, { content })
  }

  useEffect(() => {
    getFileContent()
  }, [])

  useEffect(() => {
    if (res && res.status == 'loaded' && res.data) {
      setFileContent(res.data)
    }
  }, [res])
  return <UiManager userPalettes={{ protolib: protolibPalette, user: userComponents }} _sourceCode={fileContent} onSave={onSave} />

}