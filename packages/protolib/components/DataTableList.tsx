import { Checkbox, Stack, Theme, XStack } from "tamagui"
import ActiveRender from "./ActiveRender"
import { useContext } from "react";
import { DataViewContext } from "./DataView";
import { DataTable2 } from "./DataTable2";
import { Tinted } from "./Tinted";
import { CheckCheck, Check } from '@tamagui/lucide-icons'

export const DataTableList = ({ activeId }) => {
    const { items, model, selected, setSelected, state, push, mergePush, tableColumns, onSelectItem } = useContext(DataViewContext);
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
    return <ActiveRender activeId={activeId}>
        <XStack mr="$3" pt="$1" flexWrap='wrap'>
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
                        </Stack></Theme>, "", false, row => <Theme reset><Stack ml="$3" o={0.8}>
                            <Checkbox focusStyle={{ outlineWidth: 0 }} onPress={() => {
                                const id = model.load(row).getId()
                                setSelected(selected.indexOf(id) != -1 ? selected.filter((ele) => ele !== id) : [...selected, id])
                            }} checked={selected.includes(model.load(row).getId())}>
                                <Checkbox.Indicator>
                                    <Check />
                                </Checkbox.Indicator>
                            </Checkbox>
                        </Stack></Theme>, true, '65px'), ...tableColumns]}
                    rows={items?.data?.items}
                    onRowPress={(rowData) => onSelectItem ? onSelectItem(model.load(rowData)) : push('item', model.load(rowData).getId())}
                />
            </Tinted>
        </XStack>
    </ActiveRender>
}
