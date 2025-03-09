import { useState, useRef } from 'react';
import { API } from 'protobase';
import { Button, Spinner, TextArea, XStack, YStack, useToastController } from '@my/ui';
import { Trash, Plus } from '@tamagui/lucide-icons';
import { DashboardCard } from '../DashboardCard';

const minHeight = 49;
const maxHeight = 220;

const CustomTextArea = ({ ...props }) => <TextArea
    width="100%"
    placeholder="Rule Value..."
    multiline
    size="$4"
    w="100%"
    minHeight={minHeight}
    //@ts-ignore
    onMouseDown={(e) => e.stopPropagation()}
    style={{
        textAlignVertical: "top",
        overflowX: "hidden",
        ...props.style
    }}
    {...props}
/>

export const RulesCard = ({ value, actions }) => {
    const dataArray = value.getDataArray();
    const addIndex = dataArray.length;
    const toast = useToastController()
    const scrollRef = useRef(null);

    const [heights, setHeights] = useState(dataArray.map(() => minHeight).concat(() => minHeight));
    const [loading, setLoading] = useState(-1);
    const [newRule, setNewRule] = useState("");

    const handleHeightChange = (index, newHeight) => {
        try {
            setHeights((prev) => {
                const updatedHeights = [...prev];
                updatedHeights[index] = Math.max(minHeight, newHeight > maxHeight ? maxHeight : newHeight);
                return updatedHeights;
            });
        } catch (e) { }
    };

    const getRuleActionNameEndsWith = (ending) => {
        const ruleActionNames = actions?.getActions().map(action => action.getData(true)?.name);
        return ruleActionNames.find(name => name.endsWith(ending));
    }

    const onDelete = async (index) => {
        setLoading(index);
        const removeAction = getRuleActionNameEndsWith("remove_rule");
        if (!removeAction) {
            toast.show("No remove rule action found");
            setLoading(-1);
            return;
        }
        await API.get(`/api/v1/automations/${removeAction}?rule=${index}`)
        setLoading(-1);
    }

    const onAddRule = async (e) => {
        e.preventDefault();
        setLoading(addIndex);
        const addAction = getRuleActionNameEndsWith("add_rule");
        if (!addAction) {
            toast.show("No add rule action found");
            setLoading(-1);
            return;
        }
        await API.get(`/api/v1/automations/${addAction}?rule=${newRule}`)
        setNewRule("");
        setLoading(-1);
        if (scrollRef.current) {
            setTimeout(() => scrollRef.current.scrollTo({ top: 9999999, behavior: 'smooth' }), 500)
        }
    }

    return (
        <DashboardCard title={"rules"} id={"rules"}>
            <YStack height={'100%'} f={1} w="100%">
                <div style={{ overflowY: "auto", flex: 1, display: 'flex', flexDirection: 'column' }} ref={scrollRef}>
                    {dataArray.map((state, i) => (
                        <XStack ai="center" gap="$2" key={i} mb="$2">
                            <CustomTextArea
                                disabled
                                placeholder="Rule Value..."
                                onContentSizeChange={(event) => {
                                    handleHeightChange(i, event.nativeEvent.contentSize.height);
                                }}
                                style={{
                                    height: heights[i],
                                    overflowY: heights[i] < maxHeight ? "hidden" : "auto"
                                }}
                                value={Object.keys(state).reduce((total, current) => `${total}${state[current]} `, '')}
                            />
                            <Button
                                disabled={loading === i}
                                onMouseDown={(e) => e.stopPropagation()}
                                theme='red'
                                bg="transparent"
                                color="$red9"
                                circular
                                scaleIcon={1.2}
                                icon={loading == i ? Spinner : Trash}
                                onPress={() => onDelete(i)}
                            />
                        </XStack>
                    ))}
                </div>
                <XStack ai="center" gap="$2" mb="$2" mt="$4" mr={scrollRef?.current?.scrollHeight > scrollRef?.current?.clientHeight ? "6px" : "0px"}>
                    <CustomTextArea
                        theme="blue"
                        placeholder="Add new rule..."
                        onContentSizeChange={(event) => {
                            handleHeightChange(addIndex, event.nativeEvent.contentSize.height);
                        }}
                        onChangeText={(text) => setNewRule(text)}
                        onKeyPress={(e) => e.key === "Enter" && !e.shiftKey && onAddRule(e)}
                        value={newRule}
                        style={{
                            height: heights[addIndex],
                            overflowY: heights[addIndex] < maxHeight ? "hidden" : "auto"
                        }}
                    />
                    <Button
                        disabled={loading === addIndex || newRule.length < 3}
                        onMouseDown={(e) => e.stopPropagation()}
                        bg={newRule.length > 2 ? "$blue9" : "$gray6"}
                        theme={"blue"}
                        color={newRule.length > 2 ? "$background" : "$gray9"}
                        hoverStyle={{
                            backgroundColor: "$blue10"
                        }}
                        circular
                        icon={loading === addIndex ? Spinner : Plus}
                        scaleIcon={1.4}
                        onPress={onAddRule}
                    />
                </XStack>
            </YStack>
        </DashboardCard>
    );
};
