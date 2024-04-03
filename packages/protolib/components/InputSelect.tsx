import React from 'react';
import CreatableSelect from 'react-select/creatable';
import { useThemeSetting } from '@tamagui/next-theme'
import { getTokenValue } from 'tamagui';
import {useTheme} from '@my/ui';
import { useTint } from '../lib/Tints';

export const InputSelect = React.forwardRef(({controlStyle={}, containerStyle = {},...props}: any, ref: any) => {
  const { resolvedTheme } = useThemeSetting()
  const theme = useTheme()
  const tint = useTint()
  const darkMode = resolvedTheme == 'dark'
  return <CreatableSelect ref={ref} {...props}
    styles={{
      option: (provided, state) => ({
        ...provided,
        backgroundColor: state.isFocused ? theme['color5'].val : provided.backgroundColor,
        // color: state.isFocused ? 'colorDeTextoDeseado' : provided.color,
      }),
      menu: (provided) => ({
        ...provided,
        backgroundColor: theme.bgContent.val,
        zIndex: 9999999999999
      }),
      control: (provided) => ({
        ...provided,
        width: '100%',
        backgroundColor: theme.bgContent.val,
        ...controlStyle
      }),
      container: (provided) => ({
        ...provided,
        width: '100%',
        ...containerStyle
      }),
    }}
  >
    {props.children}
  </CreatableSelect>;
})