"use client"
import React, { useEffect, useState } from "react"
import UIEditor from './components/ui/UIEditor'
import { TopicsProvider } from "react-topics";

export function visualuiPublisher(target, action, payload) {
	const source = "visualui"
	let message = {
		// requestId
		type: `${source}-${target}-${action}`,
		data: payload
	}
	window.parent.postMessage(message, "*")
}

export default () => {
	const [sourceCode, setSourceCode] = useState();
	const [filePath, setFilePath] = useState();
	const [pages, setPages] = useState();
	const [currentPage, setCurrentPage] = useState();

	const onSave = (content: any) => {
		visualuiPublisher('protofypanel', 'save', { path: filePath, content }) // Test publish to parent document
	}
	const onSendMessage = (event) => {
		const type = event.type
		const payload = event.data
		switch (type) {
			case "loadPage":
				const pagePath = payload.pageName
				setCurrentPage(pagePath)
				visualuiPublisher('protofypanel', 'readSourcecode', { file: pagePath }) // Test publish to parent document
		}
	}

	function handleEvent(event: any) {
		const eventData = event.data;
		const type = eventData.type;
		const payload = eventData.data;

		switch (type) {
			case "protofypanel-visualui-readSourcecode-response":
				setFilePath(payload.filePath)
				setSourceCode(payload.sourceCode)
				break;
			case "protofypanel-visualui-listPages-response":
				const pageList = payload.pages
				setPages(pageList)
				setCurrentPage(pageList[0])
				visualuiPublisher('protofypanel', 'readSourcecode', { file: pageList[0] })
				break;
			default:
				console.error("Could not handle event of type: ", type);
				break;
		}
	}
	useEffect(() => {
		window.addEventListener("message", handleEvent)
		visualuiPublisher('protofypanel', 'listPages', { directory: '/packages/web/app' })
	}, [])

	return (
		<TopicsProvider>
			{
				sourceCode ?
					<UIEditor sourceCode={sourceCode} onSave={onSave} sendMessage={onSendMessage} currentPage={currentPage} pages={pages} />
					: null
			}
		</TopicsProvider>
	)
}