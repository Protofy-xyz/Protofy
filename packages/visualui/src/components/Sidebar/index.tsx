import React from "react";
import { Element, useEditor } from "@craftjs/core";
import PageMenu from "./PageMenu";
import { getIcon } from "../../utils/craftComponent";
import Icon from '../Icon';
import { Search, X } from 'lucide-react';

export type SidebarProps = {
    palettes: any,
    sendMessage: Function,
    currentPage: string
};

export const Sidebar = ({
    palettes,
    sendMessage,
    currentPage
}: SidebarProps) => {
    const viewRef = React.useRef(null)
    const [searchValue, setSearchValue] = React.useState('')
    const { connectors, query } = useEditor();
    function truncate_with_ellipsis(s, maxLength) {
        if (s.length > maxLength) {
            return s.substring(0, maxLength - 3) + '...';
        }
        return s;
    };

    const allDropableCraftComponents = Object.keys(palettes).reduce((total, paletteName) => {
        const paletteElements = palettes[paletteName] ? Object.keys(palettes[paletteName]).filter(e => !palettes[paletteName][e].craft?.custom?.hidden).reduce((totalComp, componentName) => (
            { ...totalComp, [componentName]: { dropable: true, element: palettes[paletteName][componentName], icon: getIcon(palettes[paletteName][componentName]) } }
        ), {}) : { ...total }
        return { ...total, [paletteName]: paletteElements }
    }, {})

    const filteredDropableComponents = searchValue ? Object.keys(allDropableCraftComponents).reduce((total, paletteName) => {
        const paletteElements = allDropableCraftComponents[paletteName]
        const paletteElementsName = Object.keys(paletteElements)
        const filteredPaletteElements = paletteElementsName.filter(c => c.toLocaleLowerCase().includes(searchValue.toLocaleLowerCase()))
            .reduce((result, key) => {
                return { ...result, [key]: paletteElements[key] }
            }, {})
        var palette = {}
        if (Object.keys(filteredPaletteElements).length) {
            palette = {
                [paletteName]: filteredPaletteElements
            }
        }
        return { ...total, ...palette }
    }, {}) : allDropableCraftComponents

    const palettesArr = Object.keys(filteredDropableComponents).filter(p => p != "craft");

    function handleResize(e = {} as any) {
        const viewportHeight = window.innerHeight * 0.95;
        if (!viewRef.current) return
        viewRef.current.style.height = viewportHeight + 'px'
        viewRef.current.style.maxHeight = viewportHeight + 'px'
    }
    React.useEffect(() => {
        handleResize()
        window.addEventListener('resize', handleResize)
        return () => window.removeEventListener('resize', handleResize);
    }, [])


    return (
        <div className={'visualui-sidebar'} style={{backgroundColor: 'rgb(37, 37, 38)'}}>
            <div style={{ display: 'flex', flexDirection: 'column', flex: 1, padding: '4px' }}>
                <div ref={viewRef} style={{ padding: '4px', display: 'flex', flexDirection: "column", flex: 1 }}>
                    <p style={{ padding: '18px 0px 0px 14px', fontSize: '18px', color: 'white', fontWeight: '400' }}>Components</p>
                    <div style={{ display: 'flex', margin: '18px 12px 18px 2px', position: 'relative' }}>
                        <input
                            style={{
                                fontFamily: 'Jost-Regular',
                                padding: '8px 8px 8px 36px',
                                // border: 'grey',
                                display: 'flex',
                                boxSizing: 'border-box',
                                fontSize: '14px',
                                backgroundColor: '#323232',
                                borderRadius: '10px',
                                borderWidth: '0px',
                                outline: 'none',
                                color: 'white',
                                flex: 1
                            }}
                            value={searchValue}
                            onChange={t => setSearchValue(t.target.value)}
                            placeholder="Search..."
                        />
                        <Search color='grey' size={20} style={{ position: 'absolute', top: '8px', left: '10px' }} />
                        {searchValue ? <X onClick={() => setSearchValue('')} color='white' size={20} style={{ position: 'absolute', top: '8px', right: '10px', cursor: 'pointer' }} /> : null}
                    </div>
                    <div className={'visualui-sidebar-list'} style={{ overflow: 'auto', overflowX: 'hidden', display: 'flex', flexDirection: 'column', flex: 1 }} >
                        {
                            palettesArr.map((palette, i) => {
                                return (
                                    <div key={i} style={{ flexDirection: 'column', display: 'flex', marginBottom: '25px' }}>
                                        <p style={{ paddingLeft: '18px', marginTop: '0px', fontSize: '12px', color: 'grey' }}>{palette}</p>
                                        <div className={'visualui-sidebar-list'} style={{ flex: 1, display: 'flex', justifyContent: 'flex-start', flexWrap: 'wrap', alignContent: 'flex-start' }}>
                                            {
                                                Object.keys(filteredDropableComponents[palette]).map((componentName, i) => {
                                                    const data = filteredDropableComponents[palette][componentName]
                                                    return (data?.nonDeletable ?
                                                        null
                                                        : <div key={i} title={componentName} style={{ display: 'flex', margin: '8px', cursor: 'grab' }}>
                                                            <div
                                                                ref={ref => connectors.create(ref, () => {
                                                                    return (data.dropable) ?
                                                                        <Element
                                                                            is={data.element}
                                                                            canvas
                                                                        ></Element>
                                                                        : React.createElement(data.element)
                                                                })}
                                                                style={{ textAlign: 'center', marginTop: '10px', height: '50px', width: '50px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}
                                                            >
                                                                <Icon
                                                                    name={data.icon}
                                                                    color={"#a8a29e"}
                                                                    size={32}
                                                                />
                                                                <div style={{ marginTop: '5px' }}>
                                                                    <p style={{ fontSize: '10px', width: '100%', color: 'white' }}>
                                                                        {truncate_with_ellipsis(componentName, 12)}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )
                                                })
                                            }
                                        </div>
                                    </div>
                                )
                            })
                        }
                    </div>
                </div>
            </div>
        </div>
    );
};
