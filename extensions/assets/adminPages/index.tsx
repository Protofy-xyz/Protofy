import React from 'react';
import { withSession } from 'protolib/lib/Session';
import { Tinted } from 'protolib/components/Tinted';
import { Center } from 'protolib/components/Center';
import { SSR } from 'protolib/lib/SSR';
import { AdminPage } from 'protolib/components/AdminPage';
import dynamic from 'next/dynamic'
import { Button, Spinner, Image, Text, useToastController, YStack, XStack, H2 } from '@my/ui'
import { API } from 'protobase';
import { Bird, File, ImageOff } from '@tamagui/lucide-icons';
import { useState } from 'react';
import { useRouter } from 'next/router';
import { isElectron } from 'protolib/lib/isElectron';
import { DataView } from 'protolib/components/DataView'
import { DataTable2 } from 'protolib/components/DataTable2'
import { AssetsModel } from '../models/assets';
import { AlertDialog } from 'protolib/components/AlertDialog';
import { Uploader } from 'protolib/adminpanel/next/components/Uploader';

const sourceUrl = '/api/core/v1/assets'

const AssetIcon = ({ element, ...props }) => {
  return <>
    {element.icon ? <Image
      src={`/api/core/v1/files?path=data/assets/${element.name}/${element.icon}`}
      alt={element.name}
      width="100%"
      height="180px"
      objectFit="cover"
      {...props}
    /> : <YStack height="180px" ai="center" jc="center" {...props}>
      <ImageOff size={50} color="$gray8" />
    </YStack>
    }
  </>
}

const InstallButton = ({ element, loading, ...props }) => {
  const isInstalled = element.format?.includes("logs")
  return <Button w="100%" bc={!isInstalled ? "$color7" : "$gray6"} {...props}>
    {loading.includes(element.name) ? "Installing..." : !isInstalled ? "Install" : "Reinstall"}
  </Button>
}

function FilesPage({ initialFilesState, pageSession, initialItems, pageState }: any) {
  const [loading, setLoading] = useState<any>([]);
  const [explorerVisible, setExplorerVisible] = useState(false);
  const toast = useToastController()
  const router = useRouter();
  const { pathname, query, push, replace } = router;
  const routeAdapter = { push, replace, pathname, query: query as Record<string, string> };

  const onInstallAsset = async (assetName: string) => {
    setLoading([assetName]);
    await API.post("/api/core/v1/assets/install", { assets: [assetName] });
    setLoading([]);
    toast.show("Assets installed successfully. Please refresh the page to see the changes.")

    if (isElectron()) {
      window['electronAPI'].refreshWindow()
    } else if (window != undefined && window.location != undefined) {
      window.location.reload();
    }
  }

  const onUpload = async (assetName: string) => {
    setExplorerVisible(false);
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
      actionBar={{ hideable: false }}
    >
      <YStack f={1}>
        <DataView
          openMode="view"
          sourceUrl={sourceUrl}
          initialItems={initialItems}
          numColumnsForm={1}
          name="assets"
          disableViewSelector={false}
          defaultView={'grid'}
          disableViews={["raw"]}
          quickRefresh={true}
          onSelectItem={() => { }}
          columns={DataTable2.columns(
            DataTable2.column("", row => <AssetIcon element={row} h="50px" w="50px" br="$4" />, false, undefined, true, '90px'),
            DataTable2.column("name", row => row.name, false, undefined, true, '150px'),
            DataTable2.column("description", row => row?.description, false, undefined, true, '400px'),
            DataTable2.column("", row =>
              <InstallButton element={row} loading={loading} br="$10" size="$3" w="80px" onPress={() => onInstallAsset(row.name)} />
              , false, undefined, true, '115px'),
          )}
          dataTableGridProps={{
            marginTop: '$10',
            getCard: (element: any, width: any) => {
              return <YStack br="$6" w={width} bc="$bgPanel" overflow='hidden'>
                <AssetIcon element={element} />
                <YStack p="$4" gap="$4" ai="flex-start">
                  <XStack jc="space-between" w="100%">
                    <Text fontSize="$8" fow="600">{element.name}</Text>
                  </XStack>
                  <InstallButton element={element} loading={loading} onPress={() => onInstallAsset(element.name)} />
                </YStack>
              </YStack>
            }
          }}
          onAddButton={() => setExplorerVisible(true)}
          model={AssetsModel}
          pageState={pageState}
          icons={{}}
        />
        <AlertDialog open={explorerVisible} setOpen={setExplorerVisible} hideAccept={true} p="$0" height={'600px'} width={"600px"}>
          <Uploader path={"/data/assets"} onUpload={onUpload} setShowUploadDialog={setExplorerVisible} />
        </AlertDialog>
      </YStack>
    </AdminPage>
  )
}

export default {
  'assets': { component: FilesPage, getServerSideProps: SSR(async (context) => withSession(context, ['admin'])) }
}