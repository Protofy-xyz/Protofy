import { SideMenu as ProtoSideMenu } from 'protolib/components/layout/SideMenu'
import { Image, useThemeName } from '@my/ui';

export const SideMenu = (props) => {
    const themeName = useThemeName()

    return <ProtoSideMenu
        logo={<Image
            key={themeName}
            style={{ filter: themeName?.startsWith("dark") ? "invert(70%) brightness(10)" : "invert(5%)" }}
            src={"/public/vento-logo.png"}
            alt="Logo"
            width={180}
            height={30}
            resizeMode='contain'
        />}
        collapsedLogo={
            <Image
                key={themeName}
                style={{ filter: themeName?.startsWith("dark") ? "invert(70%) brightness(10)" : "invert(5%)" }}
                src={"/public/logo-y.png"}
                alt="Logo"
                width={30}
                height={30}
                resizeMode='contain'
                // @ts-ignore
                animation="bouncy"
                enterStyle={{ rotate: '180deg' }}
                exitStyle={{ rotate: '180deg' }}
            />
        }
        {...props}
    />
}
