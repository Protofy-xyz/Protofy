import { getTransporter, MqttTransporter } from "./transporters"

export const NetworkProtocol = (context) => {
    /*
        HERE GET THE TRANSPORTER DYNAMICALLY
        BASED ON THE CURRENT AGENTS OR SOMETHING LIKE THAT
    */
    MqttTransporter(context)
    MqttTransporter(context)
}