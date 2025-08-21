// settings.tsx
import { atom, useAtom } from 'jotai';

export type Settings = Record<string, any>;

export const settingsAtom = atom<Settings>({});

export const useSettings = () => useAtom(settingsAtom);

export const useSettingValue = <T = any>(key: string, defaultValue?: T): T => {
  const [settings] = useSettings();
  return (settings[key] ?? defaultValue) as T;
};