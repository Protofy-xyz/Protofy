import fs from 'fs';
import path from 'path';
import { getRoot } from 'protonode'

export const getConfigFromDisk = (): Record<string, any> => {
  let config = {};
  let selectedConfig = 'default';
  try {
    const root = getRoot();
    const settingsPath = path.join(root, 'data', 'settings', 'theme.json');
    if (fs.existsSync(settingsPath)) {
      const settingsData = fs.readFileSync(settingsPath, 'utf8');
      const settings = JSON.parse(settingsData || '{}');
      selectedConfig = settings?.value ?? selectedConfig;
    }
    const themesPath = path.join(root, 'data', 'themes', `${selectedConfig}.json`);
    const themeData = fs.readFileSync(themesPath, 'utf8');
    const themeConf = JSON.parse(themeData);
    config = { ...themeConf?.config };
  } catch (err) {
    console.warn('The selected theme has no json file');
  }
  return config;
};
