export default {
    name: 'Device Sub/Range/Actions',
    // category: 'device-snippets',
    code: `context.deviceSub(
  context.mqtt,
  context,
  " ",
  " ",
  " ",
  async (message, topic, done) => {
    context.flow.inRange(
      message,
      1.5,
      0.3,
      async (delta) =>
        await context.deviceAction("", "", "", undefined, null, null),
      async (delta) =>
        await context.deviceAction("", "", "", undefined, null, null),
      async (delta) =>
        await context.deviceAction("", "", "", undefined, null, null),
      null
    );
  }
);`,
    keywords: ['device', 'sub', 'range', 'action', 'snippet']
}