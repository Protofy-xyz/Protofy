import { API } from "protobase";

export const fetchURLList = async (urls) => {
  for (const url of urls) {
    await API.get(url);
  }
}