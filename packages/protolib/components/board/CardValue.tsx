import { ScrollView, XStack, YStack } from "tamagui";
import { JSONView } from "../JSONView";
import { Markdown } from "../Markdown";

export const CardValue = ({ value, style = {}, id = undefined, mode = undefined }) => {
    let fullHeight = false;
    if(mode === 'markdown') {
        return <ScrollView mt="20px" f={1} width="calc(100% - 20px)" f={1} bg="$bgContent" borderRadius="$3">
            <Markdown readOnly={true} data={value} />
        </ScrollView>
    }
    //check if value is string, number or boolean
    if (typeof value !== 'string' && typeof value !== 'number' && typeof value !== 'boolean') {
        return <ScrollView mt="20px" width="calc(100% - 20px)" f={1} bg="$bgContent" borderRadius="$3">
            <JSONView src={value} />
        </ScrollView>
    }

    if (typeof value === 'string' && value.length > 100 || value.includes("\n")) {
        return <XStack mt="20px" width="calc(100% - 20px)" f={1}><textarea
            className="no-drag"
            style={{
                backgroundColor: "var(--gray1)",
                flex: 1,
                padding: "5px 10px",
                border: "0.5px solid var(--gray7)",
                borderRadius: "8px",
                boxSizing: "border-box",
                resize: "none" // o "none" si no quieres que pueda cambiar el tamaño
            }}
            value={value}
            readOnly

            rows={10} // Número de filas iniciales
        /></XStack>
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