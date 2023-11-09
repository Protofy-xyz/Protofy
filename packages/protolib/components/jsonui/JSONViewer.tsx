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
  styles: any,
  onChange: any,
  editable: boolean,
  compact: boolean
}

type JSONViewerData = {
  data: any,
  collapsedNodes: any
}

class JSONViewer extends React.Component {
  //@ts-ignore
  props: JSONViewerProps
  state: JSONViewerData
  static defaultProps: JSONViewerProps = {
    data: {}, //data to edit
    marginLeftStep: 2, //no of spaces to the left per nested object
    collapsible: false, //whether nodes are collapsible or not
    collapsedNodes: {},
    styles: jsonViewerDefaultStyles, //pass to override styles
    onChange: () => { },
    editable: false,
    compact: false
  };

  constructor(props: JSONViewerProps) {
    super(props);
    const data = { root: props.data };
    this.state = {
      data: data,
      collapsedNodes: props.collapsedNodes,
    };
  }

  onChange = (action, path, value, type) => {
    if (!this.props.editable) return;
    const realPath = path.slice(1)
    let newObj = JSON.parse(JSON.stringify(this.state.data))
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
    this.setState({
      ...this.state,
      data: newObj
    })
    this.props.onChange(newObj.root, path, value, type, action)
  }

  componentWillReceiveProps(nextProps) {
    if (JSON.stringify(nextProps) !== JSON.stringify(this.state)) {
      this.setState({
        data: { root: nextProps.data },
        marginLeftStep: nextProps.marginLeftStep,
        collapsible: nextProps.collapsible,
        collapsedNodes: nextProps.collapsedNodes,
        styles: nextProps.styles,
      });
    }
  }

  parseArray(
    currentKey,
    parentKeyPath,
    data,
    parent,
    elems,
    marginLeft,
    isLastSibling
  ) {
    parentKeyPath = parentKeyPath + "_" + currentKey;
    let { marginLeftStep } = this.props;

    const childs: any = []
    if (marginLeft > 0) {
      childs.push(

        this.getLabelAndValue(
          currentKey,
          parentKeyPath,
          "[",
          parent,
          "builtin",
          marginLeft,
          true
        ),
        this.getCollapseIcon(marginLeft, currentKey, parentKeyPath)
      );
    } else {
      childs.push(
        this.getLabel(
          "[",
          "builtin",
          marginLeft,
          true,
          currentKey,
          parentKeyPath
        ), //opening array tag
        this.getCollapseIcon(marginLeft, currentKey, parentKeyPath)
      );
    }

    if (isNodeCollapsed.call(this, marginLeft, currentKey, marginLeftStep)) {
      childs.push(
        this.getLabel(
          "]",
          "builtin",
          0,
          isLastSibling,
          currentKey,
          parentKeyPath,
          true
        )
      );
    }

    elems.push(<XStack width={'min-content'}>
      {childs}
    </XStack>)

    if (isNodeCollapsed.call(this, marginLeft, currentKey, marginLeftStep)) {
      return; //this node is collapsed
    }


    let prevIsLastSibling = isLastSibling;
    const arrChilds: any = []
    for (let key = 0; key < data.length; key++) {
      isLastSibling = key === data.length - 1;
      this.recursiveParseData(
        key,
        parentKeyPath,
        data,
        arrChilds,
        marginLeft + marginLeftStep,
        isLastSibling
      );
    }
    if (this.props.editable)
      arrChilds.push(<XStack flex={1} marginBottom={"$3"} marginLeft={24 + (marginLeft * 10)}><AddArrayButton onAdd={() => {
        this.onChange('add', [...parentKeyPath.split('_')], '', 'array')
      }} /></XStack>)
    elems.push(React.createElement(YStack, {}, [arrChilds]))

    elems.push(
      this.getLabel(
        "]",
        "builtin",
        marginLeft,
        prevIsLastSibling,
        currentKey,
        parentKeyPath
      )
    ); //closing array tag

  }

