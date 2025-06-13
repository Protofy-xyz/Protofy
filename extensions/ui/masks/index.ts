import { navigate } from "./navigate";
import { fetch } from "./fetch";
import { setCurrentView } from "./changeCurrentView";
import { UIMasks } from "./uiMasks"
import onRender from "./onRender";
import ButtonSimple from "./ButtonSimple";
import Input from "./Input";
import SensorValue from "./SensorValue";
import ObjectPropValue from "./ObjectPropValue";
import ObjectForm from "./ObjectForm";
import Pressable from "./Pressable";

export default {
    dynamic: [
        ...UIMasks,
        setCurrentView,
        navigate,
        fetch
    ],
    code: [
        onRender,
        ButtonSimple,
        Pressable,
        SensorValue,
        ObjectPropValue,
        ObjectForm,
        Input
    ]
}