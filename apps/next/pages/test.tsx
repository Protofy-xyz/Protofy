import Feature from 'app/bundles/custom/pages/test'
import { useSession } from 'protolib'

export default function TestPage(props:any) {
  useSession(props.pageSession)
  return <Feature.component {...props} />
}

export const getServerSideProps = Feature.getServerSideProps