import { ThemeModel, ThemeType } from '.'
import { DataView } from 'protolib/components/DataView'
import { AdminPage } from 'protolib/components/AdminPage'
import { usePrompt } from 'protolib/context/PromptAtom'
import { PaginatedData } from 'protolib/lib/SSR';
import { Palette } from '@tamagui/lucide-icons';
import { addTheme, updateTheme, replaceTheme } from '@tamagui/theme'
import { API } from 'protobase';
import { createConfig, useToastController } from '@my/ui';

const sourceUrl = '/api/core/v1/themes'

export default {
  'themes': {
    component: ({ pageState, initialItems, pageSession, extraData }: any) => {
      usePrompt(() => `` + (
        initialItems?.isLoaded ? 'Currently the system returned the following information: ' + JSON.stringify(initialItems.data) : ''
      ))

      const toast = useToastController()

      return (<AdminPage title="Themes" pageSession={pageSession}>
        <DataView
          enableAddToInitialData
          disableViews={["grid"]}
          defaultView={'list'}
          sourceUrl={sourceUrl}
          initialItems={initialItems}
          numColumnsForm={1}
          name="themes"
          model={ThemeModel}
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