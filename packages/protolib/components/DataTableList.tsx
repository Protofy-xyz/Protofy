import { Checkbox, Popover, Stack, Theme, XStack, YStack, Text } from "tamagui"
import { AlertDialog, API } from 'protolib'
import { useContext, useState } from "react";
import { DataViewContext } from "./DataView";
import { DataTable2 } from "./DataTable2";
import { Tinted } from "./Tinted";
import { CheckCheck, Check, MoreVertical, Trash2 } from '@tamagui/lucide-icons'
import React from "react";
import Scrollbars from "react-custom-scrollbars-2";
import { ItemMenu } from "./ItemMenu";


export const DataTableList = ({sourceUrl, onDelete=()=>{}}) => {
    const { items, model, selected, setSelected, state, push, replace, mergePush, tableColumns, rowIcon, onSelectItem } = useContext(DataViewContext);
    const conditionalRowStyles = [
        {
            when: row => selected.includes(model.load(row).getId()),
            style: {
                backgroundColor: 'var(--color4)'
            },
            '&:hover': {
                backgroundColor: 'var(--color4)'
            }
        },
    ];

    const elementObj = model.load({})
    const fields = elementObj.getObjectSchema().isDisplay('table')

    const validTypes = ['ZodString', 'ZodNumber', 'ZodBoolean']
    const cols = tableColumns ?? DataTable2.columns(...(Object.keys(fields.shape).filter(key => validTypes.includes(fields.shape[key]._def?.typeName)).map(key => DataTable2.column(fields.shape[key]._def?.label ?? key, key, true))))
    const finalColumns = rowIcon ? [DataTable2.column("", "", false, row => <Stack o={0.6}>{React.createElement(rowIcon, { size: "$1" })}</Stack>, true, '50px'), ...cols] : cols

    return <Scrollbars universal={true}>
        <XStack pt="$1" flexWrap='wrap'>
            <Tinted>
                <DataTable2.component
                    pagination={true}
                    conditionalRowStyles={conditionalRowStyles}
                    rowsPerPage={state.itemsPerPage}
                    handleSort={(column, orderDirection) => mergePush({ orderBy: column.selector, orderDirection })}
                    handlePerRowsChange={(itemsPerPage) => push('itemsPerPage', itemsPerPage)}
                    handlePageChange={(page) => push('page', parseInt(page, 10) - 1)}
                    currentPage={parseInt(state.page, 10) + 1}
                    totalRows={items?.data?.total}
                    columns={[DataTable2.column(
                        <Theme reset><Stack ml="$3" o={0.8}>
                            <Checkbox focusStyle={{ outlineWidth: 0 }} checked={selected.length > 1} onPress={(e) => {

                                if (selected.length) {
                                    setSelected([])
                                } else {
                                    console.log('selection all: ', items?.data?.items.map(x => model.load(x).getId()))
                                    setSelected(items?.data?.items.map(x => model.load(x).getId()))
                                }
                            }}>
                                <Checkbox.Indicator>
                                    <CheckCheck />
                                </Checkbox.Indicator>
                            </Checkbox>
                        </Stack></Theme>, "", false, row => <Theme reset><XStack ml="$3" o={0.8}>
                            <Stack mt={"$2"}>
                                <Checkbox focusStyle={{ outlineWidth: 0 }} onPress={() => {
                                    const id = model.load(row).getId()
                                    setSelected(selected.indexOf(id) != -1 ? selected.filter((ele) => ele !== id) : [...selected, id])
                                }} checked={selected.includes(model.load(row).getId())}>
                                    <Checkbox.Indicator>
                                        <Check />
                                    </Checkbox.Indicator>
                                </Checkbox>
                            </Stack>
                            <ItemMenu sourceUrl={sourceUrl+"/"+model.load(row).getId()} onDelete={onDelete}/>
                        </XStack></Theme>, true, '85px'), ...finalColumns]}
                    rows={items?.data?.items}
                    onRowPress={(rowData) => onSelectItem ? onSelectItem(model.load(rowData)) : replace('item', model.load(rowData).getId())}
                />
            </Tinted>
        </XStack>
    </Scrollbars>
}
