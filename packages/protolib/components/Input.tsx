import { InputProps, useInputProps } from '@my/ui';
import {
    styled,
    withStaticProperties,
    isWeb
} from '@tamagui/core'
import { v4 as uuidv4 } from 'uuid';
import { inputSizeVariant } from '../helpers/InputHelpers'
import '../styles/styles.css'

type OptionProps = {
    value: string
}
type MyInputProps = {
    options: string[],
    children?: any,
    listProps?: any
}

const MyOption = ({ value }: OptionProps) => <option value={value} />

const MyInput = ({ children, listProps = {}, options = [], ...props }: MyInputProps & any) => {
    const inputListId = 'input-select-' + uuidv4()
    return <>
        <input list={inputListId} {...props} style={{ fontSize: props.fontSize, ...props.style }} />
        <div {...listProps} style={{maxHeight: '40px'}}>
            <datalist className='datalist' id={inputListId}>
                {children}
                {options.map((opt, index) => <MyOption key={index} value={opt}></MyOption>)}
            </datalist>
        </div>
    </>
}

export const defaultStyles = {
    size: '$true',
    fontFamily: '$body',
    borderWidth: 1,
    outlineWidth: 0,
    color: '$color',

    ...(isWeb
        ? {
            tabIndex: 0,
        }
        : {
            focusable: true,
        }),

    borderColor: '$borderColor',
    backgroundColor: '$background',

    // this fixes a flex bug where it overflows container
    minWidth: 0,

    hoverStyle: {
        borderColor: '$borderColorHover'
    },

    focusStyle: {
        outlineColor: '$borderColorFocus',
        outlineWidth: 2,
        outlineStyle: 'solid',
        borderColor: '$borderColorFocus'
    },
} as const

const InputFrame = styled(MyInput,
    {
        name: 'Input', // Some styles depend on the name
        acceptsClassName: true,

        variants: {
            unstyled: {
                false: defaultStyles,
            },

            size: {
                '...size': inputSizeVariant,
            },
        } as const,

        defaultVariants: {
            unstyled: false,
        },
    },
    {
        isInput: true,
    }
)

export const WrappedInput = InputFrame.styleable<InputProps>((propsIn, ref) => {
    const props = useInputProps(propsIn, ref)

    return <InputFrame {...props} />
})

export const Input = withStaticProperties(WrappedInput, {
    Option: MyOption
})