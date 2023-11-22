import { icons } from 'lucide-react';

const Icon = ({ name, color, size }) => {
    const LucideIcon = icons[name] ?? icons['Component'];
    return <LucideIcon color={color} size={size} />;
};

export default Icon;