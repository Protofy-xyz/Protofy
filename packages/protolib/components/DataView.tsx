import { YStack, XStack, Paragraph, Text, Button, Stack, ScrollView, Spacer, ButtonProps, Tooltip, Spinner, useMedia, H3, TextArea } from '@my/ui'
import { Center } from './Center';
import { useRemoteStateList } from '../lib/useRemoteState';
import { AlertDialog } from './AlertDialog';
import { API, z, getPendingResult, PendingResult } from 'protobase';
import { Tinted } from './Tinted';
import { EditableObjectProps } from './EditableObject/types';
import { AsyncView } from './AsyncView';
import { Notice } from './Notice';
import { ActiveGroup } from './ActiveGroup';
import { ActiveGroupButton } from './ActiveGroupButton';
import { ButtonGroup } from './ButtonGroup';
import { forwardRef, useContext, useEffect, useMemo, useState } from 'react'
import { Plus, LayoutGrid, List, Layers, X, ChevronLeft, ChevronRight, MapPin, Pencil, Eye, Sheet, Columns3, Search, Trash } from '@tamagui/lucide-icons'
import { getErrorMessage, useToastController } from '@my/ui'
import { useTimeout, useUpdateEffect } from 'usehooks-ts';
import { usePageParams, useQueryState } from '../next'
import React from 'react';
import ActiveRender from "./ActiveRender"
import { IconContainer } from './IconContainer';
import { SearchContext } from '../context/SearchContext';
import { InteractiveIcon } from './InteractiveIcon';
import { ItemMenu } from './ItemMenu';
import ErrorMessage from './ErrorMessage';
import { Filters, QueryFilters } from './Filters';
import dynamic from 'next/dynamic'
import { SearchAIModalButton } from './SearchAIModalButton';
import { useThemeSetting } from '@tamagui/next-theme'
import { Monaco } from './Monaco';

const FileWidget = dynamic<any>(() =>
    import('../adminpanel/features/components/FilesWidget').then(module => module.FileWidget),
    { loading: () => <Tinted><Center><Spinner size='small' color="$color7" scale={4} /></Center></Tinted> }
);

//uncomment to enable datasheet view (excel like)
// const DataSheet = dynamic<any>(() =>
//     import('./DataSheet').then(module => module.DataSheet),
//     { ssr: false, loading:() => <Tinted><Center><Spinner size='small' color="$color7" scale={4} /></Center></Tinted>}
// );

const DataTableList = dynamic<any>(() =>
    import('./DataTableList').then(module => module.DataTableList),
    { ssr: false, loading: () => <Tinted><Center><Spinner size='small' color="$color7" scale={4} /></Center></Tinted> }
);

const ObjectGrid = dynamic<any>(() =>
    import('./ObjectGrid').then(module => module.ObjectGrid),
    { ssr: false, loading: () => <Tinted><Center><Spinner size='small' color="$color7" scale={4} /></Center></Tinted> }
);

const DataTableCard = dynamic<any>(() =>
    import('./DataTableCard').then(module => module.DataTableCard),
    { ssr: false, loading: () => <Tinted><Center><Spinner size='small' color="$color7" scale={4} /></Center></Tinted> }
);

const EditableObject = dynamic<any>(() =>
    import('./EditableObject').then(module => module.EditableObject),
    { ssr: false, loading: () => <Tinted><Center><Spinner size='small' color="$color7" scale={4} /></Center></Tinted> }
);

const MapView = dynamic<any>(() =>
    import('./MapView').then(module => module.MapView),
    { ssr: false, loading: () => <Tinted><Center><Spinner size='small' color="$color7" scale={4} /></Center></Tinted> }
);

const SequenceView = dynamic<any>(() =>
    import('./SequenceView').then(module => module.SequenceView),
    { ssr: false, loading: () => <Tinted><Center><Spinner size='small' color="$color7" scale={4} /></Center></Tinted> }
);

