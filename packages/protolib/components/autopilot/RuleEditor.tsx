import { API } from 'protobase'
import { useEffect, useState } from 'react'
import { useUpdateEffect } from 'usehooks-ts'
import { AutopilotEditor } from './AutopilotEditor'

export const RuleEditor = ({ board, actions, states, cardData, setCardData, compiler, onCodeChange, extraCompilerData={} }) => {
    const [hasCode, setHasCode] = useState(cardData.rulesCode !== undefined)
    const [value, setValue] = useState()
  
    const getRulesCode = async (force?) => {
      if ((!hasCode || force) && cardData.rules && cardData.rules.length > 0) {
        setHasCode(false)
        const code = await API.post('/api/core/v1/autopilot/'+compiler+'?debug=true', { board: board.name, states, rules: cardData.rules, ...extraCompilerData })
        if (!code?.data?.jsCode) return
        setCardData({
          ...cardData,
          rulesCode: code.data.jsCode,
          rulesExplained: code.data?.explanation
        })
        setHasCode(true)
      }
    }
  
    useEffect(() => {
      getRulesCode()
    }, [])
  
    useEffect(() => {
      if (cardData.rulesCode) {
        try {
          const value = onCodeChange(cardData, states)
          console.log('got value: ', value)
          setValue(value)
        } catch(e) {}
  
      }
    }, [cardData.rulesCode])
  
    useUpdateEffect(() => {
      getRulesCode(true)
    }, [cardData.rules])
  
    return <AutopilotEditor
    cardData={cardData}
    board={board}
    panels={cardData.type == 'value' ? ['states'] : ['actions', 'states']}
    setRulesCode={(rulesCode) => {
      setCardData({
        ...cardData,
        rulesCode
      })
    }} rulesCode={cardData.rulesCode} actions={actions} states={states} rules={cardData.rules ?? []} value={value} onDeleteRule={(index) => {
      setCardData({
        ...cardData,
        rules: cardData.rules?.filter((_, i) => i !== index)
      });
    }} onAddRule={(e, rule) => {
      setCardData({
        ...cardData,
        rules: cardData.rules ? [...cardData.rules, rule] : [rule]
      });
    }} valueReady={hasCode} />
  }
  