import { LoadFont } from "./next/LoadFont";

export const FontsLoader = () => (
  <>
     <LoadFont woff2File="/public/fonts/roboto-regular.woff2" cssFile="/public/fonts/roboto-regular.css" />
  </>
)