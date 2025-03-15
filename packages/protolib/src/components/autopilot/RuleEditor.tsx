import { API } from 'protobase'
import { useEffect, useState } from 'react'
import { useUpdateEffect } from 'usehooks-ts'
import { AutopilotEditor } from './AutopilotEditor'

export const RuleEditor = ({ states, cardData, setCardData }) => {
    const [hasCode, setHasCode] = useState(cardData.rulesCode !== undefined)
    const [value, setValue] = useState()
  
    const getRulesCode = async (force?) => {
      if ((!hasCode || force) && cardData.rules && cardData.rules.length > 0) {
        setHasCode(false)
        const code = await API.post('/api/core/v1/autopilot/getValueCode', { states, rules: cardData.rules })
        if (!code?.data?.jsCode) return
        setCardData({
          ...cardData,
          rulesCode: code.data.jsCode
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
          console.log('new rules code, executing...', cardData.rulesCode, states)
          const wrapper = new Function('states', `
            ${cardData.rulesCode}
            return reduce_state_obj(states);
          `);
          let value = wrapper(states);
          console.log('got value: ', value)
          setValue(value)
        } catch(e) {}
  
      }
    }, [cardData.rulesCode])
  
    useUpdateEffect(() => {
      getRulesCode(true)
    }, [cardData.rules])
  
    return <AutopilotEditor setRulesCode={(rulesCode) => {
      setCardData({
        ...cardData,
        rulesCode
      })
    }} rulesCode={cardData.rulesCode} data={states} rules={cardData.rules ?? []} value={value} onDeleteRule={(index) => {
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
  