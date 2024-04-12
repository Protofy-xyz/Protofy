import { actionFetch } from "./actionFetch";
import { actionNavigate } from "./actionNavigate";
import { navigate } from "./navigate";
import { setCurrentView } from "./changeCurrentView";
import onRender from "./onRender";

export default {
    dynamic: [
        actionFetch,
        actionNavigate,
        setCurrentView,
        navigate
    ],
    code: [
        onRender
    ]
}