export default {
  baseStyle: () => {
    return {
      /** Reseting Card baseStyle as per NativeBase foundation theme */
      shadow: 0,
      borderRadius: 0,
      padding: 0,

      /** Card styling */
      _light: {
        bg: 'coolGray.50',
      },
      _dark: {
        bg: 'coolGray.800',
      },
    };
  },
};
