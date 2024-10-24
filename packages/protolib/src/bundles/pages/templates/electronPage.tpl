import Feature from 'app/pages/{{name}}'
import { useSession } from 'protolib/lib/Session'
import { useRouter } from "solito/navigation";

export default function {{upperName}}Page(props:any) {
  useSession(props.pageSession)
  return <Feature.component {...props} />
}