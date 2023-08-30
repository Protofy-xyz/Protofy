/* MIT License

Copyright (c) 2022-present, PROTOFY.XYZ, S.L.

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE. */

import React from 'react';
import { useFonts } from 'expo-font';
import { useAppStore } from 'baseapp/context/appStore';

import JostRegular from '../assets/fonts/Jost-Regular.ttf';
import JostMedium from '../assets/fonts/Jost-Medium.ttf';
import JostLight from '../assets/fonts/Jost-Light.ttf';
import JostBold from '../assets/fonts/Jost-Bold.ttf';
import MontserratRegular from '../assets/fonts/Montserrat-Regular.ttf';
import MontserratMedium from '../assets/fonts/Montserrat-Medium.ttf';
import MontserratLight from '../assets/fonts/Montserrat-Light.ttf';
import MontserratBold from '../assets/fonts/Montserrat-Bold.ttf';
import MaterialCommunity from '../assets/fonts/MaterialCommunityIcons.ttf';

export default () => {
    const {setFontsLoaded} = useAppStore();
    let [fontsLoaded, error] = useFonts({
        "Montserrat-Regular": MontserratRegular,
        "Montserrat-Medium": MontserratMedium,
        "Montserrat-Light": MontserratLight,
        "Montserrat-Bold": MontserratBold,
        "Jost-Regular": JostRegular,
        "Jost-Medium": JostMedium,
        "Jost-Light": JostLight,
        "Jost-Bold": JostBold,
        "Material-Cmmunity": MaterialCommunity
    });


    React.useEffect(() => {
        // console.log('fonts loaded: ', fontsLoaded);
        setFontsLoaded(fontsLoaded)
    }, [fontsLoaded]);
    return <></>
}