import nextPages from 'app/bundles/nextPages'
import { useSession } from 'protolib'

export default function Page(props:any) {
  useSession(props.pageSession)
  return (
    <>
      {nextPages["/"].component()}
    </>
  )
}

export const getServerSideProps = nextPages["/"].getServerSideProps