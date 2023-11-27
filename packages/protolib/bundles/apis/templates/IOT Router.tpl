export default (app, context) => {

    const { mqtt } = context
    const listeners = [];

    mqtt.on("message", (topic, message) => {
        const parsedMessage = message.toString();
        listeners.filter(l => topic.startsWith(l.topic)).forEach(l => l.cb(parsedMessage, topic));
    });

    mqtt.on('connect', function () {
        mqtt.subscribe('#')
    })

    const topicSub = (topic, cb) => {
        listeners.push({ topic: topic, cb: cb });
    };

    const topicPub = (topic, data) => {
        mqtt.publish(topic, data)
    }

    const deviceSub = (deviceName, component, componentName, cb) => {
        console.log(topicSub(deviceName + '/' + component + '/' + componentName + '/state', cb))
    }

    const devicePub = async (deviceName, component, componentName, command) => {
        if (typeof command == "string") {
            topicPub(deviceName + '/' + component + '/' + componentName + '/command', command)
        } else {
            topicPub(deviceName + '/' + component + '/' + componentName + '/command', JSON.stringify(command))
        }
    }

    ///YOUR LOGIC HERE :

}