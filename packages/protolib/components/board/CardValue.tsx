import { ScrollView, XStack, YStack } from "tamagui";
import { JSONView } from "../JSONView";

export const CardValue = ({ value, style={}, id=undefined }) => {
    let fullHeight = false;
    //check if value is string, number or boolean
    if (typeof value !== 'string' && typeof value !== 'number' && typeof value !== 'boolean') {
        return <ScrollView mt="20px" width="calc(100% - 20px)" f={1} bg="$bgContent" borderRadius="$3">
            <JSONView src={value} />
        </ScrollView>
    }
    return <div id={id} style={{
        height: fullHeight ? '100%' : 'auto',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '30px',
        fontWeight: 'bold',
        marginTop: '15px',
        whiteSpace: 'pre-wrap',
        ...style
    }}>{value}</div>
}