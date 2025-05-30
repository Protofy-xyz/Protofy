import { useState } from "react";
import Label from "./Label";
import { XStack } from "@my/ui";
import React from "react";

const LabelAndValue = (props) => {
  let { currentKey, marginLeft, type, value, isLastSibling, styles, onValueSelected, onKeySelected } = props;
  const [deleted, setDeleted] = useState(false)

  const onChange = (action, path, value, type) => {
    if(action == 'delete') {
      setDeleted(true)
      if(props.onDelete) {
        props.onDelete()
      }
    }
    return props.onChange(action, path, value, type)
  }
  return (
    !deleted ? <XStack flex={1} key={`label_and_value_${currentKey}`}>
      <Label
        value={currentKey}
        type="property"
        childType={type}
        isLastSibling={isLastSibling}
        marginLeft={marginLeft}
        styles={styles}
        parents={props.parents}
        currentKey={currentKey}
        onChange={onChange}
        editable={props.editable}
        onKeySelected={onKeySelected}
        onValueSelected={onValueSelected}
      />
      <Label
        value={value}
        type={type}
        isLastSibling={isLastSibling}
        marginLeft={1}
        styles={styles}
        parents={props.parents}
        currentKey={currentKey}
        onChange={onChange}
        editable={props.editable}
        onKeySelected={onKeySelected}
        onValueSelected={onValueSelected}
      />
    </XStack>
  :null)
};

export default React.memo(LabelAndValue);