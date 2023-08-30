import ApiMask from "./ApiMask";
import ResSendMask from "./ResSendMask";
import DeviceSub from "./DeviceSub";
import DevicePub from "./DevicePub";
import TopicSub from "./TopicSub";
import TopicPub from "./TopicPub";
import Debug from "./Debug";
import { generateId } from '../../flowslib';
import { filterCallback, restoreCallback } from '../../flowslib';
import LoadImage from "./opencv/LoadImage";
import BgrToGray from "./opencv/BgrToGray";
import Blur from "./opencv/Blur";
import OpenVideoStream from "./opencv/OpenVideoStream";
import BitwiseNot from "./opencv/BitwiseNot";
import GrayToBgr from "./opencv/GrayToBgr";
import Erode from "./opencv/Erode";
import Dilate from "./opencv/Dilate";
import DrawRectangle from "./opencv/DrawRectangle";
import BgrToHsv from "./opencv/BgrToHsv";
import BlobDetector from "./opencv/BlobDetector";
import NextFrame from "./opencv/NextFrame";
import Preview from "./opencv/Preview";
import ColorInRange from "./opencv/ColorInRange";
import Scale from "./opencv/Scale";


function CustomComponents(devicesList) {
    var curDevice = devicesList ? Object.keys(devicesList)[0] : ''
    return [
        {
            id: 'CloudApi',
            type: 'CallExpression',
            check: (node, nodeData) => ( 
                node.type == "CallExpression"
                && nodeData.param2?.startsWith('(req,res,) =>')
                && (nodeData.to == 'app.get' || nodeData.to == 'app.post')
            ),
            getComponent: ApiMask,
            filterChildren: filterCallback(),
            restoreChildren: restoreCallback(),
            getInitialData: () => { return { to: 'app.get', param1: '"/cloudapi/v1/"', param2: '(req,res,) =>' } }
        },
        {
            id: 'ApiResponse',
            type: 'CallExpression',
            check: (node, nodeData) => node.type == "CallExpression" && nodeData.to == 'res.send',
            getComponent: ResSendMask,
            getInitialData: () => { return { to: 'res.send', param1: '"Response here"' } }
        },
        {
            id: 'DeviceSub',
            type: 'CallExpression',
            check: (node, nodeData) => node.type == "CallExpression" && nodeData.to == 'deviceSub',
            getComponent: DeviceSub,
            filterChildren: filterCallback("4"),
            restoreChildren: restoreCallback("4"),
            getInitialData: () => { return { to: 'deviceSub', param1: '"' + curDevice + '"', param2: '"binary_sensor"', param3: '""', param4: null } }
        },
        {
            id: 'DevicePub',
            type: 'CallExpression',
            check: (node, nodeData) => node.type == "CallExpression" && nodeData.to == 'devicePub',
            getComponent: DevicePub,
            getInitialData: () => { return { to: 'devicePub', param1: '"' + curDevice + '"', param2: '"switch"', param3: '""', param4: '""' } }
        },
        {
            id: 'TopicSub',
            type: 'CallExpression',
            check: (node, nodeData) => node.type == "CallExpression" && nodeData.to == 'topicSub',
            getComponent: TopicSub,
            filterChildren: filterCallback(),
            restoreChildren: restoreCallback(),
            getInitialData: () => { return { to: 'topicSub', param1: '""', param2: null } }
        },
        {
            id: 'TopicPub',
            type: 'CallExpression',
            check: (node, nodeData) => node.type == "CallExpression" && nodeData.to == 'topicPub',
            getComponent: TopicPub,
            getInitialData: () => { return { to: 'topicPub', param1: '"/"', param2: '""' } }
        },
        {
            id: 'Debug',
            type: 'CallExpression',
            check: (node, nodeData) => node.type == "CallExpression" && nodeData.to == 'PlatformDebug',
            getComponent: Debug,
            getInitialData: () => { return { to: 'PlatformDebug', param1: '"' + generateId() + '"', param2: '""' } }
        },
        {
            id: 'LoadImage',
            type: 'CallExpression',
            check: (node, nodeData) => node.type == "CallExpression" && nodeData.to == 'ProtofyImage.loadImageAsync',
            getComponent: LoadImage,
            filterChildren: filterCallback("2"),
            restoreChildren: restoreCallback("2"),
            getInitialData: () => { return { to: 'ProtofyImage.loadImageAsync', param1: '"/project/services/front/frontend/assets/logo.png"', param2: null, param3: '"'+generateId()+'"', param4: 100 } }
        },
        {
            id: 'BgrToGray',
            type: 'CallExpression',
            check: (node, nodeData) => node.type == "CallExpression" && nodeData.to == 'ProtofyImage.bgrToGrayAsync',
            getComponent: BgrToGray,
            filterChildren: filterCallback("2"),
            restoreChildren: restoreCallback("2"),
            getInitialData: () => { return { to: 'ProtofyImage.bgrToGrayAsync', param1: 'img', param2: null, param3: '"'+generateId()+'"', param4: 100 } }
        },
        {
            id: 'Blur',
            type: 'CallExpression',
            check: (node, nodeData) => node.type == "CallExpression" && nodeData.to == 'ProtofyImage.blur',
            getComponent: Blur,
            filterChildren: filterCallback("2"),
            restoreChildren: restoreCallback("2"),
            getInitialData: () => { return { to: 'ProtofyImage.blur', param1: 'img', param2: null, param3: '"'+generateId()+'"', param4: 100 } }
        },
        {
            id: 'BitwiseNot',
            type: 'CallExpression',
            check: (node, nodeData) => node.type == "CallExpression" && nodeData.to == 'ProtofyImage.bitwiseNot',
            getComponent: BitwiseNot,
            filterChildren: filterCallback("2"),
            restoreChildren: restoreCallback("2"),
            getInitialData: () => { return { to: 'ProtofyImage.bitwiseNot', param1: 'img', param2: null, param3: '"'+generateId()+'"', param4: 100 } }
        },
        {
            id: 'GrayToBgr',
            type: 'CallExpression',
            check: (node, nodeData) => node.type == "CallExpression" && nodeData.to == 'ProtofyImage.grayToBgrAsync',
            getComponent: GrayToBgr,
            filterChildren: filterCallback("2"),
            restoreChildren: restoreCallback("2"),
            getInitialData: () => { return { to: 'ProtofyImage.grayToBgrAsync', param1: 'img', param2: null, param3: '"'+generateId()+'"', param4: 100 } }
        },
        {
            id: 'BlobDetector',
            type: 'CallExpression',
            check: (node, nodeData) => node.type == "CallExpression" && nodeData.to == 'ProtofyImage.blobDetector',
            getComponent: BlobDetector,
            filterChildren: filterCallback("2"),
            restoreChildren: restoreCallback("2"),
            getInitialData: () => { return { to: 'ProtofyImage.blobDetector', param1: 'img', param2: null, param3: '"'+generateId()+'"', param4:100,  param5:10000,param6: 0} }
        },
        {
            id: 'BgrToHsv',
            type: 'CallExpression',
            check: (node, nodeData) => node.type == "CallExpression" && nodeData.to == 'ProtofyImage.bgrToHsvAsync',
            getComponent: BgrToHsv,
            filterChildren: filterCallback("2"),
            restoreChildren: restoreCallback("2"),
            getInitialData: () => { return { to: 'ProtofyImage.bgrToHsvAsync', param1: 'img', param2: null, param3: '"'+generateId()+'"', param4: 100 } }
        },
        {
            id: 'Erode',
            type: 'CallExpression',
            check: (node, nodeData) => node.type == "CallExpression" && nodeData.to == 'ProtofyImage.erodeAsync',
            getComponent: Erode,
            filterChildren: filterCallback("2"),
            restoreChildren: restoreCallback("2"),
            getInitialData: () => { return { to: 'ProtofyImage.erodeAsync', param1: 'img', param2: null, param3: '"'+generateId()+'"', param4: 5, param5: 5,param6: 100 } }
        },
        {
            id: 'Dilate',
            type: 'CallExpression',
            check: (node, nodeData) => node.type == "CallExpression" && nodeData.to == 'ProtofyImage.dilateAsync',
            getComponent: Dilate,
            filterChildren: filterCallback("2"),
            restoreChildren: restoreCallback("2"),
            getInitialData: () => { return { to: 'ProtofyImage.dilateAsync', param1: 'img', param2: null, param3: '"'+generateId()+'"', param4: 5, param5: 5,param6: 100 } }
        },        
        {
            id: 'DrawRectangle',
            type: 'CallExpression',
            check: (node, nodeData) => node.type == "CallExpression" && nodeData.to == 'ProtofyImage.drawRectangle',
            getComponent: DrawRectangle,
            filterChildren: filterCallback("2"),
            restoreChildren: restoreCallback("2"),
            getInitialData: () => { return { to: 'ProtofyImage.drawRectangle', param1: 'img', param2: null, param3: '"'+generateId()+'"', param4: 100, param5:100, param6:10, param7:10, param8: `'{"r": 242,"g":177, "b":52, "a": 1}'`, param9:100} }
        },
        {
            id: 'OpenVideoStream',
            type: 'CallExpression',
            check: (node, nodeData) => node.type == "CallExpression" && nodeData.to == 'ProtofyImage.openVideoStream',
            getComponent: OpenVideoStream,
            filterChildren: filterCallback("2"),
            restoreChildren: restoreCallback("2"),
            getInitialData: () => { return { to: 'ProtofyImage.openVideoStream', param1: '"http://localhost:8080"', param2:null } }
        },
        {
            id: 'NextFrame',
            type: 'CallExpression',
            check: (node, nodeData) => node.type == "CallExpression" && nodeData.to == 'vc.next',
            getComponent: NextFrame,
            getInitialData: () => { return { to: 'vc.next' } }            
        },
        {
            id: 'ColorInRange',
            type: 'CallExpression',
            check: (node, nodeData) => node.type == "CallExpression" && nodeData.to == 'ProtofyImage.colorInRange',
            getComponent: ColorInRange,
            filterChildren: filterCallback("2"),
            restoreChildren: restoreCallback("2"),
            getInitialData: () => { return { to: 'ProtofyImage.colorInRange', param1: 'img', param2: null, param3: '"'+generateId()+'"', param4: 0, param5: 255, param6: 0, param7: 255, param8: 0, param9: 255, param10: false, param11: 11, param12: 2, param13: 100 } }
        },
        {
            id: 'Scale',
            type: 'CallExpression',
            check: (node, nodeData) => node.type == "CallExpression" && nodeData.to == 'ProtofyImage.scale',
            getComponent: Scale,
            filterChildren: filterCallback("2"),
            restoreChildren: restoreCallback("2"),
            getInitialData: () => { return { to: 'ProtofyImage.scale', param1: 'img', param2: null, param3: '"'+generateId()+'"', param4: 100, param5: 100} }
        },   
        {
            id: 'PreviewImage',
            type: 'CallExpression',
            check: (node, nodeData) => node.type == "CallExpression" && nodeData.to == 'ProtofyImage.previewImage',
            getComponent: Preview,
            filterChildren: filterCallback("2"),
            restoreChildren: restoreCallback("2"),
            getInitialData: () => { return { to: 'ProtofyImage.previewImage', param1: 'img', param2: null, param3: '"'+generateId()+'"', param4: 100 } }
        },  
    ]
}


export default (devicesList) => CustomComponents(devicesList)