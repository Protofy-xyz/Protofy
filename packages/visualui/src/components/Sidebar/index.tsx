import React from "react";
import { useEditor } from "@protocraft/core";
import { getIcon } from "../../utils/craftComponent";
import { Search, X } from 'lucide-react';
import { useUITheme } from "../Theme";
import { useThemeSetting } from '@tamagui/next-theme'
import { ElementCard } from "./ElementCard";
import { Element } from "@protocraft/core";

export type SidebarProps = {
    palettes: any,
    sendMessage: Function
};

export const Sidebar = ({
    palettes,
    sendMessage,
}: SidebarProps) => {
    const [searchValue, setSearchValue] = React.useState('')
    const { connectors } = useEditor();
    const { resolvedTheme } = useThemeSetting();

    const nodeBackgroundColor = useUITheme('nodeBackgroundColor')
    const textColor = useUITheme('textColor')

    const atoms = palettes.atoms;
    const molecules = palettes.molecules;

    const getDropableElements = (palette) => {
        return Object.keys(palette).reduce((total, paletteName) => {
            const paletteAtoms = palette[paletteName] ? Object.keys(palette[paletteName]).filter(e => !palette[paletteName][e].craft?.custom?.hidden).reduce((totalComp, componentName) => (
                { ...totalComp, [componentName]: { dropable: true, element: palette[paletteName][componentName], icon: getIcon(palette[paletteName][componentName]) } }
            ), {}) : { ...total }
            return { ...total, [paletteName]: paletteAtoms }
        }, {})
    }

    const getFilteredElements = (list) => {
        return searchValue ? Object.keys(list).reduce((total, paletteName) => {
            const paletteElements = list[paletteName]
            const paletteElementsName = Object.keys(paletteElements)
            const filteredPaletteAtoms = paletteElementsName.filter(c => c.toLocaleLowerCase().includes(searchValue.toLocaleLowerCase()))
                .reduce((result, key) => {
                    return { ...result, [key]: paletteElements[key] }
                }, {})
            var palette = {}
            if (Object.keys(filteredPaletteAtoms).length) {
                palette = {
                    [paletteName]: filteredPaletteAtoms
                }
            }
            return { ...total, ...palette }
        }, {}) : list
    }

    const allDropableAtoms = getDropableElements(atoms)
    const allDropableMolecules = getDropableElements(molecules)

    const filteredDropableAtoms = getFilteredElements(allDropableAtoms)
    const filteredDropableMolecules = getFilteredElements(allDropableMolecules)

    const atomsPalettesArr = Object.keys(filteredDropableAtoms).filter(p => p != "craft");

    return (
        <div className={'visualui-sidebar'} style={{ padding: '8px', display: 'flex', flexDirection: "column", flex: 1, backgroundColor: nodeBackgroundColor }}>
            <p style={{ padding: '18px 0px 0px 14px', fontSize: '18px', color: textColor, fontWeight: '400', display: 'flex' }}>Components</p>
            <div style={{ display: 'flex', margin: '18px 12px 18px 2px', position: 'relative' }}>
                <input
                    style={{
                        fontFamily: 'Jost-Regular',
                        padding: '8px 8px 8px 36px',
                        display: 'flex',
                        boxSizing: 'border-box',
                        fontSize: '14px',
                        backgroundColor: resolvedTheme == 'light' ? '#E1E1E1' : "#323232",
                        borderRadius: '10px',
                        borderWidth: '0px',
                        outline: 'none',
                        color: textColor,
                        flex: 1
                    }}
                    value={searchValue}
                    onChange={t => setSearchValue(t.target.value)}
                    placeholder="Search..."
                />
                <Search color={'grey'} size={20} style={{ position: 'absolute', top: '8px', left: '10px' }} />
                {searchValue ? <X onClick={() => setSearchValue('')} color='white' size={20} style={{ position: 'absolute', top: '8px', right: '10px', cursor: 'pointer' }} /> : null}
            </div>
            <div className={'visualui-sidebar-list'} style={{ overflow: 'auto', overflowX: 'hidden', display: 'flex', flexDirection: 'column', flex: 1 }} >
                {
                    atomsPalettesArr.map((palette, i) => {
                        return (
                            <div key={i} style={{ flexDirection: 'column', display: 'flex', marginBottom: '25px' }}>
                                <p style={{ paddingLeft: '16px', marginBottom: '10px', fontSize: '12px', color: "gray" }}>{palette.toUpperCase()}</p>
                                <div className={'visualui-sidebar-list'} style={{ flex: 1, display: 'flex', justifyContent: 'flex-start', flexWrap: 'wrap', alignContent: 'flex-start', gap: '8px' }}>
                                    {
                                        Object.keys(filteredDropableAtoms[palette]).map((componentName, i) => {
                                            const data = filteredDropableAtoms[palette][componentName]
                                            return (data?.nonDeletable
                                                ? null
                                                : <ElementCard
                                                    key={i}
                                                    element={<Element is={data.element} canvas />}
                                                    componentName={componentName}
                                                    connectors={connectors}
                                                    data={data}
                                                />
                                            )
                                        })
                                    }
                                </div>
                            </div>
                        )
                    })
                }
            </div>
        </div >
    );
};