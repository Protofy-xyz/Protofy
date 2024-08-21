export default {
    name: 'onEvent/Fetch',
    // category: 'events-snippets',
    code: `context.onEvent(
      context.mqtt,
      context,
      async (event) =>
        context.fetch(
          "get",
          "/api/v1/",
          null,
          async (data) =>
            await context.logs.log({
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