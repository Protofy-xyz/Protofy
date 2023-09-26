import Select, { components } from 'react-select';
import { ChevronUp } from "lucide-react";

export type PaneProps = {
    frames: any
    selectedFrame: string
    setFrameSelected: Function
};

export const FrameSelector = ({ selectedFrame, setFrameSelected, frames }: PaneProps) => {
    const frameTranslation = {
        "ipad11-vertical": "Tablet (Vertical)",
        "ipad11-horizontal": "Tablet (Horizontal)",
        "iphone13-vertical": "Smartphone (Vertical)",
        "iphone13-horizontal": "Smartphone (Horizontal)",
        "monitor": "Laptop",
        "raspi-display-horizontal": "Raspi Display (Horizontal)",
        "raspi-display-vertical": "Raspi Display (vertical)"
    }

    const onChange = ({ value }) => {
        setFrameSelected(value)
    }
    const textColor = 'white'
    const inputBackgroundColor = 'rgb(50, 50, 50)'
    const colourStyles = {
        control: (styles) => ({
            ...styles,
            backgroundColor: inputBackgroundColor,
            borderColor: "transparent",
            textColor: textColor,
            width: '200px',
            fontSize: '14px',
            justifyContent: 'flex-end'
        }),
        singleValue: (styles) => {
            return ({
                ...styles, minWidth: '95px', textAlign: 'left', color: textColor
            })
        },
        menu: (styles) => {
            return {
                ...styles, color: textColor,
                backgroundColor: inputBackgroundColor,
                border: '1px solid rgba(83, 89, 93, 0.5)',
                fontSize: '14px'
            }
        },
        option: (styles, { isFocused, isSelected }) => {
            return {
                ...styles,
                backgroundColor: isSelected
                    ? '#252526'
                    : isFocused
                        ? '#25252670'
                        : undefined,
                color: isSelected ? 'white' : 'grey',
                cursor: 'pointer',
            };
        }
    }
    const DropdownIndicator = props => {
        return (
            components.DropdownIndicator && (
                <components.DropdownIndicator {...props}>
                    <ChevronUp size={'15px'} />
                </components.DropdownIndicator>
            )
        );
    };
    const options = Object.keys(frames)?.map((item, index) => {
        return { label: frameTranslation[item], value: item }
    })
    return <div style={{ zIndex: 1000, justifyContent: 'flex-end', display: 'flex', padding: '10px' }}>
        <Select
            //@ts-ignore
            components={{ DropdownIndicator }}
            defaultValue={{ label: frameTranslation[selectedFrame], value: selectedFrame }}
            menuPlacement="top"
            isSearchable={false}
            onChange={onChange}
            className={'nodrag'}
            options={options}
            styles={colourStyles}
        />
    </div>
};