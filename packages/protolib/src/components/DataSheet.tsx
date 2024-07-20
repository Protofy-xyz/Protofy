import { Stack, StackProps } from "tamagui"
import { useLayoutEffect, useRef, useState } from "react";
import { Column, Table2, Cell } from "@blueprintjs/table";
import { HotkeysProvider } from "@blueprintjs/core";
import { Tinted } from "./Tinted";
import { getFieldPreview } from "./DataTableList";
import { useThemeSetting } from '@tamagui/next-theme'

const validTypes = ['ZodString', 'ZodNumber', 'ZodBoolean', 'ZodDate']
const widthTypes = {
    ZodString: 250,
    ZodNumber: 100,
    ZodBoolean: 100,
    ZodDate: 200
}

export const DataSheet = ({ items, model, sourceUrl, name, lineSelect, sheetProps, onRowSelect, fillWidth, ...props }: any & StackProps) => {
    const containerRef = useRef(null)
    const fields = model.getObjectSchema().isDisplay('sheet')
    const keys = Object.keys(fields.shape)
        .filter(key => {
            const def = fields.shape[key]._def?.innerType?._def ?? fields.shape[key]._def

            if (def?.typeName === 'ZodArray') {
                return validTypes.includes(def?.type?._def?.typeName)
            }
            return validTypes.includes(def?.typeName)
        })

    const columnsArr = keys.map(key => {
        const def = fields.shape[key]._def?.innerType?._def ?? fields.shape[key]._def
        return { type: def.typeName, width: def.columnWidth, key: key, def: def }
    })
    console.log("Columns", columnsArr)

    const [selectedRegions, setSelectedRegions] = useState([]);

    const [columnWidths, setColumnWidths] = useState(columnsArr.map(element => element.width ?? widthTypes[element.type] ?? 200))
    const [manualColumnWidths, setManualColumnWidths] = useState({})
    const [multiplier, setMultiplier] = useState(0)

    const columns = columnsArr.reduce((acc, element) => {
        return { ...acc, [element.key]: element }
    }, {})

    const { resolvedTheme } = useThemeSetting()

    useLayoutEffect(() => {
        //setup resize observer
        const resizeObserver = new ResizeObserver(() => {
            if(fillWidth) {
                const totalWidth = columnWidths.reduce((acc, width) => acc + width, 0)
                const availWidth = containerRef.current.offsetWidth - 32
                if(totalWidth < availWidth) {
                    //get the value for multiplier, so totalWidth * multiplier = availWidth
                    setMultiplier(availWidth / totalWidth)
                } else {
                    setMultiplier(1)
                }
            }
        })
        resizeObserver.observe(containerRef.current)
        return () => {
            resizeObserver.disconnect()
        }
    }, [])

    return <Stack ref={containerRef} flex={1} {...props}>
        <HotkeysProvider>
            <Tinted>
                {multiplier && <Table2
                    className={resolvedTheme == 'dark' ? "bp5-dark": ""}
                    cellRendererDependencies={[items]}
                    selectedRegions={selectedRegions}
                    onSelection={(regions) => {
                        if (!lineSelect) {
                            setSelectedRegions(regions)
                        } else {
                            if(!regions[0].rows) return

                            setSelectedRegions([{
                                rows: regions[0].rows,
                                cols: [0, keys.length - 1]
                            }])

                            onRowSelect(model.load(items[regions[0].rows[0]]))
                        }
                    }}

                    enableMultipleSelection={!lineSelect}
                    columnWidths={columnWidths.reduce((acc, width, i) => [...acc, manualColumnWidths[i] ??  width * multiplier], [])}
                    onColumnWidthChanged={(index, size) => {
                        const newColumnsWidth = columnWidths.map((width, i) => i === index ? size : width)
                        setColumnWidths(newColumnsWidth)
                        setManualColumnWidths({ ...manualColumnWidths, [index]: size })
                    }}
                    numRows={items.length}
                    {...sheetProps}
                >

                    {keys.map((key, index) => {
                        return <Column key={index} name={key} cellRenderer={(rowIndex) => <Cell > {getFieldPreview(key, items[rowIndex], columns[key].def, true)}</Cell>} />
                    })}

                </Table2>}
            </Tinted>

        </HotkeysProvider>

    </Stack>
}
