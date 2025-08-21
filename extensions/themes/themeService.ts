import { API } from "protobase";

export default class ThemeService {
    constructor() { }
    static async selectTheme({themeId, token, accent}) {
        let res
        res = await API.post(`/api/core/v1/settings/theme?token=${token}`, { name: "theme", value: themeId })

        if (res.isError) {
            res = await API.post(`/api/core/v1/settings?token=${token}`, { name: "theme", value: themeId })
        }
        console.log('Setting accent: ', accent)
        let res2
        res2 = await API.post(`/api/core/v1/settings/theme.accent?token=${token}`, { name: "theme.accent", value: accent ?? 'green' })
        if(res2.isError) {
            res2 = await API.post(`/api/core/v1/settings?token=${token}`, { name: "theme.accent", value: accent ?? 'green' })
        }
        return res
    }
}