export default (app, context) => {
    const {mqtt} = context
    mqtt.subscribe("iot/#", (err) => {
        if(err) {
            console.error("Error subscring to topic", err)
        }
    });

    mqtt.on("message", (topic, message) => {
        const parsedMessage = message.toString() //or JSON.parse(message.toString())
        console.log('# Message received in device router:', topic, parsedMessage)
        //mqtt.publish("topic", "message")
    })
}