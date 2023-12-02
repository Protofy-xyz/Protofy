
import { XStack, Stack, StackProps } from 'tamagui';

export const InteractiveIcon = ({ Icon, disabled=false, size=18, ...props }:{Icon:any, size?:number} & StackProps) => {
  return (
    <XStack cursor={disabled?"dafault":"pointer"} {...props}>
      <Stack
        o={0.5}
        br={"$5"} p={"$2"}
        als="flex-start" cursor={disabled?"dafault":"pointer"}
        pressStyle={!disabled?{ o: 0.7 }:{}}
        hoverStyle={!disabled?{ o: 1, bc: "$color5" }:{}
      }>
        <Icon size={size} color={disabled?'var(--gray9)':'var(--color9)'} strokeWidth={2}  />
      </Stack>
    </XStack>
  );
};