  parseObject(
    currentKey,
    parentKeyPath,
    data,
    parent,
    elems,
    marginLeft,
    isLastSibling
  ) {
    parentKeyPath = parentKeyPath + "_" + currentKey;
    let { marginLeftStep } = this.props;
    const childs: any = []
    if (marginLeft > 0) {
      //special case to avoid showing root
      childs.push(
        this.getLabelAndValue(
          currentKey,
          parentKeyPath,
          "{",
          parent,
          "builtin",
          marginLeft,
          true
        ), //opening object tag
        this.getCollapseIcon(marginLeft, currentKey, parentKeyPath)
      );
    } else {

        childs.push(
          this.getLabel(
            "{",
            "builtin",
            marginLeft,
            true,
            currentKey,
            parentKeyPath
          ), //opening object tag
          this.getCollapseIcon(marginLeft, currentKey, parentKeyPath)
        );


    }
    if (isNodeCollapsed.call(this, marginLeft, currentKey, marginLeftStep)) {
      childs.push(
        this.getLabel(
          "}",
          "builtin",
          0,
          isLastSibling,
          currentKey,
          parentKeyPath,
          true
        )
      ); //closing object tag
    }
    elems.push(<XStack width={'min-content'}>
      {childs}
    </XStack>)

    if (isNodeCollapsed.call(this, marginLeft, currentKey, marginLeftStep)) {
      return; //this node is collapsed
    }


    let keys = Object.keys(data)
    let count = 0;
    let prevIsLastSibling = isLastSibling;
    const arrChilds: any = []
    keys.forEach((key) => {
      isLastSibling = ++count === keys.length;
      this.recursiveParseData(
        key,
        parentKeyPath,
        data,
        arrChilds,
        marginLeft + marginLeftStep,
        isLastSibling
      );
    });

    if (this.props.editable)
      arrChilds.push(<XStack flex={1} marginBottom={"$3"} marginLeft={24 + (marginLeft * 9.6)}><AddArrayButton onAdd={() => {
        this.onChange('add', [...parentKeyPath.split('_')], '', 'property')
      }} /></XStack>)
    elems.push(React.createElement(YStack, {}, [arrChilds]))


      elems.push(
        this.getLabel(
          "}",
          "builtin",
          marginLeft,
          prevIsLastSibling,
          currentKey,
          parentKeyPath
        )
      ); //closing object tag
    }



  getDataType(data) {
    if (isArray(data)) return "array";
    else if (isObject(data)) return "object";
    else if (isNumber(data)) return "number";
    else if (isString(data)) return "string";
    else if (isBoolean(data)) return "boolean";
    else return "builtin";
  }

  recursiveParseData(
    currentKey,
    parentKeyPath,
    parent,
    elems,
    marginLeft,
    isLastSibling
  ) {
    let data = parent[currentKey];
    switch (this.getDataType(data)) {
      case "array":
        this.parseArray(
          currentKey,
          parentKeyPath,
          data,
          parent,
          elems,
          marginLeft,
          isLastSibling
        );
        break;
      case "object":
        this.parseObject(
          currentKey,
          parentKeyPath,
          data,
          parent,
          elems,
          marginLeft,
          isLastSibling
        );
        break;
      case "number":
        elems.push(
          this.getLabelAndValue(
            currentKey,
            parentKeyPath,
            data,
            parent,
            "number",
            marginLeft,
            isLastSibling
          )
        );
        break;
      case "string":
        elems.push(
          this.getLabelAndValue(
            currentKey,
            parentKeyPath,
            data,
            parent,
            "text",
            marginLeft,
            isLastSibling
          )
        );
        break;
      case "boolean":
        elems.push(
          this.getLabelAndValue(
            currentKey,
            parentKeyPath,
            data,
            parent,
            "boolean",
            marginLeft,
            isLastSibling
          )
        );
        break;
      default:
        elems.push(
          this.getLabelAndValue(
            currentKey,
            parentKeyPath,
            data,
            parent,
            "builtin",
            marginLeft,
            isLastSibling
          )
        );
    }
  }

  getCollapseIcon(marginLeft, currentKey, parentKeyPath) {
    let { collapsedNodes } = this.state;
    let { collapsible, marginLeftStep, styles } = this.props;
    return (
      <XStack top={-6} key={getKey(
        "collapse_and_remove",
        currentKey,
        parentKeyPath,
        marginLeft
      )}>
        <CollapseIcon
          collapsedNodes={collapsedNodes}
          marginLeft={marginLeft}
          collapsible={collapsible}
          currentKey={currentKey}
          styles={styles}
          isNodeCollapsed={isNodeCollapsed.bind(
            this,
            marginLeft,
            currentKey,
            marginLeftStep
          )}
          toggleNodeCollapsed={toggleNodeCollapsed.bind(
            this,
            marginLeft,
            currentKey,
            marginLeftStep
          )}
        />
      </XStack>
    );
  }

  getLabelAndValue(
    currentKey,
    parentKeyPath,
    value,
    parent,
    type,
    marginLeft,
    isLastSibling
  ) {
    const { styles } = this.props;
    if (isArray(parent)) {
      //for arrays we dont show keys
      return this.getLabel(
        value,
        type,
        marginLeft,
        isLastSibling,
        currentKey,
        parentKeyPath
      );
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
          onChange={this.onChange}
          editable={this.props.editable}
        />
      );
    }
  }

  getLabel(value, type, marginLeft, isLastSibling, currentKey, parentKeyPath, isCollasped?) {
    const { styles } = this.props;
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
        onChange={this.onChange}
        editable={this.props.editable}
      />
    );
  }

  render() {
    let elems = [];
    const { styles } = this.props;
    this.recursiveParseData("root", "", this.state.data, elems, 0, true);
    return <Stack f={1} style={styles.root}>{elems}</Stack>;
  }
}

export default JSONViewer