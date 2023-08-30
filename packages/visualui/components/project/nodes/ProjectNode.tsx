import React, { memo } from 'react';
import { Handle, Position } from 'reactflow';
import { MdFolderOpen } from "react-icons/md";
import { BsFileEarmark } from "react-icons/bs";
import { Button } from 'native-base'
import { useProjectStore } from '../../../store/ProjectStore';
import { postData } from '../../../api/GeneralApi';
import TemplateModal from '../../ui/sidebar/TemplateModal';

const colorTable = {
    "ui": '#F48FB1',
    "uiDir": '#CE93D8',
    "api": "#FFF59D",
    "apiDir": "#FFCC80",
    "device": "#80DEEA",
    "deviceDir": "#90CAF9"
}

const createElement = {
    "ui": "page",
    "api": "api",
    "device": "device"
}

const getColorBySection = (section: "ui" | "api" | "device", isDirectory) => {
    return colorTable[section + (isDirectory ? "Dir" : "")]
}

const createApiValidation = (text: string) => {
    if (!text?.length) throw "Name can't be empty"
    if (!/^[a-zA-Z0-9]+$/.test(text)) throw "Name only can be alphanumerical"
    if (text !== text.toLowerCase()) throw "Name only can be lowercased"
}

const createPageValidation = (text: string) => {
    if (!text?.length) throw "Name can't be empty"
    if (!/^[a-zA-Z0-9]+$/.test(text)) throw "Name only can be alphanumerical"
    if (/^\d/.test(text)) throw "Name can't start with number"
    if (!/^[A-Z]/.test(text)) throw "Name has to start with uppercase"
}

const onSubmitNewFlow = async (newFlowName: string) => {
    try {
        await fetch(`/api/v1/flows/cloudapi/${newFlowName}/create`)
    } catch (e) {
        throw ({
            errorMsg: 'Error generating file, already exist',
            errorType: 500,
            file: newFlowName
        })
    }
}

const onSubmitNewPage = async (newPageName: string, template?: string) => {
    try {
        postData('/api/v1/pages', { name: newPageName, templateName: template })
    } catch (e) {
        throw ({
            errorMsg: 'Error generating file, already exist',
            errorType: 500,
            file: newPageName
        })
    }
}

