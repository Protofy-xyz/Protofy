import React, { useEffect } from "react";
import PaletteApi from "visualui/api/PaletteApi";

const PaletteLoader = () => {
    const loadPalettes = async () => {
        try {
            await PaletteApi.load()
        } catch (e) { console.error('Error loading palette. Error: ', e) }
    }
    useEffect(() => {
        loadPalettes()
    }, [])
    return <></>
}

export default PaletteLoader