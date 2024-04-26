import React from "react";
import { Element, useEditor } from "@protocraft/core";
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
    
    const atoms = palettes.atoms;

    const allDropableAtoms = Object.keys(atoms).reduce((total, paletteName) => {
        const paletteAtoms = atoms[paletteName] ? Object.keys(atoms[paletteName]).filter(e => !atoms[paletteName][e].craft?.custom?.hidden).reduce((totalComp, componentName) => (
            { ...totalComp, [componentName]: { dropable: true, element: atoms[paletteName][componentName], icon: getIcon(atoms[paletteName][componentName]) } }
        ), {}) : { ...total }
        return { ...total, [paletteName]: paletteAtoms }
    }, {})

    const filteredDropableComponents = searchValue ? Object.keys(allDropableAtoms).reduce((total, paletteName) => {
        const paletteAtoms = allDropableAtoms[paletteName]
        const paletteAtomsName = Object.keys(paletteAtoms)
        const filteredPaletteAtoms = paletteAtomsName.filter(c => c.toLocaleLowerCase().includes(searchValue.toLocaleLowerCase()))
            .reduce((result, key) => {
                return { ...result, [key]: paletteAtoms[key] }
            }, {})
        var palette = {}
        if (Object.keys(filteredPaletteAtoms).length) {
            palette = {
                [paletteName]: filteredPaletteAtoms
            }
        }
        return { ...total, ...palette }
    }, {}) : allDropableAtoms

    const atomsPalettesArr = Object.keys(filteredDropableComponents).filter(p => p != "craft");

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
        <div className={'visualui-sidebar'} style={{ backgroundColor: 'rgb(37, 37, 38, 0.97)' }}>
            <div style={{ display: 'flex', flexDirection: 'column', flex: 1, padding: '4px' }}>
                <div ref={viewRef} style={{ padding: '4px', display: 'flex', flexDirection: "column", flex: 1 }}>
                    <p style={{ padding: '18px 0px 0px 14px', fontSize: '18px', color: 'white', fontWeight: '400' }}>Components</p>
                    <div style={{ display: 'flex', margin: '18px 12px 18px 2px', position: 'relative' }}>
                        <input
                            style={{
                                fontFamily: 'Jost-Regular',
                                padding: '8px 8px 8px 36px',
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
                            atomsPalettesArr.map((palette, i) => {
                                return (
                                    <div key={i} style={{ flexDirection: 'column', display: 'flex', marginBottom: '25px' }}>
                                        <p style={{ paddingLeft: '16px', marginBottom: '10px', fontSize: '12px', color: 'grey' }}>{palette.toUpperCase()}</p>
                                        <div className={'visualui-sidebar-list'} style={{ flex: 1, display: 'flex', justifyContent: 'flex-start', flexWrap: 'wrap', alignContent: 'flex-start', gap: '8px' }}>
                                            {
                                                Object.keys(filteredDropableComponents[palette]).map((componentName, i) => {
                                                    const data = filteredDropableComponents[palette][componentName]

                                                    return (data?.nonDeletable ?
                                                        null
                                                        : <div key={i}
                                                            onMouseEnter={(e) => {
                                                                e.currentTarget.style.backgroundColor = '#FFFFFF10'
                                                            }}
                                                            onMouseLeave={(e) => {
                                                                e.currentTarget.style.backgroundColor = ''
                                                            }}
                                                            title={componentName}
                                                            style={{ display: 'flex', cursor: 'grab', borderRadius: '6px' }}>
                                                            <div
                                                                ref={ref => connectors.create(ref, () => {
                                                                    return (data.dropable) ?
                                                                        <Element
                                                                            is={data.element}
                                                                            canvas
                                                                        ></Element>
                                                                        : React.createElement(data.element)
                                                                })}
                                                                id={"drag-element-" + componentName}
                                                                className={"draggable-element"}
                                                                style={{ textAlign: 'center', paddingTop: '10px', paddingBottom: '10px', width: '100px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}
                                                            >
                                                                <Icon
                                                                    name={data.icon}
                                                                    color={"#a8a29e"}
                                                                    size={32}
                                                                />
                                                                <div style={{ marginTop: '14px' }}>
                                                                    <p style={{ fontSize: '12px', width: '100%', color: 'white', padding: '5px' }}>
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