const ProjectNode = ({ data, id, selected }) => {

    const [inputText, setInputText] = React.useState("");
    const [inputErrorText, setInputErrorText] = React.useState();
    const [isTemplateModalVisible, setIsTemplateModalVisible] = React.useState(false);

    const onProjectChange = useProjectStore(state => state.onProjectChange);
    const triggerErrorMsg = (errMsg: string) => {
        setInputErrorText(errMsg)
        setTimeout(() => { // Show error for 5s
            setInputErrorText("");
        }, 5000);
    }

    const onCreateApi = async (text: string) => {
        setInputErrorText("")// reset error
        try {
            createApiValidation(text)
            try {
                await onSubmitNewFlow(text)
                setInputText("")
                onProjectChange()
            } catch (e) {
                if (e.errorType === 500) {
                    triggerErrorMsg(`"${text}" exists`)
                }
            }
        } catch (e) {
            triggerErrorMsg(e)
            console.error(e)
        }
    }

    const onCreatePage = async (text: string, template?: string) => {
        setInputErrorText("")// reset error
        try {
            createPageValidation(text)
            try {
                await onSubmitNewPage(text, template)
                setInputText("")
                setIsTemplateModalVisible(false)
                onProjectChange()
            } catch (e) {
                if (e.errorType === 500) {
                    triggerErrorMsg(`"${text}" exists`)
                }
            }
        } catch (e) {
            triggerErrorMsg(e)
            console.error(e)
        }
    }

    const onCreate = async (name: string, template?: string) => {
        switch (data.section) {
            case "ui":
                await onCreatePage(name, template)
                break;
            case "api":
                await onCreateApi(name)
                break;
            case "device":
                break;
            default:
                break;
        }
    }

    return (
        <>
            <div
                style={{
                    display: 'flex', minWidth: '200px', minHeight: data?.parent == null ? "90px" : "30px", flexDirection: 'column',
                    backgroundColor: "white",
                    border: selected ? "3px solid black" : "2px solid black",
                    borderRadius: 10,
                    textAlign: "center",
                    paddingTop: 18,
                }}
            >
                <div style={{
                    display: 'flex',
                    backgroundColor: getColorBySection(data.section, data.isDirectory) ?? "white",
                    marginTop: '-18px',
                    borderBottomLeftRadius: data?.parent == null ? 0 : 8,
                    borderBottomRightRadius: data?.parent == null ? 0 : 8,
                    borderTopLeftRadius: 8,
                    borderTopRightRadius: 8,
                    paddingBottom: '10px',
                    justifyContent: 'center',
                    borderBottom: data?.parent == null ? "2px solid black" : "0px solid black"
                }}>
                    <div style={{ display: 'flex', right: '15px', position: 'absolute', top: '5px' }}>
                        {
                            React.createElement(data?.isDirectory ? MdFolderOpen : BsFileEarmark, { size: 25, color: "black" })
                        }
                    </div>
                    {data.title ?
                        <span
                            style={{
                                margin: '4px',
                                fontSize: '14px',
                                color: 'black',
                                flex: 1,
                                textAlign: 'center',
                                alignSelf: 'center',
                                position: 'relative',
                                top: '4px',
                                fontFamily: 'Jost-Medium',
                                cursor: "pointer"
                            }}
                        >
                            {data.title}
                        </span>
                        : null
                    }
                </div>
                {
                    data.parent == null ?
                        <div style={{
                            display: 'flex', flexDirection: "row", margin: '20px 12px 24px 12px',
                        }}>
                            <NodeInput
                                onChange={(e) => setInputText(e.target.value)}
                                onClick={(e) => {
                                    e.stopPropagation()
                                }}
                                placeholder={`New ${createElement[data.section]} name`}
                                error={inputErrorText}
                            />
                            <Button variant="outline" colorScheme={'black'} _hover={{ colorScheme: "black" }} onPress={(e) => {
                                if (data.section == "ui") {
                                    setInputErrorText("")// reset error
                                    try {
                                        createPageValidation(inputText)
                                        setIsTemplateModalVisible(true) // Show modal if accepted
                                    } catch (e) {
                                        triggerErrorMsg(e)
                                        console.error(e)
                                    }
                                } else {
                                    onCreate(inputText)
                                }
                                e.stopPropagation()
                            }}>
                                +
                            </Button>
                        </div>
                        : null
                }
                {/* // HANDLES */}
                {
                    data?.parent ?
                        <Handle
                            type="target"
                            position={Position.Right}
                            style={{ background: '#555' }}
                        /> : null
                }
                {
                    data?.children.length ?
                        <Handle
                            type="source"
                            position={Position.Left}
                            style={{ background: '#555' }}
                        /> : null
                }
            </div >
            <TemplateModal
                message="Do you want to use a template?"
                modalVisible={isTemplateModalVisible}
                onDismiss={() => setIsTemplateModalVisible(false)}
                onAddEmpty={async () => await onCreate(inputText)}
                onSubmit={async (template) => await onCreate(inputText, template)}
                templates={{}}
            />
        </>
    );
};

export default memo(ProjectNode);

function NodeInput(props) {
    return (
        <div style={{ flexDirection: 'column', display: 'flex', position: 'relative' }}>
            <input
                {...props}
                style={{
                    fontFamily: 'Jost-Regular',
                    padding: '8px',
                    borderRadius: '5px',
                    border: !props.error ? '1px solid #CCCCCC' : '1px solid red',
                    display: 'flex',
                    flex: 1,
                    boxSizing: 'border-box',
                    marginRight: '8px',
                    ...props.style
                }}
            >
            </input>
            <p style={{ position: 'absolute', bottom: '-16px', fontSize: "8px", color: 'red' }}>{props.error}</p>
        </div>
    );
}
