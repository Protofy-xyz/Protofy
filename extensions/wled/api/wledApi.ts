import { API, getLogger } from "protobase";
const logger = getLogger();

export const WledAPI = (app, context) => {
  logger.info("wledApi started");

  app.get("/api/core/v1/wled/state", async (req, res) => {
    const { address } = req.params;
    const state = await API.get(`http://${address}/json/state`)
    res.send(state);
  });

  app.post("/api/core/v1/wled/action/:address", async (req, res) => {
    let result
    const { address } = req.params;
    const { payload } = req.body;

    const formatedPayload = generateWLEDJson(payload);

    const path = `http://${address}/json`
    logger.info(`wledApi - Sending action to wled on Address: ${address}`);
    logger.info(`wledApi - Payload: ${JSON.stringify(formatedPayload)}`);

    try {
      const response = await API.post(path, formatedPayload);
      logger.info(`wledApi - action sent to ${path}, Response: ${JSON.stringify(response)}`);
      if (response.isError) {
        throw new Error(response.error);
      }
      if (!response.error && response.data) {
        result = { "response": response.data }
      }
    } catch (error) {
      result = { "error": error }
      logger.error('Error sending payload: ' + error);
    }

    res.send(result);
  })


  const generateWLEDJson = (data) => {
    return {
      on: data.on || false,
      bri: data.brightness || 128,
      transition: data.transition || 0,
      seg: [{
        id: data.id || 0,
        col: [data.color?.replace('#', '') || "ffffff"],
        fx: data.effect || 0,
        sx: data.speed || 128,
        ix: data.intensity || 128,
        pal: data.palette || 0
      }]
    };
  }

}
