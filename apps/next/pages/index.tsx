import Feature from 'app/bundles/custom/pages/home'
import { useSession } from 'protolib/dist/lib/Session'

export default function IndexPage(props:any) {
  useSession(props.pageSession)
  return <Feature.component {...props} />
}

export const getServerSideProps = Feature.getServerSideProps