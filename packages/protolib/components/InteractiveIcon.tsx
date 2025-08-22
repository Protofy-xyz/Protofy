import { XStack, StackProps } from '@my/ui';

export const InteractiveIcon = ({ Icon, IconColor = 'var(--color10)', DisabledIconColor = 'var(--gray9)', disabled = false, size = 18, ...props }: { IconColor?: string, DisabledIconColor?: string, Icon: any, size?: number } & StackProps) => {
  let mode = "react"
  if (typeof Icon == 'string') {
    mode = "string"
  }

  return (
    <XStack
      {...props}
      cursor={disabled ? 'default' : 'pointer'}
      ai="center"
      jc="center"
      br="$5"
      p="$2"
      o={0.8}
      als="flex-start"
      hoverStyle={!disabled ? { o: 1, bc: '$color5' } : {}}
      pressStyle={!disabled ? { o: 0.7 } : {}}
    >
      {props.children}

      {mode === 'react' && (
        <Icon size={size} color={disabled ? DisabledIconColor : IconColor} strokeWidth={2} />
      )}

      {mode === 'string' && (
        <div
          style={{
            width: size + 'px',
            height: size + 'px',
            backgroundColor: disabled ? DisabledIconColor : IconColor,
            maskImage: `url(/public/icons/${Icon}.svg)`,
            WebkitMaskImage: `url(/public/icons/${Icon}.svg)`,
            maskRepeat: 'no-repeat',
            WebkitMaskRepeat: 'no-repeat',
            maskSize: 'contain',
            WebkitMaskSize: 'contain',
            maskPosition: 'center',
            WebkitMaskPosition: 'center',
          }}
        />
      )}
    </XStack>
  );
};
