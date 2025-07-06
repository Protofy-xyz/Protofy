import { useEffect, useState } from 'react';
import { CenterCard } from '@extensions/services/widgets';
import { Text, YStack, Label, Switch } from '@my/ui';
import { Bot } from '@tamagui/lucide-icons';

export const AutopilotCard = ({ actions, onRun, state, agentName }) => {
    const autopilotState = state?.states.find(s => s.name === "autopilot")?.value;
    const [checked, setChecked] = useState(autopilotState);

    const handleToggle = (value) => {
        setChecked(value);
        const actionName = value ? agentName+'/autopilot/on' : agentName+'/autopilot/off';
        const action = actions?.getActionByName(actionName).getData(true);
        if (action) {
            onRun(action, {})
        }
    };

    useEffect(() => {
        setChecked(autopilotState === "ON");
    }, [autopilotState]);

    return (
        <CenterCard title="Autopilot" id="autopilot">
            <YStack f={1} width="100%" alignItems="center" justifyContent="center">
                <Bot color="var(--color7)" size={48} strokeWidth={1.75} />
                
                <Text mt={10} fontSize={48} fontWeight="bold" color="$primary">
                    {autopilotState}
                </Text>
                <YStack mt={5} alignItems="center">
                    <Label htmlFor="autopilot-switch">Autopilot</Label>
                    <Switch 
                        id="autopilot-switch"
                        size="$4"
                        checked={checked} 
                        onCheckedChange={handleToggle} 
                        className="no-drag" // Hace que el switch no sea draggable
                    >
                        <Switch.Thumb className="no-drag" animation="quick" />
                    </Switch>
                </YStack>
            </YStack>
        </CenterCard>
    );
};