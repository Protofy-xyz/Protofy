import React, { useState, useEffect, useRef } from 'react'
import { Button, XStack, YStack, Text, Stack } from 'tamagui'
import { AlertDialog } from '../../../components/AlertDialog'
import Flows from '../../../adminpanel/features/components/Flows'
import { getFlowsCustomSnippets } from 'app/bundles/snippets'
import { getFlowsMenuConfig } from 'app/bundles/flows'
import { getFlowMasks, getFlowsCustomComponents } from 'app/bundles/masks'
import { useThemeSetting } from '@tamagui/next-theme'
import { useSearchParams, usePathname } from 'solito/navigation'
import layout from './DeviceLayout'
import { SelectList } from '../../../components/SelectList'
import { X, Check } from "@tamagui/lucide-icons"
import { Tinted } from '../../../components/Tinted'
import { ConfigEditor } from './ConfigEditor'


export const ConfigComponent = ({ data, setData, mode, originalData, boards }) => {
  // console.log("🤖 ~ ConfigComponent ~ path:", path)
  const selectedSdk = originalData.sdk

  if (selectedSdk.startsWith('esphome')) {
    const [showDialog, setShowDialog] = useState(false)
    const isInitialLoad = useRef(true)

    useEffect(() => {
      if (mode === 'add' && isInitialLoad.current) {
        isInitialLoad.current = false
        const esphomeBoardName = originalData.board.name
        const generatedComponents = generateBoardJs(esphomeBoardName)
        if (generatedComponents) {
          if (!originalData.config) {
            originalData.config = {}
          }
          originalData.config.components = generatedComponents.components
        }
      }
    }, [data, mode, originalData])

    const generateBoardJs = (boardName) => {
      const board = boards.find((board) => board.name === boardName)
      if (!board) {
        console.error('Board not found')
        return null
      }
      const components = ['mydevice', boardName]
      board.ports.forEach(() => {
        components.push(null)
      })
      return { components: JSON.stringify(components) + ';' }
    }

    return (
      <>
        <Button onPress={() => setShowDialog(true)}>Edit Config</Button>
        <AlertDialog open={showDialog} setOpen={(open) => setShowDialog(open)} hideAccept={true} style={{ width: "80%", height: "80%", padding: '0px', overflow: 'hidden' }}>
          <ConfigEditor
            definition={originalData}
            onSave={(data) => {
              setData(data.config)
              setShowDialog(false)
            }}
            onCancel={() => setShowDialog(false)}
          />
        </AlertDialog>
      </>
    )
  } else if (selectedSdk === 'wled') {
    const [releases, setReleases] = useState([]);
    const [selectedVersion, setSelectedVersion] = useState(data.version ?? '');
    const [binFiles, setBinFiles] = useState([]);
    const [selectedFile, setSelectedFile] = useState(data.fileName ?? '');

    useEffect(() => {
      fetchGitHubReleases();
    }, []);

    useEffect(() => {
      // Load bin files for the selected version if data.version is provided or if binFiles are empty
      if (selectedVersion && binFiles.length === 0) {
        handleVersionSelect(selectedVersion);
      }
    }, [selectedVersion, releases]);

    const fetchGitHubReleases = async () => {
      try {
        const response = await fetch(
          'https://api.github.com/repos/Aircoookie/WLED/releases'
        );
        const data = await response.json();
        const versions = data.map(release => ({
          tagName: release.tag_name,
          assets: release.assets.filter(asset => asset.name.endsWith('.bin')),
        }));
        setReleases(versions);
      } catch (error) {
        console.error('Error fetching releases:', error);
      }
    };

    const handleVersionSelect = (version) => {
      setSelectedVersion(version);
      const selectedRelease = releases.find(release => release.tagName === version);
      if (selectedRelease) {
        setBinFiles(selectedRelease.assets);
        // Set selected file if data.fileName matches a file in the binFiles list
        if (data.fileName) {
          const initialFile = selectedRelease.assets.find(file => file.name === data.fileName);
          if (initialFile) setSelectedFile(initialFile);
        }
      } else {
        setBinFiles([]);
      }
    };

    const handleFileSelect = (file) => {
      setSelectedFile(file);
      setData({ version: selectedVersion, fileName: file.name, fileUrl: file.browser_download_url });
    };
    //@ts-ignore
    return (
      <YStack>
        <XStack>
          <Text>Select a Version: </Text>
          <SelectList title="Select a Version" elements={releases.map((release, index) => ({ caption: release.tagName, value: release.tagName }))} value={selectedVersion} setValue={handleVersionSelect} />
        </XStack>
        {binFiles.length > 0 && (
          <XStack>
            <Text>Select a file: </Text>
            <SelectList title="Select a .bin file" elements={binFiles.map((file, index) => ({ caption: file.name, value: file }))} value={selectedFile} setValue={handleFileSelect} />
          </XStack>
        )}
      </YStack>

    )
  } else {
    return <a>SDK not defined</a>
  }

}
