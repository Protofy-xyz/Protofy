import Feature from 'app/bundles/custom/pages/screen'
import { useSession } from 'protolib/dist/lib/Session'

export default function IndexPage(props:any) {
  useSession(props.pageSession)
  return <Feature.component {...props} />
}