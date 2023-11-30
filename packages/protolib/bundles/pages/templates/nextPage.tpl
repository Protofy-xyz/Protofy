import Feature from 'app/bundles/custom/pages/{{name}}'
import { useSession } from 'protolib'

export default function {{upperName}}Page(props:any) {
  useSession(props.pageSession)
  return <Feature.component {...props} />
}

export const getServerSideProps = Feature.getServerSideProps