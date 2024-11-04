import {
  LoadFont,
  LoadInter400,
  LoadInter700,
  LoadSilkscreen,
  LoadInter900,
  LoadMunro,
  LoadCherryBomb,
  LoadJostMedium,
  LoadJostRegular,
  LoadInter100,
  LoadInter200,
  LoadInter300,
  LoadInter500,
  LoadInter600,
  LoadInter800
} from "./next/LoadFont";

export const FontsLoader = () => (
  <>
    <LoadFont woff2File="/public/fonts/roboto-regular.woff2" cssFile="/public/fonts/roboto-regular.css" />
    <LoadInter200 />
    <LoadInter300 />
    <LoadInter400 />
    <LoadInter500 />
    <LoadInter600 />
    <LoadInter700 />
    <LoadInter800 />
    <LoadInter900 />
    <LoadSilkscreen />
    <LoadMunro />
    <LoadCherryBomb />
    <LoadJostMedium />
    <LoadJostRegular />
  </>
)