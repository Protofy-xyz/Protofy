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

	const onSave = (content: any) => {
		visualuiPublisher('protofypanel', 'save', { path: filePath, content }) // Test publish to parent document
	}

	function handleEvent(event: any) {
		const eventData = event.data;
		const type = eventData.type;
		const payload = eventData.data;
		switch (type) {
			case "protofypanel-visualui-readSourcecode":
				setFilePath(payload.filePath)
				setSourceCode(payload.sourceCode)
				break;
			default:
				console.error("Could not handle event of type: ", type);
				break;
		}
	}

	useEffect(() => {
		window.addEventListener("message", handleEvent)
	}, [])

	// console.log('DEV: source code ', sourceCode)
	return (
		<TopicsProvider>
			{
				sourceCode ?
					<UIEditor sourceCode={sourceCode} onSave={onSave} />
					: null
			}
		</TopicsProvider>
	)
}