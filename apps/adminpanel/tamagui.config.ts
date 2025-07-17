// don't import from here, that's handled already
// instead this is just setting types for this folder

import { config, createConfig } from '@my/ui'
import { getRoot } from 'protonode'
import { promises as fs } from 'fs';

export type Conf = typeof config

declare module 'tamagui' {
  interface TamaguiCustomConfig extends Conf { }
}
export default config

const root = getRoot();

const getElementFromDB = async (db: string, key: string) => {
  const filePath = `${root}/data/${db}/${key}.json`
  try {
    const fileContent = await fs.readFile(filePath, 'utf8')
    return fileContent
  } catch (error) {
    throw new Error("File not found")
  }
}

export async function makeTamaguiConfigFromDB(): Promise<{
  tamagui: ReturnType<typeof createConfig>
  pack: any
}> {
  let selectedThemeId = "default"

  try {

    const themeSettingsStr = await getElementFromDB("settings", "theme")
    const themeSettings = JSON.parse(themeSettingsStr || '{}')
    selectedThemeId = themeSettings?.value ?? "default"
  } catch (error) {
    selectedThemeId = "default"
  }

  let selectedPack = config // fallback

  try {
    const themeStr = await getElementFromDB("themes", selectedThemeId)
    const theme = JSON.parse(themeStr || '{}')
    selectedPack = theme
  } catch (error) { }

  const tamagui = createConfig(selectedPack)

  return { tamagui, pack: selectedPack }
}