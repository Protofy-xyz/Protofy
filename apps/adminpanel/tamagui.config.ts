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

const getTheme = async (key: string) => {
  const filePath = `${root}/data/themes/${key}.json`
  try {
    const fileContent = await fs.readFile(filePath, 'utf8')
    return fileContent
  } catch (error) {
    throw new Error("File not found")
  }
}

const getSetting = async (key: string) => {
  const filePath = `${root}/data/settings/${key}`
  try {
    const fileContent = await fs.readFile(filePath, 'utf8')
    return JSON.parse(fileContent)
  } catch (error) {
    throw new Error("File not found")
  }
}

export async function makeTamaguiConfigFromDB(): Promise<{
  tamagui: ReturnType<typeof createConfig>
  pack: any,
  accent?: string
}> {
  let selectedThemeId = "default"

  try {
    selectedThemeId = await getSetting("theme")
  } catch (error) {
    selectedThemeId = "default"
  }

  let selectedPack = config // fallback
  let accent: string | undefined
  try {
    const themeStr = await getTheme(selectedThemeId)
    const theme = JSON.parse(themeStr || '{}')
    selectedPack = theme?.config ?? selectedPack
    accent = theme?.accent
  } catch (error) { }

  const tamagui = createConfig(selectedPack)

  return { tamagui, pack: selectedPack, accent }
}