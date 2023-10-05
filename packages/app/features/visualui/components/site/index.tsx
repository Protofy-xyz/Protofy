import { DefaultLayout } from '../../../../layout/DefaultLayout'
import { getComponentWrapper, BasicPlaceHolder } from 'protolib/visualui/visualuiWrapper'

export default {
    ...(getComponentWrapper("@/layout/DefaultLayout"))(DefaultLayout, 'EyeOff', 'DefaultLayout', {}, {}, { children: <BasicPlaceHolder /> }),
}