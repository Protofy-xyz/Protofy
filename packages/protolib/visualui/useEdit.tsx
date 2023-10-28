import { useState, useEffect } from 'react'
import { API, withSession } from 'protolib'
import { useSearchParams } from 'next/navigation'
import dynamic from 'next/dynamic';
import protolibPalette from './index'

const UiManager = dynamic(() => import('visualui'), { ssr: false })

export const useEdit = (fn, userComponents = {}, path="/apps/next/pages/test.tsx") => {
  const searchParams = useSearchParams()
  const edit = searchParams.get('_visualui_edit_')
  if (edit) {
    return <VisualUILoader userComponents={userComponents} path={path}/>
  }
  else {
    return fn()
  }
}

const VisualUILoader = ({userComponents, path}) => { // Should be in a component
  const [res, setRes] = useState<any>()
  const [fileContent, setFileContent] = useState()
  const onSave = (content: string) => {
    // writeFileContent(content)
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
  return <UiManager userPalettes={{protolib: protolibPalette, user: userComponents}} _sourceCode={fileContent} onSave={onSave} />

}