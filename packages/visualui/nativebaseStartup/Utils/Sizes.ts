import { Dimensions } from "react-native";
const { width, height } = Dimensions.get("window");

//Guideline sizes are based on standard ~5" screen mobile device
const guidelineBaseWidth = 390;
const guidelineBaseHeight = 844;

const hs = (size: number) => {
  return (width / guidelineBaseWidth) * size;
};
const vs = (size: number) => {
  return (height / guidelineBaseHeight) * size;
};
const moderateScale = (size: number, factor = 0.5) =>
  size + (hs(size) - size) * factor;

export { hs, vs, moderateScale };
