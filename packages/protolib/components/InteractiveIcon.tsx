
import { XStack, Stack, StackProps } from 'tamagui';

export const InteractiveIcon = ({ Icon, ...props }:{Icon:any} & StackProps) => {
  return (
    <XStack cursor="pointer" {...props}>
      <Stack
        o={0.5}
        br={"$5"} p={"$2"}
        als="flex-start" cursor='pointer'
        pressStyle={{ o: 0.7 }}
        hoverStyle={{ o: 1, bc: "$color5" }
      }>
        <Icon size={18} color={'var(--color9)'} strokeWidth={2}  />
      </Stack>
    </XStack>
  );
};
