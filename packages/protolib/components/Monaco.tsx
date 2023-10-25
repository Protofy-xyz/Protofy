import React from 'react';
import Editor, { EditorProps, useMonaco } from '@monaco-editor/react';
import useKeypress from 'react-use-keypress';
import { useThemeSetting } from '@tamagui/next-theme';
import { useTheme } from '@my/ui';
import {Tinted, useTint} from 'protolib'

type Props = {
    sourceCode: string,
    onChange?: any,
    onSave?: any,
    onEscape?: any,
    path?: string
};

function hslToRgb(h, s, l) {
    let r, g, b;

    if (s === 0) {
        r = g = b = l;
    } else {
        const hue2rgb = (p, q, t) => {
            if (t < 0) t += 1;
            if (t > 1) t -= 1;
            if (t < 1 / 6) return p + (q - p) * 6 * t;
            if (t < 1 / 2) return q;
            if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
            return p;
        };

        const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        const p = 2 * l - q;
        r = hue2rgb(p, q, h + 1 / 3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1 / 3);
    }

    return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
}

function hslStringToHex(hslStr) {
    const matches = hslStr.match(/^hsl\((\d+),\s*([\d.]+)%,\s*([\d.]+)%\)$/i);

    if (!matches) return null;

    const [h, s, l] = [matches[1] / 360, matches[2] / 100, matches[3] / 100];
    const [r, g, b] = hslToRgb(h, s, l);

    return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase()}`;
}


export const Monaco = ({
    path = '',
    sourceCode,
    onChange = () => {},
    onSave = () => {},
    onEscape = () => {},
    ...props
}: Props & EditorProps) => {
    const { resolvedTheme } = useThemeSetting();
    const monaco = useMonaco();
    const customThemeName = 'myCustomTheme';

    const theme = useTheme()
    const { tint } = useTint()
    let tokenColor = theme[tint+'10'].val
    tokenColor = tokenColor.startsWith('hsl') ? hslStringToHex(tokenColor) : tokenColor
    console.log('token color: ', theme[tint+'10'].val, tokenColor)
    if (monaco) {
        monaco.editor.defineTheme(customThemeName, {
            base: resolvedTheme === 'dark' ? 'vs-dark' : 'vs',
            inherit: true,
            rules: [
                { token: 'keyword', foreground: tokenColor },
                { token: 'punctuation', foreground: tokenColor } 
            ],
            colors: {
                'editor.background': theme.background.val
            }
        });
    }

    if (onSave) {
        useKeypress(['s', 'S'], (event) => {
            if ((event.key === "s" || event.key === "S") && (event.ctrlKey || event.metaKey)) {
                event.preventDefault();
                onSave();
            }
        });
    }

    if (onEscape) {
        useKeypress(['Escape'], (event) => {
            if (event.key === "Escape") {
                event.preventDefault();
                onEscape();
            }
        });
    }

    return (
        <Tinted><Editor
            path={path}
            theme={monaco ? customThemeName : undefined}
            value={sourceCode}
            onChange={onChange}
            {...props}
        /></Tinted>
    );
};