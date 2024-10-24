import { useSession } from 'protolib/lib/Session'

export default function IndexPage(props:any) {
  useSession(props.pageSession)
  return <h1>Hello from electron</h1>
}