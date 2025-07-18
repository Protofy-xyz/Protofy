import { ThemeModel, ThemeType } from '.'
import { DataView } from 'protolib/components/DataView'
import { AdminPage } from 'protolib/components/AdminPage'
import { usePrompt } from 'protolib/context/PromptAtom'
import { PaginatedData } from 'protolib/lib/SSR';
import { Palette } from '@tamagui/lucide-icons';
import { API } from 'protobase';
import { createConfig, useToastController, YStack, H3 } from '@my/ui';
import { Monaco } from 'protolib/components/Monaco';
import { Tinted } from 'protolib/components/Tinted';

const sourceUrl = '/api/core/v1/themes'

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

      return (<AdminPage title="Themes" pageSession={pageSession}>
        <DataView
          enableAddToInitialData
          disableViews={["grid"]}
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
                return <Tinted>
                  <H3 color="$color8">
                    {data}
                  </H3>
                </Tinted>
              }
            },
            "themes": {
              hideLabel: true,
              component: (path, data, setData, mode, originalData) => {
                if (originalData?.format === "css") {
                  return <>
                    <p>CSS themes are not supported in this view.</p>
                  </>
                }
                return <YStack f={1} h="300px">
                  <Monaco
                    language='json'
                    sourceCode={getParsedJSON(data)}
                    onChange={d => {
                      try {
                        const parsed = JSON.parse(d)
                        setData(parsed)
                      } catch (err) {}
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
                if (element.get("format") != "css") {
                  const Tamagui = createConfig({ ...element.getData() })
                  updateData["css"] = Tamagui.getCSS()
                }
                const updateRes = await API.post("/api/core/v1/themes/update-css", updateData)

                if (updateRes.isError) return toast.show("Error setting theme.", { tint: 'red' })

                // const newHref = `/public/tamagui/adminpanel/tamagui-${element.getId()}.css?v=${Date.now()}`
                const newHref = `/public/themes/adminpanel.css?v=${Date.now()}`

                let link = document.querySelector('#dynamic-tamagui-css') as HTMLLinkElement

                if (!link) {
                  link = document.createElement('link')
                  link.id = 'dynamic-tamagui-css'
                  link.rel = 'stylesheet'
                  document.head.appendChild(link)
                }

                link.href = newHref

              },
              isVisible: () => true,
              menus: ["item"]
            }
          ]}
        />
      </AdminPage>)
    },
    getServerSideProps: PaginatedData(sourceUrl, ['admin'])
  }
}