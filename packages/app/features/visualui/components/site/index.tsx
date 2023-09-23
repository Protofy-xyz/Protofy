import { DefaultLayout } from '../../../../layout/DefaultLayout'
import { getComponentWrapper, BasicPlaceHolder } from 'protolib'

export default {
    ...(getComponentWrapper("@/layout/DefaultLayout"))(DefaultLayout, 'EyeOff', 'DefaultLayout', {}, {}, { children: <BasicPlaceHolder /> }),
}