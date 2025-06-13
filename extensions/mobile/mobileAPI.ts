export const MobileAPI = (app, context) => {
    const { topicSub, topicPub, mqtt } = context;
    const processMessage = (message, topic) =>{
        const data = JSON.parse(message);
        context.state.set({ group: 'mobile', tag: 'data', name: 'degrees', value: data.degrees });
        context.state.set({ group: 'mobile', tag: 'data', name: 'x', value: data.x });
        context.state.set({ group: 'mobile', tag: 'data', name: 'y', value: data.y  });
        context.state.set({ group: 'mobile', tag: 'data', name: 'z', value: data.z});
        context.state.set({ group: 'mobile', tag: 'data', name: 'alpha', value: data.alpha });
        context.state.set({ group: 'mobile', tag: 'data', name: 'beta', value: data.beta });
        context.state.set({ group: 'mobile', tag: 'data', name: 'gamma', value: data.gamma, emitEvent: true });
    }

    topicSub(mqtt, 'mobile/#', (message, topic) => processMessage(message, topic))

    app.get('/api/v1/mobile/data', async (req, res) => {
        const params = req.query;
        context.state.set({ group: 'mobile', tag: 'data', name: 'degrees', value: params.degrees });
        context.state.set({ group: 'mobile', tag: 'data', name: 'x', value: params.x });
        context.state.set({ group: 'mobile', tag: 'data', name: 'y', value: params.y  });
        context.state.set({ group: 'mobile', tag: 'data', name: 'z', value: params.z});
        context.state.set({ group: 'mobile', tag: 'data', name: 'alpha', value: params.alpha });
        context.state.set({ group: 'mobile', tag: 'data', name: 'beta', value: params.beta });
        context.state.set({ group: 'mobile', tag: 'data', name: 'gamma', value: params.gamma, emitEvent: true });
        console.log("set values to degrees: ", params.degrees, "x: ", params.x, "y: ", params.y, "z: ", params.z, "alpha: ", params.alpha, "beta: ", params.beta, "gamma: ", params.gamma);
        return { response: "ok" };
    })
}