import axios from "axios";

let chatWithModelBusy = false;
export const chatWithModel = async (prompt, model, modelParams={}, url='http://localhost:1234/v1/chat/completions') => {
  if (chatWithModelBusy) {
    // console.log("Busy, skipping execution");
    return;
  }
  chatWithModelBusy = true;;

  const data = {
    model: model,
    messages: [{ role: "user", content: prompt }],
    temperature: 0,
    max_tokens: -1,
    top_k: 1,
    top_p: 1,
    stream: false,
    ...modelParams
  };

  try {
    const response = await axios.post(url, data, {
      headers: { "Content-Type": "application/json" },
    });
    return response.data;
  } catch (error) {
    console.error("Error:", error);
    return null;
  } finally {
    chatWithModelBusy = false;
  }
};