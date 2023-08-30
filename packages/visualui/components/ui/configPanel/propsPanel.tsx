import React, { } from "react";
import { Text } from "native-base";
import { Conf } from "../../conf"

export default (props, setProp, custom, setCustom) => {
    const filteredPropNames = Object.keys(props).filter(p => p != "style" && p != "_nodeId")
    return <>
        <div style={{ display: 'flex', justifyContent: 'flex-end', margin: '10px 15px 20px 0px', width: '300px' }} title="Component props">
            <Text color={'warmGray.500'} fontWeight={'400'}>Props</Text>
        </div>
        {
            filteredPropNames.map((propName, index) => 
            <Conf
                key={index}
                caption={propName}
                type={"text"}
                prop={propName} props={props} setProp={setProp}
                custom={custom} setCustom={setCustom}
                params={'delete'} style={false} />
            )
        }
        <Conf 
            caption={''} 
            type={'extraProp'} 
            prop={''} props={props} setProp={setProp} 
            custom={custom} setCustom={setCustom}
            params={[]} style={false} />
    </>
}