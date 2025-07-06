
import { XStack, Stack, StackProps } from '@my/ui';

export const InteractiveIcon = ({ Icon, IconColor = 'var(--color8)', DisabledIconColor = 'var(--gray9)', disabled = false, size = 18, ...props }: { IconColor?: string, DisabledIconColor?: string, Icon: any, size?: number } & StackProps) => {
  let mode = "react"
  if (typeof Icon == 'string') {
    mode = "string"
  }

  return (
    <XStack cursor={disabled ? "dafault" : "pointer"} {...props}>

      <XStack
        ai='center' jc='center'
        o={0.8}
        br={"$5"} p={"$2"}
        als="flex-start" cursor={disabled ? "dafault" : "pointer"}
        pressStyle={!disabled ? { o: 0.7 } : {}}
        hoverStyle={!disabled ? { o: 1, bc: "$color5" } : {}
        }>
                {props.children}
        {mode == "react" && <Icon size={size} color={disabled ? DisabledIconColor : IconColor} strokeWidth={2} />}
        {mode == "string" && <div style={{
                    width: size+"px",
                    height: size+"px",
                    backgroundColor: IconColor,
                    maskImage: `url(/public/icons/${Icon}.svg)`,
                    WebkitMaskImage: `url(/public/icons/${Icon}.svg)`,
                    maskRepeat: "no-repeat",
                    WebkitMaskRepeat: "no-repeat",
                    maskSize: "contain",
                    WebkitMaskSize: "contain",
                    maskPosition: "center",
                    WebkitMaskPosition: "center"
                }} />}
      </XStack>
    </XStack>
  );
};
