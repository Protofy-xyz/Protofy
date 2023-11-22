import DynamicMask from './DynamicMask';
import DynamicJsxMask from './DynamicJsxMask';

export default {
    CallExpression: DynamicMask,
    JsxElement: DynamicJsxMask
}