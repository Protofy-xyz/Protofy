import Feature from 'app/bundles/custom/pages/{{name}}'
import { useSession } from 'protolib/dist/lib/Session'
import { useRouter } from "solito/navigation";

export default function {{upperName}}Page(props:any) {
  useSession(props.pageSession)
  return <Feature.component {...props} />
}