interface DataViewProps {
    onSelectItem?: (item: any) => void;
    itemData?: any;
    rowIcon?: any;
    disableViewSelector?: boolean;
    disableItemSelection?: boolean;
    initialItems?: any;
    sourceUrl?: string;
    sourceUrlParams?: any;
    numColumnsForm?: number;
    name?: string;
    entityName?: string;
    pluralName?: string;
    hideAdd?: boolean;
    hideFilters?: boolean;
    enableAddToInitialData?: boolean;
    pageState?: any;
    icons?: any;
    model?: any;
    extraFields?: any;
    columns?: any;
    onEdit?: (data: any) => any;
    onDelete?: (data: any) => any;
    onAdd?: (data: any) => any;
    onDataAvailable?: (total, currentItems) => any,
    views?: any;
    extraViews?: any[];
    openMode?: 'edit' | 'view';
    disableToggleMode?: any;
    customFields?: any;
    customFilters?: any;
    extraFilters?: any[];
    dataTableRawProps?: any;
    dataTableListProps?: any;
    dataTableGridProps?: any;
    dataTableSheetProps?: any;
    dataMapProps?: any;
    dataSequenceProps?: any;
    extraFieldsForms?: any;
    extraFieldsFormsEdit?: any;
    extraFieldsFormsAdd?: any;
    customFieldsForms?: any;
    defaultView?: string;
    disableViews?: Array<"list" | "sheet" | "grid" | "raw" | "map" | string>;
    toolBarContent?: any;
    onAddButton?: any;
    extraMenuActions?: any[];
    extraActions?: any[];
    deleteable?: (x) => boolean;
    objectProps?: EditableObjectProps | {};
    refreshOnHotReload?: boolean;
    quickRefresh?: boolean;
    URLTransform?: (url: string) => string;
    disableNotifications?: boolean;
    hideSearch?: boolean;
    hideDeleteAll?: boolean;
    hidePagination?: boolean;
    title?: React.ReactNode | undefined;
    createElement?: (data: any) => Promise<any>;
    addOpened?: boolean;
    setAddOpened?: (opened: boolean) => void;
}

export const DataView = (props: DataViewProps & { ready?: boolean }) => {
    return <AsyncView ready={props.ready ?? true}>
        <DataViewInternal {...props} />
    </AsyncView>
}

type DataViewActionButtonProps = {
    onPress?: () => void
    icon: any
    description?: string
    id?: string
}

const RawAddPanel = ({ displayName, onSave }) => {
    const { resolvedTheme } = useThemeSetting()
    const [sourceCode, setSourceCode] = useState('');
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<PendingResult | undefined>(undefined)

    const monacoEditor = useMemo(() => {
        return <Monaco
            path={'add.json'}
            darkMode={resolvedTheme === 'dark'}
            sourceCode={sourceCode}
            onChange={setSourceCode}
            options={{
                lineDecorationsWidth: 5,
                lineNumbersMinChars: 0,
                minimap: { enabled: false }
            }}
        />

    }, [resolvedTheme]);
    return <YStack width="700px" height="60vh">
        <XStack id="eo-dlg-title">{<H3><Tinted><H3 color="$color9">Add</H3></Tinted>{` ${displayName}`}</H3>}</XStack>
        {monacoEditor}
        <Button f={1} onPress={async () => {
            try {
                let data = JSON.parse(sourceCode)
                setLoading(true)
                await onSave(data)
                setLoading(false)
            } catch (e) {
                setError(e)
                console.log('e: ', e)
            }

        }}>
            {loading ? <Spinner /> : 'Save'}
        </Button>
    </YStack>
}

export const DataViewActionButton = ({ icon, description, id, ...props }: DataViewActionButtonProps & ButtonProps) => {
    const Icon = icon
    return <Tooltip {...props}>
        <Tooltip.Trigger>
            <Button id={id ?? ''} hoverStyle={{ o: 1 }} o={0.7} circular chromeless={true} {...props} >
                <Icon color={"$color10"} />
            </Button>
        </Tooltip.Trigger>
        <Tooltip.Content
            enterStyle={{ x: 0, y: -5, opacity: 0, scale: 0.9 }}
            exitStyle={{ x: 0, y: -5, opacity: 0, scale: 0.9 }}
            scale={1}
            x={0}
            y={0}
            opacity={1}
            //@ts-ignore
            animation={[
                'quick',
                {
                    opacity: {
                        overshootClamping: true,
                    },
                },
            ]}
        >
            <Tooltip.Arrow />
            <Paragraph size="$2" lineHeight="$1">
                {description}
            </Paragraph>
        </Tooltip.Content>
    </Tooltip>
}

