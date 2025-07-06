import { useState } from 'react'
import { API } from 'protobase'
import { useToastController } from '@my/ui'
import { DashboardCard } from '../DashboardCard'
import { Rules } from '../autopilot/Rules'

export const RulesCard = ({ value, actions }) => {
  const toast = useToastController()

  const [rules, setRules] = useState(() =>
    value.getDataArray().map((state) =>
      Object.values(state).join(' ')
    )
  )

  const [loadingIndex, setLoadingIndex] = useState(-1)
  const getRuleActionNameEndsWith = (ending) => {
    const ruleActionNames = actions?.getActions().map((action) => action.getData(true)?.name)
    return ruleActionNames.find((name) => name.endsWith(ending))
  }

  // Añadir regla
  const onAddRule = async (e, newRule) => {
    e.preventDefault()
    const indexForLoading = rules.length
    setLoadingIndex(indexForLoading)

    const addAction = getRuleActionNameEndsWith('add_rule')
    if (!addAction) {
      toast.show('No add rule action found')
      setLoadingIndex(-1)
      return
    }

    try {
      await API.get(`/api/v1/automations/${addAction}?rule=${newRule}`)
      setRules([...rules, newRule])
    } catch (error) {
      toast.show(`Error adding rule: ${error.message}`)
    } finally {
      setLoadingIndex(-1)
    }
  }

  const onDeleteRule = async (index) => {
    setLoadingIndex(index)

    const removeAction = getRuleActionNameEndsWith('remove_rule')
    if (!removeAction) {
      toast.show('No remove rule action found')
      setLoadingIndex(-1)
      return
    }

    try {
      await API.get(`/api/v1/automations/${removeAction}?rule=${index}`)
      setRules(rules.filter((_, i) => i !== index))
    } catch (error) {
      toast.show(`Error deleting rule: ${error.message}`)
    } finally {
      setLoadingIndex(-1)
    }
  }

  return (
    <DashboardCard title="rules" id="rules">
      <Rules
        rules={rules}
        onAddRule={onAddRule}
        onDeleteRule={onDeleteRule}
        loadingIndex={loadingIndex}
      />
    </DashboardCard>
  )
}
