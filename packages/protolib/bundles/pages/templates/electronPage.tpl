import Feature from 'app/bundles/custom/pages/{{name}}'
import { useSession } from 'protolib'
import { useRouter } from "next/router";

export default function {{upperName}}Page(props:any) {
  useSession(props.pageSession)
  return <Feature.component {...props} />
}