const DataViewInternal = forwardRef(({
    onSelectItem,
    itemData,
    rowIcon,
    disableViewSelector = false,
    disableItemSelection = false,
    initialItems,
    sourceUrl,
    sourceUrlParams = {},
    numColumnsForm = 1,
    name,
    entityName,
    pluralName,
    hideAdd = false,
    hideFilters = true,
    enableAddToInitialData = false,
    pageState,
    icons = {},
    model,
    extraFields = {},
    columns,
    onEdit = (data) => data,
    onDelete = (data) => data,
    onAdd = (data) => data,
    onDataAvailable = (total, currentItems) => { },
    views = undefined,
    extraViews = [],
    openMode = 'edit',
    disableToggleMode,
    customFields = {},
    customFilters = {},
    extraFilters = [],
    dataTableRawProps = {},
    dataTableListProps = {},
    dataTableGridProps = {},
    dataTableSheetProps = {},
    dataMapProps = {},
    dataSequenceProps = {},
    extraFieldsForms = {},
    extraFieldsFormsEdit = {},
    extraFieldsFormsAdd = {},
    customFieldsForms = {},
    defaultView = 'list',
    disableViews = [],
    toolBarContent = null,
    onAddButton = undefined,
    extraMenuActions = [],
    extraActions = [],
    deleteable = () => { return true },
    objectProps = {},
    refreshOnHotReload = false,
    quickRefresh = false,
    URLTransform = (url) => url,
    disableNotifications = false,
    hideSearch = false,
    hideDeleteAll = false,
    hidePagination = false,
    title = undefined,
    createElement = undefined,
    addOpened = undefined,
    setAddOpened = undefined
}: DataViewProps, ref: any) => {

    const displayName = (entityName ?? pluralName) ?? name
    const [state, setState] = useState(pageState ?? {})
    sourceUrl = URLTransform(sourceUrl)

    const fetch = async (fn) => {
        setSearchStatus('loading')
        const data = await API.get({ url: sourceUrl, ...sourceUrlParams, ...state })
        fn(data)
        setSearchStatus(undefined)
    }

    const [_items, setItems] = useRemoteStateList(initialItems, fetch, 'notifications/' + model.getModelName() + "/#", model, quickRefresh, disableNotifications);
    const items: any = _items
    const [currentItems, setCurrentItems] = useState<PendingResult | undefined>(initialItems ?? getPendingResult('pending'))
    const [createOpen, setCreateOpen] = useState(addOpened ?? false)
    const [deleteOpen, setDeleteOpen] = useState(false)
    const { push, mergePush, removePush, replace } = usePageParams(state)
    const [selected, setSelected] = useState([])
    const [currentItemData, setCurrentItemData] = useState(itemData)
    const { search, setSearch, setSearchName, setSearchStatus } = useContext(SearchContext)
    const hasGlobalMenu = extraMenuActions && extraMenuActions.some(action => action.menus && action.menus.includes("global"));
    const filters = Object.entries(state).filter((st) => st[0].startsWith('filter'))
    const extraFiltersKeys = extraFilters.map((f) => f.queryParam)
    const extraFiltersStates = Object.entries(state).filter((st) => extraFiltersKeys.includes(st[0]))

    const isXs = useMedia().xs

    useUpdateEffect(() => {
        if(addOpened !== undefined) {
            setCreateOpen(addOpened)
        }
    }, [addOpened])

    useQueryState(setState)

    useEffect(() => {
        if (refreshOnHotReload && process.env.NODE_ENV === 'development' && module['hot']) {
            module['hot'].addStatusHandler(status => {
                if (status === 'ready') {
                    document.location.reload()
                }
            });
        }
    }, []);

    useEffect(() => {
        if (items && items.isLoaded) {
            onDataAvailable(items.data?.total, items.data?.items)
            setCurrentItems(items)
        }
    }, [items])

    useUpdateEffect(() => {
        if (search) {
            mergePush({
                search: search,
                page: 0
            })
        } else {
            removePush("search")
        }
    }, [search])

    useEffect(() => {
        setSearchName(displayName)
    })

    useUpdateEffect(() => {
        fetch(setItems)
    }, [state.orderBy + '_' + state.itemsPerPage + '_' + state.page + '_' + state.search + '_' + state.orderDirection + '_' + filters + '_' + extraFiltersStates])

    const toast = useToastController()
    const RowIcon = rowIcon
    var defaultViews = [
        {
            name: 'list',
            icon: List,
            component: DataTableList,
            props: {
                sourceUrl,
                onDelete: async (_sourceUrl) => {
                    if (Array.isArray(selected) && selected.length && sourceUrl) {
                        const deletePromises = selected.map(ele => API.get(`${sourceUrl}/${model.load(ele).getId()}/delete`));
                        await Promise.all(deletePromises);
                        setSelected([]);
                    } else if (sourceUrl) {
                        await API.get(`${_sourceUrl}/delete`);
                    }
                    onDelete({ sourceUrl: _sourceUrl, selected })
                },
                onSelectItem: onSelectItem ? onSelectItem : (item) => replace('item', item.getId()),
                deleteable,
                enableAddToInitialData,
                extraMenuActions,
                items,
                model,
                selected,
                setSelected,
                rowIcon: openMode == "edit" ? Pencil : Eye,
                columns,
                state,
                disableItemSelection,
                ...dataTableListProps
            }
        },
        //uncomment to enable datasheet view (excel like)
        // {
        //     name: 'sheet',
        //     icon: Sheet,
        //     component: DataSheet,
        //     props: {
        //         model,
        //         items: items?.data?.items,
        //         sourceUrl,
        //         name,
        //         mt: "$2",
        //         mx: "$4",
        //         disableItemSelection,
        //         lineSelect: true,
        //         fillWidth: true,
        //         onRowSelect: onSelectItem ? onSelectItem : (item) => replace('item', item.getId()),
        //         ...dataTableSheetProps
        //     }
        // },
        {
            name: 'grid',
            icon: LayoutGrid,
            component: ObjectGrid,
            props: {
                mt: "$8",
                model,
                items: items?.data?.items,
                sourceUrl,
                customFields,
                extraFields,
                icons,
                ml: "$5",
                deleteable: deleteable,
                onDelete: async (sourceUrl) => {
                    await API.get(sourceUrl + '/delete')
                    onDelete({ sourceUrl, selected })
                },
                onSelectItem: onSelectItem ? onSelectItem : (item) => replace('item', item.getId()),
                extraMenuActions: extraMenuActions,
                itemMinHeight: 320,
                itemMinWidth: 320,
                emptyMessage: <ErrorMessage
                    icon={RowIcon}
                    msg={`Empty ${displayName} list`}
                    detailsColor='$color'
                    containerProps={{ mt: '-30%', o: 0.1 }}
                    iconProps={{}}
                >
                    {/* <XStack o={0.5} space="$1" ai="center">
                        <Button>{`Add ${name}`}</Button>
                    </XStack> */}
                </ErrorMessage>,
                spacing: 20,
                name,
                icon: rowIcon,
                disableItemSelection,
                ...dataTableGridProps
            }
        },
        {
            name: 'raw',
            icon: Layers,
            component: DataTableCard,
            props: {
                mt: "$8",
                items,
                model,
                onDelete: async (key) => {
                    await API.get(`${sourceUrl}/${key}/delete`);
                    onDelete({ sourceUrl, selected, key })
                },
                onSave: async (value, element) => {
                    // console.log("Saving: ", {value,element, sourceUrl})
                    const id = element.getId()
                    const result = await API.post(sourceUrl + '/' + id, value)
                    if (result.isError) {
                        throw result.error
                    }
                    const { item, ...rest } = state;
                    setState(rest)
                    toast.show(name + ' updated', {
                        message: "Saved new settings for: " + id
                    })
                },
                disableItemSelection,
                ...dataTableRawProps
            }
        }
    ]

    const mapView = {
        name: 'map',
        icon: MapPin,
        component: MapView,
        props: {
            mt: "$3",
            onDelete: async (key) => {
                await API.get(`${sourceUrl}/${key}/delete`);
            },
            items,
            model,
            sourceUrl,
            extraFields,
            icons,
            customFields,
            deleteable,
            extraMenuActions,
            disableItemSelection,
            ...dataMapProps
        }
    }

    const sequenceView = {
        name: 'sequence',
        icon: Columns3,
        component: SequenceView,
        props: {
            onStageChange: async (ele) => {
                const id = ele.getId()
                const result = await API.post(sourceUrl + '/' + id, onEdit(ele.getData()))
                if (result.isError) {
                    throw result.error
                }
                const { item, ...rest } = state;
                setState(rest)
                toast.show(name + ' updated', {
                    message: "Saved new settings for: " + id
                })
            },
            onSelectItem: onSelectItem ? onSelectItem : (item) => replace('item', item.getId()),
            items,
            sourceUrl,
            model,
            ...dataSequenceProps
        }
    }

    const locationProps = model.getObjectSchema().is('location')
    const sequenceField = model.getSequeceField()

    if (locationProps.getFields().length) {
        defaultViews = [...defaultViews, mapView]
    }
    if (sequenceField) {
        defaultViews = [...defaultViews, sequenceView]
    }

    const tableViews = (views ?? [...defaultViews, ...extraViews]).filter(v => !disableViews.includes(v.name))

    const activeViewIndex = tableViews.findIndex(v => v.name == state.view) != -1 ? tableViews.findIndex(v => v.name == state.view) : tableViews.findIndex(v => v.name == defaultView)

    const getFilenameFromPath = (path) => {
        const parts = path.split('/');
        return parts.pop();
    }

    const totalPages = currentItems && currentItems.isLoaded ? Math.ceil(currentItems.data?.total / currentItems.data?.itemsPerPage) : 0
    if (items && items.isError) {
        return <Center>
            Error: {items.error && items.error.error ? items.error.error : items.error}
        </Center>
    }

    const realActiveView = activeViewIndex == -1 ? 0 : activeViewIndex

    return (<AsyncView atom={currentItems}>
        <YStack ref={ref} height="100%" f={1}>
            <ActiveGroup initialState={realActiveView}>
                {
                    state.editFile && <FileWidget
                        id={"file-widget-" + getFilenameFromPath(state.editFile ?? '').split('.')[0]}
                        hideCloseIcon={false}
                        isModified={true}
                        setIsModified={() => { }}
                        icons={[
                            <IconContainer onPress={() => {
                                removePush('editFile')
                            }}>
                                <X color="var(--color)" size={"$1"} />
                            </IconContainer>
                        ]}
                        currentFileName={getFilenameFromPath(state.editFile ?? '')}
                        currentFile={state.editFile}
                    />
                }
                <AlertDialog
                    integratedChat
                    p={"$2"}
                    pt="$5"
                    pl="$5"
                    setOpen={(v) => {
                        setCreateOpen(v);
                        if (setAddOpened) {
                            setAddOpened(v);
                        }
                    }}
                    open={createOpen}
                    hideAccept={true}
                    description={""}
                >
                    <YStack f={1} jc="center" ai="center" id={"admin-dataview-create-dlg"}>
                        <ScrollView maxHeight={"90vh"}>
                            <XStack mr="$4">
                                {/* @ts-ignore */}
                                {tableViews[realActiveView]?.name != 'raw' ? <EditableObject
                                    URLTransform={URLTransform}
                                    id={"admin-eo"}
                                    name={name}
                                    numColumns={numColumnsForm}
                                    mode={'add'}
                                    onSave={async (originalData, data) => {
                                        console.log('Saving from editable object: ', data)
                                        try {
                                            const obj = model.load(data)
                                            let result;
                                            if (createElement) {
                                                result = await createElement(obj.create().getData())
                                            } else {
                                                result = await API.post(sourceUrl, onAdd(obj.create().getData()))
                                                if (result.isError) {
                                                    throw result.error
                                                }
                                            }
                                            //fetch(setItems)
                                            setCreateOpen(false);
                                            if(setAddOpened) {
                                                setAddOpened(false);
                                            }
                                            toast.show(name + ' created', {
                                                message: obj.getId()
                                            })
                                        } catch (e) {
                                            throw getPendingResult('error', null, e instanceof z.ZodError ? e.flatten() : e)
                                        }
                                    }}
                                    model={model}
                                    extraFields={{ ...extraFields, ...extraFieldsForms, ...extraFieldsFormsAdd }}
                                    icons={icons}
                                    customFields={{ ...customFields, ...customFieldsForms }}
                                    {...objectProps}
                                /> : <RawAddPanel displayName={displayName} onSave={async (data) => {
                                    console.log('Saving from editable object: ', data)
                                    try {
                                        const obj = model.load(data)

                                        let result;
                                        if (createElement) {
                                            result = await createElement(obj.create().getData())
                                        } else {
                                            result = await API.post(sourceUrl, onAdd(obj.create().getData()))
                                            if (result.isError) {
                                                throw result.error
                                            }
                                        }

                                        //fetch(setItems)
                                        setCreateOpen(false);
                                        toast.show(name + ' created', {
                                            message: obj.getId()
                                        })
                                    } catch (e) {
                                        throw getPendingResult('error', null, e instanceof z.ZodError ? e.flatten() : e)
                                    }
                                }} />}
                            </XStack>
                        </ScrollView>
                    </YStack>
                </AlertDialog>
                <AlertDialog
                    integratedChat
                    disableAdapt
                    p={"$1"}
                    pt="$5"
                    pl="$5"
                    hideAccept={true}
                    acceptCaption="Save"
                    setOpen={(s) => {
                        setCurrentItemData(undefined);
                        removePush('item')
                    }}
                    open={state.item}
                    description={""}
                    dialogCloseProps={isXs ? {
                        asChild: true,
                        children: <Button
                            position="absolute"
                            top="$4"
                            right="$4"
                            size="$3"
                            circular
                            icon={X}
                        />
                    } : {}}
                //bc={resolvedTheme == 'dark' ? "$background": "$color1"}
                >
                    <YStack f={1} jc="center" ai="center">
                        <ScrollView maxHeight={"90vh"}>
                            <Stack mr="$5">
                                <EditableObject
                                    disableToggleMode={disableToggleMode}
                                    initialData={currentItemData}
                                    name={name}
                                    spinnerSize={75}
                                    loadingText={<YStack ai="center" jc="center">Loading data for {name}<Paragraph fontWeight={"bold"}>{state.item}</Paragraph></YStack>}
                                    objectId={state.item}
                                    sourceUrl={sourceUrl + '/' + state.item}
                                    numColumns={numColumnsForm}
                                    mode={openMode}
                                    onSave={async (original, data) => {
                                        try {
                                            setCurrentItemData(undefined)
                                            const id = model.load(data).getId()
                                            const result = await API.post(sourceUrl + '/' + id, onEdit(model.load(original).update(model.load(data)).getData()))
                                            if (result.isError) {
                                                throw result.error
                                            }
                                            //fetch(setItems)
                                            const { item, ...rest } = state;
                                            setState(rest)
                                            toast.show(name + ' updated', {
                                                message: "Saved new settings for: " + id
                                            })
                                            removePush('item')
                                        } catch (e) {
                                            throw getPendingResult('error', null, e instanceof z.ZodError ? e.flatten() : e)
                                        }
                                    }}
                                    model={model}
                                    extraFields={{ ...extraFields, ...extraFieldsForms, ...extraFieldsFormsEdit }}
                                    icons={icons}
                                    customFields={{ ...customFields, ...customFieldsForms }}
                                    {...objectProps}
                                />
                            </Stack>
                        </ScrollView>
                    </YStack>
                </AlertDialog>
                <AlertDialog
                    acceptCaption="Delete all"
                    setOpen={setDeleteOpen}
                    open={deleteOpen}
                    onAccept={async (setOpen) => {
                        await API.get('/api/core/v1/databases/' + name + '/delete')
                        document.location.reload()
                    }}
                    title={'Delete'}
                    description={"This action will delete all data from your database. Are you sure you want to continue?"}
                    w={400}
                >
                    <YStack f={1} jc="center" ai="center">

                    </YStack>
                </AlertDialog>
                {!state.editFile && <>
                    <XStack pt="$3" px="$3" mb="$1">
                        <XStack ml="$2" f={1} ai="center" gap="$2">
                            <Paragraph>
                                {title ?? <Text fontSize="$9" fontWeight="600" color="$color11">{displayName.charAt(0).toUpperCase() + displayName.slice(1)}</Text>}
                            </Paragraph>
                            {rowIcon && <Stack mr="$3"><Tinted><RowIcon color='var(--color7)' size={26} /></Tinted></Stack>}
                            {hasGlobalMenu ? <Tinted><ItemMenu type={"global"} sourceUrl='' hideDeleteButton={true} element="" extraMenuActions={extraMenuActions}></ItemMenu></Tinted> : <></>}
                            {!isXs && toolBarContent}
                        </XStack>

                        <XStack ai="center" ml="$2">
                            {!hidePagination && <XStack ai="center">
                                {currentItems.isLoaded && <XStack>
                                    <XStack ai="center">
                                        <XStack ai="center">
                                            <Text fontSize={14} color="$color11">{(currentItems.data.itemsPerPage * currentItems.data.page) + 1}-{Math.min(currentItems.data.total, (currentItems.data.itemsPerPage * (currentItems.data.page + 1)))} of {currentItems.data.total}</Text>
                                        </XStack>
                                        <Tinted>
                                            <InteractiveIcon
                                                Icon={ChevronLeft}
                                                onPress={(e) => {
                                                    e.stopPropagation();
                                                    if (currentItems.data.page > 0) {
                                                        push("page", currentItems.data.page - 1);
                                                    }
                                                }} ml={"$3"}
                                                disabled={!(currentItems.data.page > 0)} />
                                            <Spacer size="$3" />
                                            <InteractiveIcon
                                                Icon={ChevronRight}
                                                onPress={(e) => {
                                                    e.stopPropagation();
                                                    if (currentItems.data.page < totalPages - 1) {
                                                        push("page", currentItems.data.page + 1);
                                                    }
                                                }}
                                                ml={"$3"}
                                                disabled={!(currentItems.data.page < totalPages - 1)} />
                                        </Tinted>
                                    </XStack>
                                </XStack>}
                            </XStack>}
                            <XStack ai="center" marginLeft="$3" mb={"$1"} $xs={{ display: 'none' }}>
                                {!hideSearch && <SearchAIModalButton
                                    placeholder={"Search in " + name}
                                    initialState={search}
                                    defaultOpened={true}
                                    onSearch={setSearch}
                                    trigger={
                                        <DataViewActionButton
                                            id="admin-dataview-add-btn"
                                            icon={Search}
                                            description={`Search in ${name}`}
                                        />
                                    }
                                />}
                                {!hideFilters && <Filters
                                    customFilters={customFilters}
                                    model={model}
                                    state={state}
                                    extraFilters={extraFilters}
                                />}
                                {extraActions && extraActions.map((action, index) => action)}
                                {!hideAdd && <Tinted>
                                    <DataViewActionButton
                                        id="admin-dataview-add-btn"
                                        icon={Plus}
                                        description={`Add ${name}`}
                                        onPress={() => {
                                            onAddButton ? onAddButton() : setCreateOpen(true)
                                        }}
                                    />
                                </Tinted>}
                                {!hideDeleteAll && <Tinted>
                                    <DataViewActionButton
                                        id="admin-dataview-add-btn"
                                        icon={Trash}
                                        description={`Delete all items from ${name}`}
                                        onPress={() => {
                                            setDeleteOpen(true)
                                        }}
                                    />
                                </Tinted>}
                                {!disableViewSelector && <ButtonGroup marginLeft="$3" boc="$gray5">
                                    {
                                        tableViews.map((v, index) => <ActiveGroupButton id={'tableView-' + v.name} key={index} onSetActive={() => push('view', v.name)} activeId={index}>
                                            {React.createElement(v.icon, { size: "$1", strokeWidth: 1 })}
                                        </ActiveGroupButton>)
                                    }
                                </ButtonGroup>}
                            </XStack>
                        </XStack>
                    </XStack>
                    {
                        !hideFilters && <Tinted><XStack px="$4">
                            <QueryFilters state={state} extraFilters={extraFilters} />
                        </XStack></Tinted>
                    }

                    {items && items.isError && (
                        <Notice>
                            <Paragraph>{getErrorMessage(items.error)}</Paragraph>
                        </Notice>
                    )}
                    <Stack f={1}>
                        <AsyncView atom={currentItems}>
                            {
                                tableViews.map((v, index) => <ActiveRender height="100%" key={index} activeId={index}>
                                    {React.createElement(v.component, { ...v.props, currentItems } ?? {})}
                                </ActiveRender>
                                )}
                        </AsyncView>
                    </Stack>
                </>}
            </ActiveGroup>
        </YStack>
    </AsyncView>
    )
})