import { API } from 'protobase'
import { useEffect, useState } from 'react'
import { useUpdateEffect } from 'usehooks-ts'
import { AutopilotEditor } from './AutopilotEditor'


export const RuleEditor = ({ board, actions, states, cardData, setCardData, compiler, onCodeChange, extraCompilerData = {} }) => {
  const [hasCode, setHasCode] = useState(cardData.rulesCode !== undefined)
  const [value, setValue] = useState()
  const [key, setKey] = useState(0)

  const getRulesCode = async (rules) => {
    if (rules && rules.length > 0) {
      const boardStates = states?.[board.name] ?? {}
      //remove cardData.name key from boardStates
      if (cardData.type == 'value') delete boardStates[cardData.name]
      setHasCode(false)
      const code = await API.post('/api/core/v1/autopilot/' + compiler + '?debug=true', { board: board.name, states: boardStates, rules: rules, card: cardData, ...extraCompilerData })
      if (!code?.data?.jsCode) return {}
      setHasCode(true)
      return {
        rulesCode: code.data.jsCode,
        rulesExplained: code.data?.explanation
      }
    }
    return {rulesCode: '//empty rules', rulesExplained: 'The rules are empty'}
  }

  useEffect(() => {
    if (cardData.rulesCode) {
      try {
        const value = onCodeChange(cardData, states)
        console.log('got value: ', value)
        setValue(value)
      } catch (e) { }
    }
  }, [cardData.rulesCode])

  return <AutopilotEditor
    key={key}
    cardData={cardData}
    board={board}
    panels={cardData.type == 'value' ? ['states'] : ['actions', 'states']}
    setRulesCode={(rulesCode) => {
      setCardData({
        ...cardData,
        rulesCode
      })
    }}
    rulesCode={cardData.rulesCode}
    actions={actions}
    states={states}
    rules={cardData.rules ?? []}
    value={value}
    setRules={async (rules) => {
      const newData = {
        ...cardData,
        ...(await getRulesCode(rules)),
        rules
      }
      setKey(prev => prev + 1)
      setCardData(newData)
    }}
    valueReady={hasCode} />
}
