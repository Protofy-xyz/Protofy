import { actionFetch } from "./actionFetch";
import { actionNavigate } from "./actionNavigate";
import { setCurrentView } from "./changeCurrentView";
import onRender from "./onRender";

export default {
    dynamic: [
        actionFetch,
        actionNavigate,
        setCurrentView,
        //onRender
    ],
    code: [
        onRender
    ]
}