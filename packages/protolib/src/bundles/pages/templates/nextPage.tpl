import Feature from 'app/pages/{{name}}'
import { useSession } from 'protolib/lib/useSession'

export default function {{upperName}}Page(props:any) {
  useSession(props.pageSession)
  return <Feature.component {...props} />
}

export const getServerSideProps = Feature.getServerSideProps