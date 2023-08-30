import React, { } from "react";
import { Text } from "native-base";
import { cssPropsExample } from "../../../utils/cssProperties"
import { Conf } from "../../conf"
import { JSCodeToOBJ, loadValue } from "../../../utils/utils";

export default (props, setProp, custom, setCustom, includeColor?, colorPropName = 'color', defaultColor = undefined) => {
    let styleKeys: string[] = []
    if (props.style) {
        let styleProps = props.style
        if (typeof (props.style) != 'object') {
            try {
                styleProps = JSON.parse(loadValue(props.style, custom.style))
            } catch (e) { // For objects without doublequotes
                styleProps = JSCodeToOBJ(loadValue(props.style, custom.style))
                props = {...props, style: "{"+JSON.stringify(JSCodeToOBJ(loadValue(props.style, custom.style)))+"}" }// Modify Props to properly parse when missing quotes to any object key of style
            }
        }
        styleKeys = Object.keys(styleProps)
    }
    return <>
        {
            includeColor ?
                <Conf
                    caption={'Color'} type={'themeColor'}
                    prop={colorPropName} props={props} setProp={setProp}
                    custom={custom} setCustom={setCustom}
                    defaultValue={defaultColor} />
                : null
        }
        <div style={{ display: 'flex', justifyContent: 'flex-end', margin: '10px 15px 20px 0px', width: '300px' }} title="CSS properties">
            <Text color={'warmGray.500'} fontWeight={'400'}>Inline Styles</Text>
        </div>
        {styleKeys.map((styleKey, index) => (
            <Conf
                key={index}
                caption={styleKey}
                type={'text'}
                prop={styleKey} props={props} setProp={setProp}
                custom={custom} setCustom={setCustom}
                params={'delete'}
                style={true}
            />
        ))}
        <Conf
            caption={''}
            type={'extraStyle'} prop={''} props={props} setProp={setProp}
            custom={custom} setCustom={setCustom}
            params={Object.keys(cssPropsExample)} style={true}
        />
    </>
}