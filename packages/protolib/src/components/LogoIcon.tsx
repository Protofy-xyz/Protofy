import { StackProps, YStack } from 'tamagui'


export const LogoIcon = ({ children, ...props }: StackProps) => {
  return (
    <YStack
      tag="span"
      className="unselectable"
      alignSelf="center"
      marginVertical={-10}
      pressStyle={{
        opacity: 1,
        scaleY: -1,
      }}

      hoverStyle={{
        opacity: 0.8
      }}

      {...props}
    >
        {children}
    </YStack>
  )
}