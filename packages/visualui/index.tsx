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
	const [pages, setPages] = useState();
	const [currentPage, setCurrentPage] = useState();

	const onSave = (content: any) => {
		visualuiPublisher('protofypanel', 'write', { path: currentPage, content }) // Test publish to parent document
	}
	const onSendMessage = (event: any) => {
		const type = event.type
		const payload = event.data
		switch (type) {
			case "loadPage":
				const pagePath = payload.pageName
				setCurrentPage(pagePath)
				visualuiPublisher('protofypanel', 'read', { file: pagePath }) // Test publish to parent document
		}
	}

	function handleEvent(event: any) {
		const eventData = event.data;
		const type = eventData.type;
		const payload = eventData.data;

		switch (type) {
			case "protofypanel-visualui-init":
					setSourceCode(payload.sourceCode)
					setPages(payload.pages??[])
					setCurrentPage(payload.pages?payload.pages[0]:'')
				break;
			case "protofypanel-visualui-read-response":
				setSourceCode(payload.sourceCode)
				break;
			default:
				console.error("Could not handle event of type: ", type);
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
					<UIEditor sourceCode={sourceCode} onSave={onSave} sendMessage={onSendMessage} currentPage={currentPage} pages={pages} />
					: null
			}
		</TopicsProvider>
	)
}