import React from "react";
import { NativeBaseProvider, HStack, Text, Column, Button, ScrollView } from "native-base";
import DashboardLayout from "baseapp/plugins/visualui/nativebaseStartup/layouts/DashboardLayout";
import Background from "baseapp/palettes/uikit/Background";
import currentTheme from "internalapp/themes/currentTheme";
import RateUsIlstrutations from "baseapp/plugins/visualui/nativebaseStartup/components/RateUsIlstrutration";
import Icon from 'baseapp/palettes/uikit/Icon';


export default function RateUs() {
  return (
    <NativeBaseProvider theme={currentTheme}>
      <Background>
        <DashboardLayout title="Rate Us" displaySidebar={false}>
          <ScrollView>
            <Column flex={1} _dark={{ bg: "coolGray.800" }} _light={{ bg: "white" }} rounded={{ md: "sm" }} px={{ base: 4, md: 35 }} py={8} justifyContent="space-between">
              <Column flex={1} alignItems="center">
                <RateUsIlstrutations></RateUsIlstrutations>
                <Text mt={{ base: "12", md: "8" }} fontSize={{ base: "lg", md: "2xl" }} fontWeight="bold" textAlign="center" _dark={{ color: "coolGray.50" }} _light={{ color: "coolGray.800" }} children="Your opinion matters to us!">
                  Your opinion matters to us!
                </Text>
                <Text
                  mt="3"
                  fontSize={{ base: "sm", md: "md" }}
                  maxWidth={{ base: "100%", md: "441" }}
                  textAlign="center"
                  _light={{ color: "coolGray.800" }}
                  _dark={{ color: "coolGray.400" }}
                  children="We work super hard to make the app better for you, and would love to
                  know how would you rate our app?">
                  We work super hard to make the app better for you, and would love to know how would you rate our app?
                </Text>
                <HStack space="2" alignItems="center" justifyContent="center" mt="10">
                  <Icon name="star" color="#facc15"></Icon>  
                  <Icon name="star" color="#facc15"></Icon>  
                  <Icon name="star" color="#facc15"></Icon>  
                  <Icon name="star-outline"></Icon>  
                  <Icon name="star-outline"></Icon>  
                </HStack>
                <Text mt="3" fontSize="sm" _light={{ color: "coolGray.500" }} _dark={{ color: "coolGray.400" }} textAlign="center" children="Tap the stars">
                  Tap the stars
                </Text>
              </Column>
              <Column w="100%" mt={{ base: "186px", md: "60px" }} space="3">
                <Button variant="solid" size="lg" children="SUBMIT">
                  SUBMIT
                </Button>
                <Button variant="outline" size="lg" fontWeight="semibold" children="NOT NOW">
                  NOT NOW
                </Button>
              </Column>
            </Column>
          </ScrollView>
        </DashboardLayout>
      </Background>
    </NativeBaseProvider>
  );
}
