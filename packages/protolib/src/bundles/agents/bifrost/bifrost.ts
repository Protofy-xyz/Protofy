import { getTransporter, MqttTransporter } from "./transporters"

export const BifrostProtocol = (context) => {
    /*
        HERE GET THE TRANSPORTER DYNAMICALLY
        BASED ON THE CURRENT AGENTS OR SOMETHING LIKE THAT
    */
    MqttTransporter(context)
    MqttTransporter(context)
}