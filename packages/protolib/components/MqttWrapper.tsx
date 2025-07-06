import { getBrokerUrl } from "../lib/Broker"
import Connector from "../lib/mqtt/Connector"
import { useSession } from "../lib/useSession"

export const MqttWrapper = ({ children }: { children: React.ReactNode }) => {
  const [session] = useSession()
  const brokerUrl = getBrokerUrl()

  return (
    <Connector brokerUrl={brokerUrl} options={{ username: session?.user?.id, password: session?.token }}>
      {children}
    </Connector>
  )
}