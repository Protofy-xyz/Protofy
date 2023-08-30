import React from "react";
import { Text, Column, Button, Box, NativeBaseProvider } from "native-base";
import Image from "baseapp/palettes/uikit/Image";
import Background from "baseapp/palettes/uikit/Background";
import currentTheme from "internalapp/themes/currentTheme";
import DashboardLayout from "baseapp/plugins/visualui/nativebaseStartup/layouts/DashboardLayout";

export default function () {
  return (
    <NativeBaseProvider theme={currentTheme}>
      <Background>
        <DashboardLayout title="No Internet" displaySidebar={false}>
          <Box rounded={{ md: "sm" }} _dark={{ bg: "coolGray.800" }} _light={{ bg: "white" }} px={{ base: 4, md: 34 }} pb={8} pt={{ base: 12, md: 20 }} flex={1}>
            <Column alignItems="center" mb="10">
              <Image url="https://cloud.protofy.xyz/public/nativebaseStartup/nointernet.png"></Image>
              <Text mt="8" fontSize="xl" fontWeight="bold" _light={{ color: "coolGray.800" }} _dark={{ color: "coolGray.50" }}>
                You are Offline
              </Text>
              <Text mt="2" fontSize="sm" _light={{ color: "coolGray.800" }} _dark={{ color: "coolGray.300" }}>
                Check your internet connection.
              </Text>
              <Text fontSize="sm" _light={{ color: "coolGray.800" }} _dark={{ color: "coolGray.300" }}>
                We cannot detect an internet connection.
              </Text>
            </Column>
            <Box alignItems="center" mt="auto">
              <Button variant="solid" size="lg" width="full">
                REFRESH
              </Button>
            </Box>
          </Box>
        </DashboardLayout>
      </Background>
    </NativeBaseProvider>
  );
}
