import { YStack, Text } from '@my/ui'
import { Tinted } from '../../components/Tinted'
import { createElement } from 'react'

export const TemplateCard = ({ template, isSelected, onPress }) => {
    return (
        <Tinted>
            <YStack
                id={"template-card-" + template.id}
                onPress={onPress}
                height={"180px"}
                width={"357px"}
                overflow='hidden'
                borderWidth={isSelected ? "$1" : "$0.5"}
                borderColor={isSelected ? "$color7" : "$gray8"}
                backgroundColor={isSelected ? "$color3" : ""}
                cursor='pointer'
                borderRadius={"$3"}
                justifyContent='center'
                alignItems='center'
                padding="$4"
            >
                {template.icon ? createElement(template.icon, { size: '35px'}) : null}
                <Text textAlign="center" marginBottom="$2" marginTop="$4">{template.name ?? template.id}</Text>
                <Text textAlign="center" fontWeight="300" opacity={0.4}>{template.description}</Text>
            </YStack>
        </Tinted>
    )
}
