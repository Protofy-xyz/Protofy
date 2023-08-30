export default class Color {
    color: string
    weight: string
    constructor(color: string, weight?: string) {
        this.color = color
        if (color.includes('.')) {
            const parts = color.split('.')
            this.color = parts[0]
            this.weight = parts[1]
        } else {
            this.weight = this.color == 'light' ? '100' : '600'
        }
    }
    static parse(color: string, weight?: string) {
        return new Color(color, weight)
    }
    toColor(theme?) {
        if (this.color.startsWith('#')) return this.color
        const weight = this.getWeight()
        if (theme && theme.colors[this.color]) return theme.colors[this.color][weight]
        return this.color + '.' + weight
    }
    getWeight() {
        return this.weight
    }
}

export const toColor = (color: string, theme?) => Color.parse(color).toColor(theme)