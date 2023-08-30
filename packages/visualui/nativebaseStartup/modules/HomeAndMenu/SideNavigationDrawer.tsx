import React from "react";
import { NativeBaseProvider, useColorMode } from "native-base";
import Background from "baseapp/palettes/uikit/Background";
import currentTheme from "internalapp/themes/currentTheme";
import DashboardLayout from "baseapp/plugins/visualui/nativebaseStartup/layouts/DashboardLayout";

export default function SideNavigationDrawer() {
  return (
    <NativeBaseProvider theme={currentTheme}>
      <Background>
        <DashboardLayout title="Side Navigation Drawer" displayMenuButton displayScreenTitle={false} displayAlternateMobileHeader rightPanelMobileHeader={true}>
          
        </DashboardLayout>
      </Background>
    </NativeBaseProvider>
  );
}
