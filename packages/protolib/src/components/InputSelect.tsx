import React from 'react';
import CreatableSelect from 'react-select/creatable';
import { useThemeSetting } from '@tamagui/next-theme'
import { getTokenValue } from 'tamagui';
import { useTheme } from '@my/ui';
import { useTint } from '../lib/Tints';

export const InputSelect = React.forwardRef(({ menuStyle = {},controlStyle = {}, containerStyle = {}, ...props }: any, ref: any) => {
  const { resolvedTheme } = useThemeSetting()
  const theme = useTheme()
  const tint = useTint()
  const darkMode = resolvedTheme == 'dark'
  const DropdownIndicator = () => null;
  const IndicatorSeparator = () => null;
  return <CreatableSelect
    components={{ DropdownIndicator, IndicatorSeparator }}
    ref={ref}
    isClearable={true}
    styles={{
      option: (provided, state) => ({
        ...provided,
        backgroundColor: state.isSelected ? theme['color7'].val : (state.isFocused ? theme['color5'].val : provided.backgroundColor),
      }),
      menu: (provided) => ({
        ...provided,
        backgroundColor: theme.bgContent.val,
        borderColor: 'red',
        zIndex: 9999999999999,
        ...menuStyle
      }),
      control: (provided, state) => ({
        ...provided,
        width: '100%',
        backgroundColor: theme.bgContent.val,
        outline: 'none',
        boxShadow: 'none',
        borderColor: darkMode ? '#aaa' : '#ccc',
        borderWidth: 0,
        //borderBottomWidth: 1,
        borderRadius: 0,
        color: 'red',
        "&:hover": {
          outline: 'none',
          boxShadow: 'none',
          borderColor: theme.color8.val,
          borderWidth: 0,
          // borderBottomWidth: 1
        },
        "&:focus": {
          outline: 'none',
          boxShadow: 'none',
          borderColor: theme.color8.val,
          borderWidth: 0,
          // borderBottomWidth: 1
        },
        ...controlStyle
      }),
      input: (provided) => ({
        ...provided,
        color: theme.color.val
      }),
      singleValue: (provided) => ({
        ...provided,
        color: theme.color.val
      }),
      container: (provided) => ({
        ...provided,
        width: '100%',
        ...containerStyle
      }),
    }}
    {...props}
  >
    {props.children}
  </CreatableSelect>;
})
