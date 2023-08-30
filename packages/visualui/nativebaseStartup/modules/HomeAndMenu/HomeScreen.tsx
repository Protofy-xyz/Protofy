import React from "react";
import { Column, ScrollView, Divider, NativeBaseProvider } from "native-base";
import DashboardLayout from "baseapp/plugins/visualui/nativebaseStartup/layouts/DashboardLayout";
import Background from "baseapp/palettes/uikit/Background";
import currentTheme from "internalapp/themes/currentTheme";
import Banner_HomeScreen from "baseapp/plugins/visualui/nativebaseStartup/components/Banner_HomeScreen";
import ResumeCourses_HomeScreen from "baseapp/plugins/visualui/nativebaseStartup/components/ResumeCourses_HomeScreen";

export default function HomeScreen() {
  return (
    <NativeBaseProvider theme={currentTheme}>
      <Background>
        <DashboardLayout title="Class 12th" displayMenuButton displayScreenTitle={false} displayAlternateMobileHeader rightPanelMobileHeader={true}>
          <ScrollView>
            <Banner_HomeScreen></Banner_HomeScreen>
            <Column pt={{ base: 39, md: 8 }} pb={{ base: 10, md: 8 }} _light={{ bg: "white" }} _dark={{ bg: "coolGray.800" }} rounded={{ md: "sm" }} divider={<Divider />} space="5">
              <ResumeCourses_HomeScreen></ResumeCourses_HomeScreen>
            </Column>
          </ScrollView>
        </DashboardLayout>
      </Background>
    </NativeBaseProvider>
  );
}
