import { SelectProps, Select, Adapt, Sheet, getFontSize, SelectTriggerProps, YStack } from "@my/ui";
import { ChevronDown, ChevronUp, Check } from '@tamagui/lucide-icons';
import { useMemo } from "react";

type Opt = string | { value: string; caption?: string };

export function SelectList({
  title,
  value,
  elements,
  setValue,
  triggerProps,
  valueProps,
  placeholder = "choose an option",
  ...props
}: SelectProps & {
  title: string;
  elements: Opt[];
  value: string;
  setValue: (v: string) => void;
  triggerProps?: SelectTriggerProps;
  valueProps?: any;
}) {
  const opts = useMemo(
    () => elements.map(el => typeof el === 'string'
      ? { value: el, caption: el }
      : { value: el.value, caption: el.caption ?? el.value }),
    [elements]
  );

  return (
    <Select
      value={value ?? ''}
      onValueChange={setValue}
      disablePreventBodyScroll
      {...props}
    >
      <Select.Trigger f={1} iconAfter={ChevronDown} {...triggerProps}>
        <Select.Value {...valueProps} placeholder={placeholder} />
      </Select.Trigger>

      <Adapt when="sm" platform="touch">
        <Sheet modal dismissOnSnapToBottom
          animationConfig={{ type: 'spring', damping: 20, mass: 1.2, stiffness: 250 }}>
          <Sheet.Frame><Sheet.ScrollView><Adapt.Contents /></Sheet.ScrollView></Sheet.Frame>
          <Sheet.Overlay animation="lazy" enterStyle={{ opacity: 0 }} exitStyle={{ opacity: 0 }} />
        </Sheet>
      </Adapt>

      <Select.Content zIndex={200000}>
        <Select.ScrollUpButton ai="center" jc="center" position="relative" width="100%" height="$3">
          <YStack zIndex={10}><ChevronUp size={20} /></YStack>
        </Select.ScrollUpButton>

        <Select.Viewport minWidth={200}>
          <Select.Group>
            <Select.Label>{title}</Select.Label>
            {opts.map((item) => (
              <Select.Item key={item.value} value={item.value}
                style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
                <Select.ItemText>{item.caption}</Select.ItemText>
                <Select.ItemIndicator marginLeft="auto"><Check size={16} /></Select.ItemIndicator>
              </Select.Item>
            ))}
          </Select.Group>

          {props.native && (
            <YStack position="absolute" right={0} top={0} bottom={0} ai="center" jc="center" width="$4" pointerEvents="none">
              <ChevronDown size={getFontSize((props.size ?? '$true') as any)} />
            </YStack>
          )}
        </Select.Viewport>

        <Select.ScrollDownButton ai="center" jc="center" position="relative" width="100%" height="$3">
          <YStack zIndex={10}><ChevronDown size={20} /></YStack>
        </Select.ScrollDownButton>
      </Select.Content>
    </Select>
  );
}
