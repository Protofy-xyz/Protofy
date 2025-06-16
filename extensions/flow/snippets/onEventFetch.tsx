export default {
    name: 'onEvent/Fetch',
    // category: 'events-snippets',
    code: `context.events.onEvent(
      context.mqtt,
      context,
      async (event) =>
        context.apis.fetch(
          "get",
          "/api/v1/",
          null,
          async (data) =>
            await context.logs.log({
              name: name,
              from: origin,
              message: "response",
              level: "info",
            }),
          null,
          false
        ),
      "",
      ""
    )`,
    keywords: ['on', 'event', 'fetch', 'snippet']
}