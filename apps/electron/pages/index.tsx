import electronPages from 'app/bundles/electronPages'
import { useSession } from 'protolib'

export default function Page(props: any) {
  useSession(props.pageSession)
  return (
    <>
      {electronPages["/"].component(props)}
    </>
  )
}

export const getServerSideProps = electronPages["/"].getServerSideProps