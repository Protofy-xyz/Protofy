import { H1 } from '@my/ui'
import { useSession } from 'protolib'

export default function Page(props: any) {
  useSession(props.pageSession)
  return (
      <H1>Lorem ipsum</H1>
  )
}

//export const getServerSideProps = nextPages["/"].getServerSideProps