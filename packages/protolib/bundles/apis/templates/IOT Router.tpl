
const API = {
    get: (endpoint) => {
        const SERVER = process?.env?.API_URL ?? 'http://localhost:8080';
        const url = SERVER + endpoint;
        return fetch(url)
            .then(response => {
                if (!response.ok) {
                    throw new Error('response error');
                }
                return response.json();
            })
            .then(data => {
                return data;
            })
            .catch(e => {
                console.error('Api error', e);
                throw e;
            });
    }
}


export default (app, context) => {

    const { mqtt } = context

    const listeners = [];

    const topicSub = (topic, cb) => {
        listeners.push({ topic: topic, cb: cb });
    };

    const topicPub = (topic, data) => {
        mqtt.publish(topic, data)
    }

    mqtt.on("message", (topic, message) => {
        const parsedMessage = message.toString();
        listeners.forEach(listener => {
            if (topic.startsWith(listener.topic)) {
                listener.cb(parsedMessage, topic);
            }
        });
    });


    const deviceSub = (deviceName, componentName, callback) => {
        const topic = deviceName + '/binary_sensor/' + componentName + "/state";
        mqtt.subscribe(topic, (err) => {
            if (err) {
                console.error("Error subscribing to topic", err);
                return;
            }
        });
        return topicSub(topic, callback);
    };

    const devicePub = async (deviceName, componentName, command) => {
        let devices
        try {
            const data = await API.get('/adminapi/v1/devices?itemsPerPage=1000');
            devices = data
        } catch (e) {
            console.error('Error in devicePub:', e);
        }

        const device = devices?.items.find(i => i.name == deviceName)
        const component = device.subsystem.find(s => s.name == componentName)
        const action = component.actions.find(a => a.payload.value == command)

        topicPub(deviceName + action?.endpoint, command)
    }

    ///YOUR LOGIC HERE :

}
