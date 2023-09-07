import React from 'react'
import { useEditorStore } from '../../../store/EditorStore'
// import { Input } from "native-base";
import styles from "../sidebar.module.css";
import TemplateModal from './TemplateModal';
import EditorApi from '../../../api/EditorApi'
// import { Text, HStack, Icon, Button } from "native-base";
// import { MaterialCommunityIcons } from '@expo/vector-icons';
import { FiX, FiTrash2, FiAlertTriangle } from 'react-icons/fi'
// import { Modal } from "native-base";

const PageMenu = ({ pages, sendMessage, currentPage }) => {
    const templatesEnabled = true
    const createPage = useEditorStore(state => state.createPage)
    const platformPages = ["demo", "editor", "flows", "device"]
    const [modalVisible, setModalVisible] = React.useState(false);

    const [newPageTitle, setNewPageTitle] = React.useState<string>("")
    const [templates, setTemplates] = React.useState<string>({})
    const [selectedTemplate, setSelectedTemplate] = React.useState<string>("")
    const [selectedSection, setSelectedSection] = React.useState<string>("")
    const [errorMsg, setErrorMsg] = React.useState<string>("")
    const [showDeleteModal, setShowDeleteModal] = React.useState<Boolean>(false)
    const [deletingPage, setDeletingPage] = React.useState<string>();

    const changePage = (page: string) => {
        // setCurrentPage(page)
    }
    const onAddPage = async (templateName?: string) => {
        try {
            await createPage(newPageTitle, templateName)
            changePage(newPageTitle)
            clearData()
        } catch (e) { console.error(`Error adding page. ${e}`) }
    }
    const clearData = () => {
        setModalVisible(false)
        setNewPageTitle("")
    }
    const startsWithNumber = (str: string) => {
        return /^\d/.test(str);
    }
    const containsUppercase = (str: string) => {
        return /[A-Z]/.test(str);
    }
    const onNameChange = (pageName) => {
        if (startsWithNumber(pageName)) {
            setErrorMsg('The name of the page cannot begin with a number.')
        } else if (containsUppercase(pageName)) {
            setErrorMsg('The name of the page cannot contain capital letters.')
        } else if (pageName.includes('-') || pageName.includes('_') || pageName.includes('*')) {
            setErrorMsg('The page name cannot contain the following symbols: "*", "-", "_"')
        } else {
            setErrorMsg('')
        }
        setNewPageTitle(pageName);
    }
    const onNameIntro = async () => {
        if (errorMsg) return
        else if (templatesEnabled) {
            setModalVisible(true)
        } else {
            await onAddPage()
        }
    }
    const readTemplates = async () => {
        // try {
        //     const templates = await EditorApi.getTemplates()
        //     const visibleTemplates = { 'HomeAndMenu': templates['HomeAndMenu'] } // TODO: TO MAKE ALL OTHER TEMPLATES WORK AND DELETE THIS FILTER. NOW ONLY WORKS "HOME AND MENU" GROUP.
        //     setTemplates(visibleTemplates)
        //     // setTemplates(templates)
        //     setSelectedSection(Object.keys(templates)[2])
        // } catch (e) { console.error(`Error reading templates. ${e}`) }
    }
    React.useEffect(() => {
        if (Object.keys[templates]) return
        // readTemplates()
    }, [])

    return (
        <div style={{ display: 'flex', flex: 1, flexDirection: 'column', maxHeight: window.outerHeight * 0.25 }}>
            <div style={{ padding: '20px 0px 0px 18px', fontSize: '18px', color: 'white' }}>Screens</div>
            <div style={{ display: 'flex', flex: 1, flexDirection: 'column', paddingBottom: '10px', overflow: 'auto', overflowX: 'hidden' }} className={styles.list}>
                {pages.filter(p => p).map((pageName, index) => (
                    <div
                        key={index}
                        className={styles.listRow}
                        onClick={() =>
                            sendMessage({ type: 'loadPage', data: { pageName } })
                        }
                    >
                        <div className={styles.iconLabel} style={{ width: '100%', fontSize: '12px', color: currentPage == pageName ? 'white' : 'gray', fontWeight: currentPage == pageName ? "500" : "300" }}>
                            {pageName}
                        </div>
                        {/* <FiX
                            style={{ paddingRight: '10px' }}
                            size="1.5em"
                            // onClick={() => { setShowDeleteModal(true); setDeletingPage(pageName) }}
                        /> */}
                    </div>
                ))}
            </div>
            {/* <input
                style={{ fontWeight: '400', paddingLeft: 22, marginTop: '30px', color: 'white' }}
            // placeholder={'New page +'}
            // variant="unstyled"
            // onSubmitEditing={() => onNameIntro()}
            // value={newPageTitle}
            // onChange={(e) => onNameChange(e.target.value)}
            /> */}
            {/* {errorMsg ? <HStack space='5px' mx='22px'>
                <Icon as={MaterialCommunityIcons} mt='1px' name="alert-circle-outline" color='error.600' />
                <Text color='error.600' fontSize='xs'>{errorMsg}</Text>
            </HStack> : null}
            <TemplateModal
                message="Do you want to use a template?"
                modalVisible={modalVisible}
                templates={templates}
                selectedTemplate={selectedTemplate}
                setSelectedTemplate={setSelectedTemplate}
                onDismiss={() => clearData()}
                onAddEmpty={() => onAddPage()}
                onSubmit={() => onAddPage(`${selectedSection}/${selectedTemplate}`)}
                selectedSection={selectedSection}
                setSelectedSection={setSelectedSection}
            /> */}
            {/* <DeletePageModal page={deletingPage} isVisible={showDeleteModal} onClose={() => { setShowDeleteModal(false); setDeletingPage()}}/> */}
        </div >
    )
}

export default PageMenu


// function DeletePageModal({page, isVisible, onClose}) {
//     const deletePage = useEditorStore(state => state.deletePage)
//     const setCurrentPage = useEditorStore(state => state.setCurrentPage)
//     const pages = useEditorStore(state => state.pages);

//     const onDeletePage = async () => {
//         await deletePage(page);
//         const newPages = pages.filter(p => p.title != page);
//         console.log('newPages: ', newPages)
//         const newCurrentPage = newPages?.length ? newPages[0].title : undefined;
//         setCurrentPage(newCurrentPage)
//         onClose()
//     }

//     return(
//         <Modal isOpen={isVisible} onClose={onClose} safeAreaTop={true}>
//             <Modal.Content maxWidth="350" px={30} py={36}>
//                 <Text as="bold" fontSize={18}>Are you sure you want to delete page "{page}"?</Text>
//                 <Button.Group space={2}>
//                     <Button flex={1} variant="outline" onPress={onClose}>Cancel</Button>
//                     <Button flex={1} onPress={onDeletePage} >Delete</Button>
//                 </Button.Group>
//             </Modal.Content>
//         </Modal>
//     )
// }