import React, {forwardRef} from 'react';
import { Box, StatusBar, Center, Stack } from 'native-base';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
type GuestLayoutProps = {
  children: React.ReactNode;
};

export default forwardRef((props: GuestLayoutProps, ref) => {
  return (
    <Box ref={ref}>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="light-content"
      />
      <Box
        safeAreaTop
        _light={{ bg: 'primary.900' }}
        _dark={{ bg: 'coolGray.900' }}
      />
      <Center
        flex="1"
        my="auto"
        p={{ md: 8 }}
        _dark={{ bg: 'coolGray.900' }}
        _light={{ bg: { md: 'coolGray.100', base: 'primary.900' } }}
      >
        <Stack
          w="100%"
          maxW={{ md: '1016' }}
          flex={{ base: '1', md: undefined }}
          direction={{ base: 'column', md: 'row' }}
        >
          {props.children}
        </Stack>
      </Center>
    </Box>
  );
})
