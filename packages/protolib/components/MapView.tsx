import { Stack, StackProps } from "tamagui"
import { useContext, useRef } from "react";
import { DataViewContext } from "./DataView";

export const MapView = ({ ...props }: any & StackProps) => {
    const containerRef = useRef(null)
    const { items, model } = useContext(DataViewContext);


    return <Stack ml={"$5"} ref={containerRef} f={1}{...props}>
      <h1>hello world</h1>
    </Stack>
}
