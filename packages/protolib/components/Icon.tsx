import { icons } from 'lucide-react';
import { forwardRef } from 'react';

export const Icon = forwardRef(({ name, color, size }: {name: string, color?: string, size?: number | string}, ref) => {
    const LucideIcon = icons[name] ?? icons['Component'];
    return <LucideIcon ref={ref} color={color} size={size} />;
});