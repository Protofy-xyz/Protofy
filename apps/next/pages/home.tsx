import Feature from 'app/pages/home'
import { useSession } from 'protolib/lib/Session'

export default function IndexPage(props:any) {
  useSession(props.pageSession)
  return <Feature.component {...props} />
}

export const getServerSideProps = Feature.getServerSideProps