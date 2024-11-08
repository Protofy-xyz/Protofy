export const getTransporter = () => process.env.AGENTS_TRANSPORT_PROTOCOL ?? "mqtt"

export { MqttTransporter } from './MqttTransporter'