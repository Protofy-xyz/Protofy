import React from 'react';
import { Animated } from 'react-native';
import { Input, Box, IInputProps } from 'native-base';
import { Platform } from 'react-native';

export default function FloatingLabelInput(
  props: IInputProps & {
    label?: string;
    labelBGColor?: string;
    labelColor?: string;
    containerWidth?: string | number | { base: string; md: string };
  }
) {
  const _animatedIsFocused = new Animated.Value(
    props.defaultValue === '' ? 0 : 1
  );
  const [isFocused, setIsFocused] = React.useState(false);

  function handleFocus() {
    setIsFocused(true);
  }
  function handleBlur() {
    setIsFocused(false);
  }

  React.useEffect(() => {
    Animated.timing(_animatedIsFocused, {
      duration: 200,
      useNativeDriver: false,
      toValue: isFocused || props.defaultValue !== '' ? 1 : 0,
    }).start();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFocused]);

  const { label, labelBGColor, labelColor } = props;

  const lableContainerStyles: Animated.Animated = {
    position: 'absolute',
    left: 9,
    top: _animatedIsFocused.interpolate({
      inputRange: [0, 1],
      outputRange: ['50%', '0%'],
    }),
    zIndex: 5,
    paddingLeft: 3,
    paddingRight: 3,
    marginTop: -8,
    height: 16,
    backgroundColor: labelBGColor,
    justifyContent: 'center',
  };

  const AndroidlabelStyle: Animated.Animated = {
    fontWeight: '500',
    fontSize: _animatedIsFocused.interpolate({
      inputRange: [0, 1],
      outputRange: [16, 12],
    }),
    marginTop: _animatedIsFocused.interpolate({
      inputRange: [0, 1],
      outputRange: [-3, 0],
    }),
    color: labelColor,
  };

  const IOSlabelStyle: Animated.Animated = {
    fontWeight: '500',
    fontSize: _animatedIsFocused.interpolate({
      inputRange: [0, 1],
      outputRange: [13, 12],
    }),

    marginTop: _animatedIsFocused.interpolate({
      inputRange: [0, 1],
      outputRange: [-3, 0],
    }),
    color: labelColor,
  };

  return (
    <Box w={props.containerWidth}>
      <Animated.View pointerEvents="none" style={lableContainerStyles}>
        <Animated.Text
          style={Platform.OS === 'android' ? AndroidlabelStyle : IOSlabelStyle}
        >
          {label}
        </Animated.Text>
      </Animated.View>
      <Input
        {...props}
        onFocus={handleFocus}
        onBlur={handleBlur}
        _hover={{ bg: labelBGColor }}
      />
    </Box>
  );
}
