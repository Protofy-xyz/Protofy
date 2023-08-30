import React from 'react';
import { Box, NativeBaseProvider } from 'native-base';
import DashboardLayout from "/platform/packages/frontend/app/src/plugins/visualui/nativebaseStartup/layouts/DashboardLayout";
import SettingsCard_AccountSettings from '/platform/packages/frontend/app/src/plugins/visualui/nativebaseStartup/components/SettingsCard_AccountSettings';
import StorageComponent_AccountSettings from '/platform/packages/frontend/app/src/plugins/visualui/nativebaseStartup/components/StorageComponent_AccountSettings';
import currentTheme from "internalapp/themes/currentTheme";
import Background from "baseapp/palettes/uikit/Background";

export default function () {
  return (
    <NativeBaseProvider theme={currentTheme}>
      <Background>
        <DashboardLayout title="Settings">
          <Box
            _light={{ bg: 'white' }}
            _dark={{ bg: 'coolGray.800' }}
            rounded="sm"
            px="0"
            py="5"
          >
            <SettingsCard_AccountSettings iconName={"credit-card-outline"} name={"Change password"} option={null} />
            <SettingsCard_AccountSettings iconName={"security"} name={"General"} option={null} />
            <SettingsCard_AccountSettings iconName={"account-multiple"} name={"Manage Accounts"} option={null} />
            <SettingsCard_AccountSettings iconName={"google-translate"} name={"Language"} option={null} />
            <SettingsCard_AccountSettings iconName={"link"} name={"Linked Accounts"} option={null} />
            <SettingsCard_AccountSettings iconName={"account-minus"} name={"Disable Account"} option={null} />
          </Box>
          <StorageComponent_AccountSettings />
        </DashboardLayout>
      </Background>
    </NativeBaseProvider>
  );
}