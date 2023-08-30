import React from 'react';
import { Box, HStack, Text, VStack, Pressable, ScrollView } from 'native-base';

type TabProps = {
  variant: string;
  mr?: string;
  px?: string;
  justifyContent?: string;
  navigationState: { routes: { key: string; title: string }[]; index: number };
  jumpTo: (key: string) => void;
};

export default function ({
  navigationState: { routes, index },
  jumpTo,
  variant,
  justifyContent,
  mr,
  px,
}: TabProps) {
  return (
    <HStack
      _light={{
        bg:
          variant === 'primary'
            ? 'white'
            : variant === 'secondary'
            ? 'primary.900'
            : variant === 'tertiary'
            ? 'coolGray.100'
            : 'coolGray.100',
      }}
      _dark={{
        bg:
          variant === 'primary'
            ? 'coolGray.800'
            : variant === 'secondary'
            ? 'coolGray.600'
            : variant === 'tertiary'
            ? 'coolGray.800'
            : 'coolGray.700',
      }}
    >
      <ScrollView
        _contentContainerStyle={{
          flexGrow: 1,
        }}
        horizontal={true}
        showsHorizontalScrollIndicator={false}
      >
        {routes.map((route: any, i: any) => {
          type Mode = {
            color: string;
          };
          const lightMode: Mode = {
            color: '',
          };
          const darkMode: Mode = {
            color: '',
          };
          if (variant === 'primary') {
            lightMode.color = index === i ? 'primary.900' : 'coolGray.500';
            darkMode.color = index === i ? 'primary.500' : 'coolGray.400';
          } else if (variant === 'secondary') {
            lightMode.color = index === i ? 'coolGray.50' : 'primary.300';
            darkMode.color = index === i ? 'coolGray.50' : 'coolGray.400';
          } else if (variant === 'tertiary') {
            lightMode.color = index === i ? 'primary.900' : 'coolGray.500';
            darkMode.color = index === i ? 'primary.500' : 'coolGray.400';
          } else {
            lightMode.color = index === i ? 'primary.900' : 'coolGray.500';
            darkMode.color = index === i ? 'primary.500' : 'coolGray.400';
          }
          return (
            <VStack key={i} pt="2" mr={mr ?? '0'} px={px ?? '0'}>
              <Pressable
                px="4"
                pt="2"
                onPress={() => {
                  jumpTo(route.key);
                }}
              >
                <Text
                  textAlign="center"
                  pb="2"
                  fontWeight="medium"
                  _light={lightMode}
                  _dark={darkMode}
                >
                  {route.title}
                </Text>
              </Pressable>
              {index === i && (
                <Box
                  borderTopLeftRadius="sm"
                  borderTopRightRadius="sm"
                  _light={{
                    bg:
                      variant === 'primary'
                        ? 'primary.900'
                        : variant === 'secondary'
                        ? 'coolGray.50'
                        : variant === 'tertiary'
                        ? 'primary.900'
                        : 'primary.900',
                  }}
                  _dark={{
                    bg:
                      variant === 'primary'
                        ? 'primary.500'
                        : variant === 'secondary'
                        ? 'primary.500'
                        : variant === 'tertiary'
                        ? 'primary.500'
                        : 'primary.500',
                  }}
                  h="1"
                />
              )}
            </VStack>
          );
        })}
      </ScrollView>
    </HStack>
  );
}
