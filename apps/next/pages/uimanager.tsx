import UIManager from 'app/features/uimanager'
import Head from 'next/head'
import { SSR } from 'app/conf'
import { NextPageContext } from 'next'
import { API, withSession } from 'protolib'
import { useEffect, useState } from 'react'
import {useEffectOnce} from 'usehooks-ts'

export default function VisualUIPage(props: any) {
  // start fetch content from back
  const [res, setRes] = useState<any>();
  const [fileContent, setFileContent] = useState<any>();

  const page = "test"
  const folderRoute = "/apps/next/pages/";
  const pageExtension = ".tsx";
  const currentPageFilename = folderRoute + page + pageExtension

  const getFileContent = () => {
    const url = ('/adminapi/v1/files/' + currentPageFilename).replace(/\/+/g, '/')
    API.get(url, setRes, true)
  }

  const writeFileContent = (content: string) => {
    const url = ('/adminapi/v1/files/' + currentPageFilename).replace(/\/+/g, '/')
    API.post(url, {content})
  }
  const onSave = (content: string) => {
    writeFileContent(content)
  }
  
  useEffectOnce(() => {
    getFileContent()
  })

  useEffect(() => {
    if (res?.status == 'loaded' && res?.data) {
      setFileContent(res.data)
    }
  }, [res])
  // end fetch content from back

  return (
    <>
      <Head>
        <title>Protofy - UIManager</title>
      </Head>
      <UIManager code={fileContent} onSave={onSave} {...props} />
    </>
  )
}

export const getServerSideProps = SSR(async (context: NextPageContext) => withSession(context, []))