import { useEffect, useState } from 'react'
import { useSetAtom } from 'jotai'
import { initParticlesAtom } from 'protolib/components/particles/ParticlesEngineAtom'
import { ParticlesView } from 'protolib/components/particles/ParticlesView'
import { Page } from 'protolib/components/Page'
import { basicParticlesMask } from 'protolib/components/particles/particlesMasks/basicParticlesMask'
import { ProtoModel, z } from 'protobase'
import { DataView } from 'protolib/components/DataView'
import { Paragraph, Popover, XStack, YStack } from 'tamagui'
import { Download, MoreVertical, Play, X } from '@tamagui/lucide-icons'
import { InteractiveIcon } from 'protolib/components/InteractiveIcon'
import { Tinted } from 'protolib/components/Tinted'
import { useFetch } from 'protolib'

const obj = {
  "name": "project",
  "features": {
    "adminPage": "/objects/view?object=projectModel"
  },
  "id": "projectModel",
  "keys": {
    "name": {
      "type": "string",
      "params": [],
      "modifiers": []
    }
  },
  "apiOptions": {
    "name": "project",
    "prefix": "/api/v1/"
  },
  "filePath": "data/objects/project.ts"
}

function CardElement({ element, width }) {
  const [menuOpened, setMenuOpened] = useState(false)
  return (
    <YStack borderRadius={10} p="$4" jc="center" cursor="auto" backgroundColor="rgba(0, 0, 0, 0.6)">
      <XStack f={1} ai="center">
        <Paragraph f={1} style={{ color: '#fff8e1', fontSize: '14px' }}>
          {element.name}
        </Paragraph>
        <Popover onOpenChange={setMenuOpened} open={menuOpened} allowFlip>
          <Popover.Trigger>
            <InteractiveIcon Icon={MoreVertical} onPress={(e) => { e.stopPropagation(); setMenuOpened(true) }} />
          </Popover.Trigger>
          <Popover.Content padding={0} space={0} left={"$7"} top={"$2"} bw={1} boc="$borderColor" bc={"$color1"} >
            <Tinted>
              <YStack alignItems="center" justifyContent="center" padding={"$3"} paddingVertical={"$3"} onPress={(e) => e.stopPropagation()}>
                <YStack>
                  <XStack cursor="pointer" ai="center">Delete</XStack>
                </YStack>
              </YStack>
            </Tinted>
          </Popover.Content>
        </Popover>
      </XStack>
      <Paragraph style={{ color: '#fff8e1', fontSize: '10px' }}>
        v: {element.version}
      </Paragraph>

      <XStack>
        <Paragraph alignSelf='flex-start' o={0.5} f={1} style={{ color: '#fff8e1', fontSize: '10px' }}>

        </Paragraph>
        {element.status == 'downloaded' && <XStack>
          <InteractiveIcon size={20} IconColor="var(--color)" Icon={Play} />
        </XStack>}

        {element.status == 'pending' && <XStack>
          <InteractiveIcon size={20} IconColor="var(--color)" Icon={Download} />
        </XStack>}
      </XStack>


    </YStack>
  )
}

const objModel = ProtoModel.getClassFromDefinition(obj)

const MainView = () => {
  const [result, loading, error] = useFetch('https://api.github.com/repos/Protofy-xyz/Vento/releases', null, true)

  let parsedResult = JSON.parse(result ?? '[]')

  const versions = parsedResult && parsedResult.map ? parsedResult.map((item) => {
    return "" + item.tag_name.replace('v', '')
  }) : []

  console.log('versions', versions)
  return <XStack f={1}>
    <DataView
      disableViewSelector={true}
      defaultView='grid'
      hidePagination={true}
      hideDeleteAll={true}
      hideSearch={true}
      sourceUrl={'app://localhost/api/v1/projects'}
      numColumnsForm={1}
      name={'Vento Projects'}
      model={objModel}
      disableNotifications={true}
      onSelectItem={(item) => {
        return false
      }}
      onAdd={(data) => {
        console.log('onAdd', data)
        return false
      }}
      disableItemSelection={true}
      title={<Paragraph pl="$2" style={{ color: '#fff8e1', fontSize: '25px' }}>
        Vento Projects
      </Paragraph>}
      dataTableGridProps={{
        marginTop: '$10',
        getCard: (element: any, width: any) => {
          return <CardElement element={element} width={width} />
        }
      }}
      createElement={async (data) => {
        if (typeof window !== 'undefined' && window.electronAPI) {
          window.electronAPI.createProject(data);

          window.electronAPI.onProjectCreated((result) => {
            console.log('Resultado:', result);
          });
        }
      }}
      extraFieldsFormsAdd={{
        version: z.union(versions.map((v) => z.literal(v)))
          .label("version")
          .after('name')
          .defaultValue("stable")
      }}
    />
  </XStack>
}
export default function Home() {
  const initParticles = useSetAtom(initParticlesAtom)

  useEffect(() => {
    initParticles()
  }, [initParticles])


  return (
    <Page
      skipSessionManagement={true}
      style={{
        height: '100vh',
        margin: 0,
        padding: 0,
        fontFamily: "'Inter', sans-serif",
        color: '#fff8e1',
        fontSize: '10px',
        background: 'radial-gradient(circle at bottom,rgb(1, 13, 0) 0%,rgb(21, 21, 21) 100%)',
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      <ParticlesView options={basicParticlesMask({ particleColors: ['rgb(0, 201, 87) ', 'rgb(105, 255, 165) '] })} />
      <MainView />

    </Page>
  )
}