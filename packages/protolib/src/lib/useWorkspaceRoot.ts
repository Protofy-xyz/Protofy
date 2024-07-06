import { usePathname } from 'solito/navigation';

export const useWorkspaceRoot = () => {
  const pathname = usePathname();  
  return pathname.split('/')[1];
};