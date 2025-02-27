import { API } from "protobase";

export const fetchURLList = async (urls) => {
  urls.forEach(async (url) => {
    await API.get(url);
  });
}
