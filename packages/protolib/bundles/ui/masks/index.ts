import { actionFetch } from "./actionFetch";
import { actionNavigate } from "./actionNavigate";
import { navigate } from "./navigate";
import { fetch } from "./fetch";
import { setCurrentView } from "./changeCurrentView";
import onRender from "./onRender";
import ButtonSimple from "./ButtonSimple";
import uiMasks from "./uiMasks.json"

export default {
    dynamic: [
        ...uiMasks,
        actionFetch,
        actionNavigate,
        setCurrentView,
        navigate,
        fetch
    ],
    code: [
        onRender,
        ButtonSimple
    ]
}