import React, { useEffect, useState } from "react"
import UIEditor from './components/UIEditor'
import { TopicsProvider } from "react-topics";
import { API } from 'protolib'

export function visualuiPublisher(target, action, payload) {
	const source = "visualui"
	let message = {
		// requestId
		type: `${source}-${target}-${action}`,
		data: payload
	}
	window.parent.postMessage(message, "*")
}


type Props = {
	userComponents: any,
	_sourceCode?: string,
	_resolveComponentsDir?: string,
	_currentPage?: string,
	isVSCode?: boolean,
	onSave?: Function
}

export default ({ userComponents = {}, isVSCode = false, _sourceCode = "", _resolveComponentsDir = "@/uikit", _currentPage = "", onSave = () => null }: Props) => {
	const [currentPage, setCurrentPage] = useState(_currentPage);
	const [resolveComponentsDir, setResolveComponentsDir] = useState(_resolveComponentsDir);
	const [sourceCode, setSourceCode] = useState(_sourceCode);

	async function handleEvent(event: any) {
		const eventData = event.data;
		const type = eventData.type;
		const payload = eventData.data;

		switch (type) {
			case "protofypanel-visualui-init":
				setSourceCode(payload.sourceCode)
				setResolveComponentsDir(payload.resolveComponentsDir)
				setCurrentPage(payload.pages ? payload.pages[0] : '')
				break;
			case "protofypanel-visualui-read-response":
				setSourceCode(payload.sourceCode)
				break;
			default:
				console.error("Could not handle event of type: ", type);
				break;
		}
	}

	const onSendMessage = async (event: any) => {
		const type = event.type
		const payload = event.data
		switch (type) {
			case "loadPage":
				const pagePath = payload.pageName
				setCurrentPage(pagePath)
				visualuiPublisher('protofypanel', 'read', { file: pagePath }) // Test publish to parent document
				break;
			case "save":
				const content = payload.content
				if (isVSCode) {
					visualuiPublisher('protofypanel', 'write', { path: currentPage, content }) // Test publish to parent document
				} else {
					onSave(content)
				}
				break;
		}
	}

	useEffect(() => {
		window.addEventListener("message", handleEvent)
		visualuiPublisher('protofypanel', 'ready', {})
	}, [])


	return (
		<TopicsProvider>
			{
				sourceCode ?
					<UIEditor
						sourceCode={sourceCode}
						currentPage={currentPage}
						userComponents={userComponents}
						sendMessage={onSendMessage}
						resolveComponentsDir={`${resolveComponentsDir}/`}
					/>
					: null
			}
		</TopicsProvider>
	)
}