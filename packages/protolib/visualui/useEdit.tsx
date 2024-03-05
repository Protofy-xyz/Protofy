import { useState, useEffect } from 'react'
import { API, Tinted } from 'protolib'
import { Pencil } from '@tamagui/lucide-icons'
import { getTokens } from '@tamagui/core'
import { Button } from 'tamagui'
import { useRouter } from "next/router"
import dynamic from 'next/dynamic';
import { palettes } from './index'
import { Session } from 'protolib'
import { useAtom } from 'jotai'
import { useIsEditing } from './useIsEditing'
import { useToastController } from '@my/ui'

const UiManager = dynamic(() => import('visualui'), { ssr: false })



export const useEdit = (fn, userComponents = {}, path = "/apps/next/pages/test.tsx", editorUsers = ["admin"], context = {}) => {
  const router = useRouter()
  const [session] = useAtom(Session)
  const edit = useIsEditing()

  const metadata = {
    "tamagui": getTokens(),
    "context": context
  }

  const isAdmin = editorUsers.includes(session?.user?.type)

  if (!isAdmin) return fn()
  else if (edit) {
    return <VisualUILoader userComponents={userComponents} path={path} metadata={metadata} />
  }
  else {
    const onEdit = () => {
      router.push({
        pathname: router.pathname,
        query: { ...router.query, _visualui_edit_: 'page' }
      })
    }

    return <div style={{ flex: 1, display: 'flex' }}>
      {fn()}
      <Tinted>
        <Button
          id='use-edit-btn'
          t="$4"
          r="$4"
          br={"$6"}
          display={process.env.NODE_ENV == "production" ? 'none' : "flex"} // Hide edit button when production mode
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

const VisualUILoader = ({ userComponents, path, metadata }: { userComponents: any, path: string, metadata: any }) => { // Should be in a component
  const [res, setRes] = useState<any>()
  const [fileContent, setFileContent] = useState()
  const toast = useToastController()
  
  const onSave = (content: string) => {
    writeFileContent(content)
  }
  const getFileContent = () => {
    const url = ('/adminapi/v1/files/' + path).replace(/\/+/g, '/')
    API.get(url, setRes, true)
  }
  const writeFileContent = (content: string) => {
    const url = ('/adminapi/v1/files/' + path).replace(/\/+/g, '/')

    API.post(url, { content }, (response: any) => {
      if (response.status == "loaded") {
        toast.show('Successfully saved!', {
          duration: 2000,
          tint: 'blue'
        })
      } else if (response.isError) {
        toast.show('Error Saving!', {
          duration: 2000,
          message: "It looks like something went wrong.",
          tint: 'red'
        })
      }
    })
  }

  useEffect(() => {
    getFileContent()
  }, [])

  useEffect(() => {
    if (res && res.status == 'loaded' && res.data) {
      setFileContent(res.data)
    }
  }, [res])
  return <UiManager metadata={metadata} userPalettes={{ ...palettes, user: userComponents }} _sourceCode={fileContent} onSave={onSave} />

}