import React from 'react';
import { Radio, HStack, Box } from 'native-base';
import DashboardLayout from '../../layouts/DashboardLayout';

type Language = {
  id: number;
  name: string;
};

const languages: Language[] = [
  {
    id: 1,
    name: 'English',
  },
  {
    id: 2,
    name: 'Hindi',
  },
  {
    id: 3,
    name: 'Kannada',
  },
  {
    id: 4,
    name: 'Urdu',
  },
  {
    id: 5,
    name: 'Spanish',
  },
];

function LanguagOptionItem({ name }: Language) {
  return (
    <HStack py={3} px={4} w="full">
      <Radio
        _text={{
          ml: '4',
          fontSize: 'md',
          _dark: { color: 'coolGray.50' },
          _light: { color: 'coolGray.800' },
        }}
        value={name}
      >
        {name}
      </Radio>
    </HStack>
  );
}

export default function () {
  return (
    <DashboardLayout title="Language Settings">
      <Box
        py={{ base: 3, md: 5 }}
        px={{ base: 0, md: 4 }}
        rounded={{ md: 'sm' }}
        _light={{ bg: 'white' }}
        _dark={{ bg: 'coolGray.800' }}
      >
        <Radio.Group
          name="Language Group"
          defaultValue="English"
          accessibilityLabel="Select Language"
          onChange={(nextValue) => {
            console.log(nextValue);
          }}
        >
          {languages.map((language, index) => {
            return <LanguagOptionItem key={index} {...language} />;
          })}
        </Radio.Group>
      </Box>
    </DashboardLayout>
  );
}
