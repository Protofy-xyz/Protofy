import React from "react";
import { isArray, isObject, isNumber, isString, isBoolean } from "lodash";
import {
  CollapseIcon,
  isNodeCollapsed,
  toggleNodeCollapsed,
} from "./components/shared/CollapseIcon";
import { jsonViewerDefaultStyles } from "./util";
import { getKey } from "./util";
import LabelAndValue from "./components/viewer/LabelAndValue";
import Label from "./components/viewer/Label";
import { Stack, XStack, YStack } from "tamagui";
import { AddArrayButton } from "./components/viewer/AddArrayButton";

type JSONViewerProps = {
  data: any,
  marginLeftStep?: number,
  collapsible?: boolean,
  collapsedNodes?: any,
  styles?: any,
  onChange?: any,
  editable?: boolean,
  compact?: boolean,
  defaultCollapsed?: boolean
}

type JSONViewerData = {
  data: any,
  collapsedNodes: any
}

const JSONViewer = (_props: JSONViewerProps) => {
  const defaultProps = {
    data: {}, //data to edit
    marginLeftStep: 2, //no of spaces to the left per nested object
    collapsible: false, //whether nodes are collapsible or not
    collapsedNodes: {},
    styles: jsonViewerDefaultStyles, //pass to override styles
    onChange: () => { },
    editable: false,
    compact: false,
    defaultCollapsed: false
  };

  const props = {...defaultProps, ..._props}

  const [state, setState] = React.useState({
    data: { root: props.data },
    collapsedNodes: props.defaultCollapsed? {0:{root: true}} : props.collapsedNodes,
  })

  const onChange = (action, path, value, type) => {
    if (!props.editable) return;
    const realPath = path.slice(1)
    let newObj = JSON.parse(JSON.stringify(state.data))
    let curr = newObj
    console.log('action: [' + action + ']', path, value, type)
    for (let i = 0; i < realPath.length; i++) {
      if (i === realPath.length - 1) {
        if (action == 'update') {
          if (type == 'property') {
            curr[value] = curr[realPath[i]]
            delete curr[realPath[i]]

          } else {
            curr[realPath[i]] = type == 'number' ? parseFloat(value) : value
          }

        } else if (action == 'delete') {
          if (type == 'array') {
            console.log('delete: ', realPath[i])
            curr.splice(realPath[i], 1)
          } else {
            delete curr[realPath[i]]
          }

        } else if (action == 'add') {
          if (type == 'property') {
            curr[realPath[i]][''] = ''
          } else if (type == 'array') {
            curr[realPath[i]].push('')
          }
        } else if (action == 'type') {
          curr[realPath[i]] = value
        }
      }
      curr = curr[realPath[i]]
    }
    setState({
      ...state,
      data: newObj
    })
    props.onChange(newObj.root, path, value, type, action)
  }

  const parseArray = (currentKey, parentKeyPath, data, parent, elems, marginLeft, isLastSibling) => {
    parentKeyPath = parentKeyPath + "_" + currentKey;
    let { marginLeftStep } = props;

    const childs: any = []
    if (marginLeft > 0) {
      childs.push(
        getLabelAndValue(currentKey, parentKeyPath, "[", parent, "builtin", marginLeft, true),
        getCollapseIcon(marginLeft, currentKey, parentKeyPath)
      );
    } else {
      childs.push(
        getLabel("[", "builtin", marginLeft, true, currentKey, parentKeyPath), //opening array tag
        getCollapseIcon(marginLeft, currentKey, parentKeyPath)
      );
    }

    if (isNodeCollapsed.call(this, marginLeft, currentKey, marginLeftStep, state)) {
      childs.push(getLabel("]", "builtin", 0, isLastSibling, currentKey, parentKeyPath, true));
    }

    elems.push(<XStack width={'min-content'}>
      {childs}
    </XStack>)

    if (isNodeCollapsed.call(this, marginLeft, currentKey, marginLeftStep, state)) {
      return; //this node is collapsed
    }


    let prevIsLastSibling = isLastSibling;
    const arrChilds: any = []
    for (let key = 0; key < data.length; key++) {
      isLastSibling = key === data.length - 1;
      recursiveParseData(key, parentKeyPath, data, arrChilds, marginLeft + marginLeftStep, isLastSibling);
    }
    if (props.editable) {
      arrChilds.push(<XStack flex={1} marginBottom={"$3"} marginLeft={24 + (marginLeft * 10)}><AddArrayButton onAdd={() => {
        onChange('add', [...parentKeyPath.split('_')], '', 'array')
      }} /></XStack>)
    }

    elems.push(React.createElement(YStack, {}, [arrChilds]))
    elems.push(getLabel("]", "builtin", marginLeft, prevIsLastSibling, currentKey, parentKeyPath)); //closing array tag
  }

  const parseObject = (currentKey, parentKeyPath, data, parent, elems, marginLeft, isLastSibling) => {
    parentKeyPath = parentKeyPath + "_" + currentKey;
    let { marginLeftStep } = props;
    const childs: any = []
    if (marginLeft > 0) {
      //special case to avoid showing root
      childs.push(
        getLabelAndValue(currentKey, parentKeyPath, "{", parent, "builtin", marginLeft, true), //opening object tag
        getCollapseIcon(marginLeft, currentKey, parentKeyPath)
      );
    } else {
        childs.push(
          getLabel("{", "builtin", marginLeft, true, currentKey, parentKeyPath), //opening object tag
          getCollapseIcon(marginLeft, currentKey, parentKeyPath)
        );
    }

    if (isNodeCollapsed.call(this, marginLeft, currentKey, marginLeftStep, state)) {
      childs.push(getLabel("}", "builtin", 0, isLastSibling, currentKey, parentKeyPath, true)); //closing object tag
    }

    elems.push(<XStack width={'min-content'}>{childs}</XStack>)

    if (isNodeCollapsed.call(this, marginLeft, currentKey, marginLeftStep, state)) {
      return; //this node is collapsed
    }


    let keys = Object.keys(data)
    let count = 0;
    let prevIsLastSibling = isLastSibling;
    const arrChilds: any = []
    keys.forEach((key) => {
      isLastSibling = ++count === keys.length;
      recursiveParseData(key, parentKeyPath, data, arrChilds, marginLeft + marginLeftStep, isLastSibling);
    });

    if (props.editable) {
      arrChilds.push(<XStack flex={1} marginBottom={"$3"} marginLeft={24 + (marginLeft * 9.6)}><AddArrayButton onAdd={() => {
        onChange('add', [...parentKeyPath.split('_')], '', 'property')
      }} /></XStack>)
    }

    elems.push(React.createElement(YStack, {}, [arrChilds]))
    elems.push(getLabel("}", "builtin", marginLeft, prevIsLastSibling, currentKey, parentKeyPath)); //closing object tag
  }

  const getDataType = (data) => {
    if (isArray(data)) return "array";
    else if (isObject(data)) return "object";
    else if (isNumber(data)) return "number";
    else if (isString(data)) return "string";
    else if (isBoolean(data)) return "boolean";
    else return "builtin";
  }

  const recursiveParseData = (currentKey, parentKeyPath, parent, elems, marginLeft, isLastSibling) => {
    let data = parent[currentKey];
    switch (getDataType(data)) {
      case "array":
        parseArray(currentKey, parentKeyPath, data, parent, elems, marginLeft, isLastSibling);
        break;
      case "object":
        parseObject(currentKey, parentKeyPath, data, parent, elems, marginLeft, isLastSibling);
        break;
      case "number":
        elems.push(getLabelAndValue(currentKey, parentKeyPath, data, parent, "number", marginLeft, isLastSibling));
        break;
      case "string":
        elems.push(getLabelAndValue(currentKey, parentKeyPath, data, parent, "text", marginLeft, isLastSibling));
        break;
      case "boolean":
        elems.push(getLabelAndValue(currentKey, parentKeyPath, data, parent, "boolean", marginLeft, isLastSibling));
        break;
      default:
        elems.push(getLabelAndValue(currentKey, parentKeyPath, data, parent, "builtin", marginLeft, isLastSibling));
    }
  }

  const getCollapseIcon = (marginLeft, currentKey, parentKeyPath) => {
    let { collapsedNodes } = state;
    let { collapsible, marginLeftStep } = props;
    return (
      <XStack top={-6} key={getKey("collapse_and_remove", currentKey, parentKeyPath, marginLeft)}>
        <CollapseIcon collapsedNodes={collapsedNodes} marginLeft={marginLeft} collapsible={collapsible} currentKey={currentKey}
          isNodeCollapsed={isNodeCollapsed.bind(this, marginLeft, currentKey, marginLeftStep, state)}
          toggleNodeCollapsed={toggleNodeCollapsed.bind(this, marginLeft, currentKey, marginLeftStep, state, setState)}
        />
      </XStack>
    );
  }

  const getLabelAndValue = (currentKey, parentKeyPath, value, parent, type, marginLeft, isLastSibling) => {
    const { styles } = props;
    if (isArray(parent)) {
      //for arrays we dont show keys
      return getLabel(value, type, marginLeft, isLastSibling, currentKey, parentKeyPath);
    } else {
      return (
        <LabelAndValue
          key={getKey("label_and_value", currentKey, parentKeyPath, marginLeft)}
          currentKey={currentKey}
          value={value}
          type={type}
          parent={parent}
          marginLeft={marginLeft}
          isLastSibling={isLastSibling}
          styles={styles}
          parents={parentKeyPath.split('_')}
          onChange={onChange}
          editable={props.editable}
        />
      );
    }
  }

  const getLabel = (value, type, marginLeft, isLastSibling, currentKey, parentKeyPath, isCollasped?) => {
    const { styles } = props;
    return (
      <Label
        key={getKey("label", currentKey + value, parentKeyPath, marginLeft)}
        value={value}
        type={type}
        marginLeft={marginLeft}
        isLastSibling={isLastSibling}
        styles={styles}
        isCollasped={isCollasped}
        parents={parentKeyPath.split('_')}
        single={true}
        currentKey={currentKey}
        onChange={onChange}
        editable={props.editable}
      />
    );
  }


  let elems = [];
  const { styles } = props;

  recursiveParseData("root", "", state.data, elems, 0, true);
  return <Stack f={1} style={styles.root}>{elems}</Stack>;
  
}

export default React.memo(JSONViewer)