export const MobileAPI = (app, context) => {
    app.get('/api/core/v1/mobile/data', async (req, res) => {
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