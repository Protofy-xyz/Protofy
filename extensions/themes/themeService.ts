import { API } from "protobase";

export default class ThemeService {
    constructor() { }
    static async selectTheme({themeId, token}) {
        let res
        res = await API.post(`/api/core/v1/settings/theme?token=${token}`, { name: "theme", value: themeId })

        if (res.isError) {
            res = await API.post(`/api/core/v1/settings?token=${token}`, { name: "theme", value: themeId })
        }
        return res
    }
}