import { getBasicHtmlWrapper } from './visualuiWrapper'

const htmlElements = [
    'div',
    'span',
    'br',
    'p',
    'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
    'a',
    'img',
    'input',
    'button',
    'form', 'input', 'textarea', 'select', 'option', 'label',
    'ul', 'ol', 'li',
    'table', 'thead', 'tbody', 'tr', 'th', 'td',
    'header', 'footer', 'nav', 'article', 'section', 'main', 'aside',
    'audio', 'video',
    'style', 'link',
    'iframe',
    'svg', 'circle', 'rect', 'path',
    'strong', 'em', 'u', 's', 'mark'
];

export default htmlElements.reduce((total, ele) => {
   total = {
    ...total,
   ...getBasicHtmlWrapper(ele)
   }
    return total
},{})