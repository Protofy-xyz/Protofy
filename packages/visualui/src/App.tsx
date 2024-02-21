import React, { useEffect, useState } from "react"
import UIEditor from './components/UIEditor'
import { TopicsProvider } from "react-topics";
import { formatText } from "./utils/utils";
import { useVisualUiAtom } from "./visualUiHooks";

type Props = {
	userPalettes: any,
	_sourceCode?: string,
	_resolveComponentsDir?: string,
	_currentPage?: string,
	isVSCode?: boolean,
	onSave?: Function,
	metadata?: any
  contextAtom: any, 
}

export default ({ userPalettes = {}, _sourceCode = "", _resolveComponentsDir = "@/uikit", _currentPage = "", onSave = () => null, metadata = {}, contextAtom }: Props) => {
  const [_, setContext] = useVisualUiAtom(contextAtom)
	const [currentPage, setCurrentPage] = useState(_currentPage);

	const onSendMessage = async (event: any) => {
		const type = event.type
		const payload = event.data
		switch (type) {
			case "loadPage":
				const pagePath = payload.pageName
				setCurrentPage(pagePath)
				break;
			case "save":
				const content = payload.content
				onSave(formatText(content))
				break;
		}
	}

	return (
		<TopicsProvider>
			{
				_sourceCode ?
					<UIEditor
						sourceCode={_sourceCode}
						currentPage={currentPage}
						userPalettes={userPalettes}
						sendMessage={onSendMessage}
						resolveComponentsDir={`${_resolveComponentsDir}/`}
						metadata={metadata}
            setContext={setContext}
					/>
					: null
			}
		</TopicsProvider>
	)
}