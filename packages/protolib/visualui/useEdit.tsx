import { useState, useEffect } from 'react'
import { API, withSession } from 'protolib'
import { useSearchParams } from 'next/navigation'
import dynamic from 'next/dynamic';
import userComponents from "app/features/visualui/components"

const UiManager = dynamic(() => import('visualui'), { ssr: false })

export const useEdit = (fn) => {
  const searchParams = useSearchParams()
  const edit = searchParams.get('_visualui_edit_')
  if (edit) {
    return <VisualUILoader />
  }
  else {
    return fn()
  }
}

const VisualUILoader = () => { // Should be in a component
  const [res, setRes] = useState<any>()
  const [fileContent, setFileContent] = useState()
  const page = "test"
  const folderRoute = "/apps/next/pages/"
  const pageExtension = ".tsx"
  const currentPageFilename = folderRoute + page + pageExtension

  const onSave = (content: string) => {
    // writeFileContent(content)
  }
  const getFileContent = () => {
    const url = ('/adminapi/v1/files/' + currentPageFilename).replace(/\/+/g, '/')
    API.get(url, setRes, true)
  }
  const writeFileContent = (content: string) => {
    const url = ('/adminapi/v1/files/' + currentPageFilename).replace(/\/+/g, '/')
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
  return <UiManager userComponents={userComponents} _sourceCode={fileContent} onSave={onSave} />

}