import dynamic from 'next/dynamic';
import userComponents from "../visualui/components";
// @ts-ignore
const CODE = `
import Page from "../uikit/Page"
const Home = () => {
  return (
  <Page>
  </Page>
  )
  }`

const UiManager = dynamic(() => import('visualui'), { ssr: false })
export default ({isVSCode=true}) => {
  return (
    <main className='h-screen flex flex-col items-center justify-center'>
      <UiManager userComponents={userComponents} isVSCode={isVSCode} _sourceCode={CODE}></UiManager>
    </main>
  )
}