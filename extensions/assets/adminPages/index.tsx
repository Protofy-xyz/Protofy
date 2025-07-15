import { withSession } from 'protolib/lib/Session';
import { Tinted } from 'protolib/components/Tinted';
import { Center } from 'protolib/components/Center';
import { SSR } from 'protolib/lib/SSR';
import { AdminPage } from 'protolib/components/AdminPage';
import dynamic from 'next/dynamic'
import { Button, Spinner, Stack, Text, useToastController, YStack } from '@my/ui'
import { API } from 'protobase';
import { useState } from 'react';
import { useRouter } from 'next/router';
import { isElectron } from 'protolib/lib/isElectron';

const FileBrowser = dynamic<any>(() =>
  import('protolib/adminpanel/next/components/FileBrowser').then(module => module.FileBrowser),
  { ssr: false, loading: () => <Tinted><Center><Spinner size='small' color="$color7" scale={4} /></Center></Tinted> }
);

function FilesPage({ initialFilesState, pageSession }: any) {
  const [loading, setLoading] = useState(false);
  const toast = useToastController()
  const router = useRouter();
  const { pathname, query, push, replace } = router;
  const routeAdapter = { push, replace, pathname, query: query as Record<string, string> };

  const onInstallAssets = async (selectedFiles: any, setCustomAction) => {
    setLoading(true);
    await API.post("/api/core/v1/assets/install", { assets: selectedFiles.map((f: any) => f.name) });
    setLoading(false);
    setCustomAction(false)
    toast.show("Assets installed successfully. Please refresh the page to see the changes.")
  }

  const onActionBarEvent = (event: any) => {
    if (event.type === "open-store") {
      if (isElectron()) {
        window['electronAPI'].openWindow("store");
      } else {
        window.open("https://protofy.xyz/store", "_blank");
      }
    }
  }

  return (
    <AdminPage
      pageSession={pageSession}
      title={"assets"}
      onActionBarEvent={onActionBarEvent}
    >
      <FileBrowser
        router={routeAdapter}
        initialFilesState={initialFilesState}
        explorer={{
          i18n: {
            locale: 'en',                     // idioma activo
            messages: {
              'chonky.fileList.nothingToShow': `You don't have any assets installed. Find new assets by clicking on “Go to the Store”.`,
            },
          },
          disableNavBar: true,
          getExtendedFileProps: f => ({
            isDir: false,
            name: f.name,
            ext: "",
            thumbnailUrl: "/api/core/v1/files?path=data/assets/" + f.name + "/.vento/icon.png",
          }),
          onFileAction: (data) => {
            if (data.id == "mouse_click_file") {
              return false
            }
            return true
          },
          extraActions: [
            {
              getComponent: (selected, path, setCustomAction) => {
                if (selected.length) {
                  return <Stack f={1}>
                    <YStack f={1} pt="$3">
                      {selected.map(a => <Text key={a}>· {a.name}</Text>)}
                    </YStack>
                    <Tinted>
                      <Button onPress={() => onInstallAssets(selected, setCustomAction)}>
                        {loading ? <Spinner /> : "Install"}
                      </Button>
                    </Tinted>
                  </Stack>
                }
                return <></>
              },
              title: "Install Assets",
              filter: (path, selected) => {
                return selected.length > 0
              },
              size: {
                width: 500,
                height: 200
              },
              action: {
                id: "intall-assets",
                button: {
                  name: "Install Assets",
                  toolbar: true,
                  // icon: ChonkyIconName.share
                  // group: 'link'
                }
              }
            },
          ]
        }}

      />
    </AdminPage>
  )
}

export default {
  'assets': { component: FilesPage, getServerSideProps: SSR(async (context) => withSession(context, ['admin'])) }
}