
import { XStack, Stack, StackProps } from 'tamagui';

export const InteractiveIcon = ({ Icon, IconColor='var(--color8)', DisabledIconColor='var(--gray9)',  disabled=false, size=18, ...props }:{IconColor?: string, DisabledIconColor?: string, Icon:any, size?:number} & StackProps) => {
  return (
    <XStack cursor={disabled?"dafault":"pointer"} {...props}>
      <Stack
        opacity={0.8}
        borderRadius={"$5"} padding={"$2"}
        alignSelf="flex-start" cursor={disabled?"dafault":"pointer"}
        pressStyle={!disabled?{ opacity: 0.7 }:{}}
        hoverStyle={!disabled?{ opacity: 1, backgroundColor: "$color5" }:{}
      }>
        <Icon size={size} color={disabled?DisabledIconColor:IconColor} strokeWidth={2}  />
      </Stack>
    </XStack>
  );
};
