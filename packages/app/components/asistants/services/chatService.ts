import { ChatMessageType, ModalList, useSettings } from "../store";

const apiUrl = "https://api.openai.com/v1/chat/completions";
const IMAGE_GENERATION_API_URL = "https://api.openai.com/v1/images/generations";
const OPENAI_APIKEY = process.env?.OPENAI_APIKEY;
console.log('OPENAI_APIKEY: ',OPENAI_APIKEY);
export async function fetchResults(
  messages: Omit<ChatMessageType, "id" | "type">[],
  model: string,
  signal: AbortSignal,
  onData: (data: any) => void,
  onCompletion: () => void
) {
  try {
    const response = await fetch(apiUrl, {
      method: `POST`,
      signal: signal,
      headers: {
        "content-type": `application/json`,
        accept: `text/event-stream`,
        Authorization: `Bearer ${OPENAI_APIKEY}`,
      },
      body: JSON.stringify({
        model: useSettings.getState().settings.selectedModal,
        temperature: 0.7,
        stream: true,
        messages: messages,
      }),
    });

    if (response.status !== 200) {
      console.log(response);
      throw new Error("Error fetching results");
    }
    const reader: any = response.body?.getReader();
    while (true) {
      const { done, value } = await reader.read();

      if (done) {
        onCompletion();
        break;
      }

      let chunk = new TextDecoder("utf-8").decode(value, { stream: true });
      const chunks = chunk.split("\n").filter((x: string) => x !== "");

      chunks.forEach((chunk: string) => {
        if (chunk === "data: [DONE]") {
          return;
        }
        if (!chunk.startsWith("data: ")) return;
        chunk = chunk.replace("data: ", "");
        const data = JSON.parse(chunk);
        if (data.choices) {
          if (data.choices[0].finish_reason === "stop") return;
          onData(data.choices[0].delta.content);
        }
        if(data.error) {
          throw new Error(data.error.message);
        }
      });
    }
  } catch (error) {
    console.error(error);
    if (error instanceof DOMException || error instanceof Error) {
      throw new Error(error.message);
    }
  }
}

export type ImageSize =
  | "256x256"
  | "512x512"
  | "1024x1024"
  | "1280x720"
  | "1920x1080"
  | "1024x1024"
  | "1792x1024"
  | "1024x1792";

export type IMAGE_RESPONSE = {
  created_at: string;
  data: IMAGE[];
};
export type IMAGE = {
  url: string;
};
export type DallEImageModel = Extract<ModalList, "dall-e-2" | "dall-e-3">;

export async function generateImage(
  prompt: string,
  size: ImageSize,
  numberOfImages: number
) {
  const selectedModal = useSettings.getState().settings.selectedModal;

  const response = await fetch(IMAGE_GENERATION_API_URL, {
    method: `POST`,
    // signal: signal,
    headers: {
      "content-type": `application/json`,
      accept: `text/event-stream`,
      Authorization: `Bearer ${OPENAI_APIKEY}`,
    },
    body: JSON.stringify({
      model: selectedModal,
      prompt: prompt,
      n: numberOfImages,
      size: useSettings.getState().settings.dalleImageSize[
        selectedModal as DallEImageModel
      ],
    }),
  });
  const body: IMAGE_RESPONSE = await response.json();
  return body;
}
