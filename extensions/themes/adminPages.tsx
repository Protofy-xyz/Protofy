import React from 'react'
import { ThemeModel, ThemeType } from '.'
import { DataView } from 'protolib/components/DataView'
import { AdminPage } from 'protolib/components/AdminPage'
import { usePrompt } from 'protolib/context/PromptAtom'
import { PaginatedData } from 'protolib/lib/SSR';
import { Palette } from '@tamagui/lucide-icons';
import { API } from 'protobase';
import { createConfig, useToastController, YStack, H3, Text, Input } from '@my/ui';
import { Monaco } from 'protolib/components/Monaco';
import { Tinted } from 'protolib/components/Tinted';

const sourceUrl = '/api/core/v1/themes'

const emptyThemeConfig = {
  "themes": {
    "light": {},
    "dark": {},
    "dark_gray": {
      "color8": "#dddddd",
      "bgPanel": "hsl(0, 0%, 17%)",
      "bgContent": "hsl(15, 0%, 11%)"
    },
    "light_gray": {
      "bgPanel": "#FFFFFF",
      "bgContent": "#F8F8F8"
    },
    "dark_orange": {
      "bgPanel": "hsl(20, 11.40%, 15.50%)",
      "bgContent": "hsl(36, 31%, 10%)"
    },
    "light_orange": {
      "bgPanel": "#FFFFFF",
      "bgContent": "#F3F4F6"
    },
    "dark_yellow": {
      "color1": "#30302e",
      "color2": "#3b372d",
      "bgPanel": "#383A44",
      "bgContent": "#2A2D36"
    },
    "light_yellow": {
      "bgPanel": "#FFFFFF",
      "bgContent": "#F3F4F6"
    },
    "dark_green": {
      "bgPanel": "#24252B",
      "bgContent": "#1C1B21"
    },
    "light_green": {
      "bgPanel": "#FFFFFF",
      "bgContent": "#F3F4F6"
    },
    "dark_blue": {
      "bgPanel": "hsl(215, 28%, 17%)",
      "bgContent": "hsl(221, 41%, 11%)"
    },
    "light_blue": {
      "bgPanel": "#FFFFFF",
      "bgContent": "#F3F4F6"
    },
    "dark_purple": {
      "bgPanel": "#353244",
      "bgContent": "#292636"
    },
    "light_purple": {
      "bgPanel": "#FFFFFF",
      "bgContent": "#F3F4F6"
    },
    "dark_pink": {
      "bgPanel": "#252A47",
      "bgContent": "#1D233D"
    },
    "light_pink": {
      "bgPanel": "#FFFFFF",
      "bgContent": "#F3F4F6"
    },
    "dark_red": {
      "bgPanel": "#000000",
      "bgContent": "hsl(0, 6%, 8%)"
    },
    "light_red": {
      "bgPanel": "#FFFFFF",
      "bgContent": "#F3F4F6"
    }
  }
}

export default {
  'themes': {
    component: ({ pageState, initialItems, pageSession, extraData }: any) => {
      usePrompt(() => `` + (
        initialItems?.isLoaded ? 'Currently the system returned the following information: ' + JSON.stringify(initialItems.data) : ''
      ))

      const toast = useToastController()

      const getParsedJSON = (rawJson) => {
        let result = rawJson
        try {
          result = JSON.stringify(rawJson, null, 2)
        } catch (err) {
          console.error("DEV: Error parsing JSON: ", err)
        }

        return result
      }


      const refreshCss = () => {
        const newHref = `/public/themes/adminpanel.css?v=${Date.now()}`

        let link = document.querySelector('#dynamic-tamagui-css') as HTMLLinkElement

        if (!link) {
          link = document.createElement('link')
          link.id = 'dynamic-tamagui-css'
          link.rel = 'stylesheet'
          document.head.appendChild(link)
        }

        link.href = newHref
      }

      return (<AdminPage title="Themes" pageSession={pageSession}>
        <DataView
          enableAddToInitialData
          disableViews={["raw", "grid"]}
          defaultView={'list'}
          sourceUrl={sourceUrl}
          initialItems={initialItems}
          numColumnsForm={2}
          name="themes"
          model={ThemeModel}
          objectProps={{ title: "" }}
          customFieldsForms={{
            "name": {
              hideLabel: true,
              component: (path, data, setData, mode, originalData, setFormData) => {
                if (mode === "add") {
                  return <Input
                      placeholder="theme name here..."
                      value={data}
                      w="100%"
                      fontSize={"$6"}
                      fontWeight={data ? "600" : "400"}
                      onChangeText={setData}
                    />
                }
                return <Tinted>
                  <H3 color="$color8">
                    {data}
                  </H3>
                </Tinted>
              }
            },
            "config": {
              hideLabel: true,
              component: (path, data, setData, mode, originalData) => {
                if (!originalData?.format?.includes("json") && mode != "add") {
                  return <>
                    <Text fontSize="$3" color="$gray9">This theme does not have an editable version.</Text>
                  </>
                }
                if (mode === "add" && !data || data == "") {
                  setData(emptyThemeConfig)
                }
                return <YStack f={1} h="300px">
                  <Monaco
                    language='json'
                    sourceCode={getParsedJSON(data)}
                    onChange={d => {
                      try {
                        const parsed = JSON.parse(d)
                        setData(parsed)
                      } catch (err) { }
                    }}
                    options={{
                      formatOnPaste: true,
                      formatOnType: true
                    }}
                  />
                </YStack>
              }
            }
          }}
          extraMenuActions={[
            {
              text: "Use this theme",
              icon: Palette,
              action: async (element: ThemeType) => {
                let updateData: any = {
                  themeId: element.getId(),
                  format: element.get("format")
                }
                if (element.get("config")) {
                  const Tamagui = createConfig({ ...element.get("config") })
                  updateData["css"] = Tamagui.getCSS()
                }
                const updateRes = await API.post("/api/core/v1/themes/update-css", updateData)

                if (updateRes.isError) return toast.show("Error setting theme.", { tint: 'red' })

                refreshCss()
              },
              isVisible: (ele: ThemeType) => true,
              menus: ["item"]
            }
          ]}
        />
      </AdminPage>)
    },
    getServerSideProps: PaginatedData(sourceUrl, ['admin'])
  }
}