import fs from 'fs';
import path from 'path';
import { getRoot } from 'protonode'

export const getConfigFromDisk = (): Record<string, any> => {
  try {
    const root = getRoot();
    const settingsPath = path.join(root, 'data', 'settings', 'theme.json');
    const settingsData = fs.readFileSync(settingsPath, 'utf8');
    const settings = JSON.parse(settingsData || '{}');
    const selectedConfig = settings?.value ?? 'default';

    const themesPath = path.join(root, 'data', 'themes', `${selectedConfig}.json`);
    const themeData = fs.readFileSync(themesPath, 'utf8');
    const themeConf = JSON.parse(themeData);

    return { ...themeConf?.config };
  } catch (err) {
    console.warn('The selected theme has no json file');
    return {};
  }
};
