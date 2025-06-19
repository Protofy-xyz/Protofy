import { SideMenu as ProtoSideMenu } from 'protolib/components/layout/SideMenu'
import { Image, useThemeName, YStack } from '@my/ui';

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
            <YStack pt={5} pl={4}>
                <Image
                    key={themeName}
                    style={{ filter: themeName?.startsWith("dark") ? "invert(70%) brightness(10)" : "invert(5%)" }}
                    src={"/public/vento-square.png"}
                    alt="Logo"
                    width={22}
                    height={22}
                    resizeMode='contain'
                />
            </YStack>
        }
        {...props}
    />
}
