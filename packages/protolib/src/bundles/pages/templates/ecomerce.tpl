import { YStack, Text, XStack, H4 } from '@my/ui';
import { Image } from 'protolib/dist/components/Image';
import { ContainerLarge } from 'protolib/dist/components/Container';
import { Grid } from 'protolib/dist/components/Grid';
import { NextLink } from 'protolib/dist/components/NextLink';
import { Logo } from 'protolib/dist/components/Logo';
import { FooterElement } from 'protolib/dist/components/layout';
import { Footer as ProtoFooter } from 'protolib/dist/components/layout/Footer';
import { API, Protofy } from 'protobase';
import { withSession } from 'protolib/dist/lib/Session';
import { Page } from 'protolib/dist/components/Page';
import { SSR } from 'protolib/dist/lib/SSR';
import { DefaultLayout } from '../../../layout/DefaultLayout';
import { Paragraph } from '@my/ui';
import { context } from 'app/bundles/uiContext';
import { useRouter } from 'solito/navigation';

const isProtected = Protofy("protected", {{protected}})
Protofy("pageType", "ecommerce")

const CURRENCY = "$"
const products = [
    {
        id: '1',
        name: 'Saleor Dash Shoes',
        category: 'Shoes',
        image: 'https://raw.githubusercontent.com/Protofy-xyz/Protofy/assets/templates/ecomerce/shoes.png',
        priceRange: [54.00, 90.00],
    },
    {
        id: '2',
        name: 'Saleor Card 50',
        category: 'Gift card',
        image: 'https://raw.githubusercontent.com/Protofy-xyz/Protofy/assets/templates/ecomerce/card-50.png',
        priceRange: [50.00],
    },
    {
        id: '3',
        name: 'Saleor Grey Hoodie',
        category: 'Sweatshirts',
        image: 'https://raw.githubusercontent.com/Protofy-xyz/Protofy/assets/templates/ecomerce/hoodie.png',
        priceRange: [18.00],
    },
    {
        id: '4',
        name: 'Saleor Mighty Mug',
        category: 'Homewares',
        image: 'https://raw.githubusercontent.com/Protofy-xyz/Protofy/assets/templates/ecomerce/mug.png',
        priceRange: [11.99],
    },
    {
        id: '5',
        name: 'Saleor Dimmed Sunnies Sunglasses',
        category: 'Sunglasses',
        image: 'https://raw.githubusercontent.com/Protofy-xyz/Protofy/assets/templates/ecomerce/sunglasses.png',
        priceRange: [17.00],
    },
    {
        id: '6',
        name: 'Saleor Beanie',
        category: 'Beanies',
        image: 'https://raw.githubusercontent.com/Protofy-xyz/Protofy/assets/templates/ecomerce/beanie.png',
        priceRange: [10.00],
    },
    {
        id: '7',
        name: 'Saleor Reversed T-shirt',
        category: 'T-shirts',
        image: 'https://raw.githubusercontent.com/Protofy-xyz/Protofy/assets/templates/ecomerce/t-shirt.png',
        priceRange: [22.50],
    },
    {
        id: '8',
        name: 'Saleor Neck Warmer',
        category: 'Scarfs',
        image: 'https://raw.githubusercontent.com/Protofy-xyz/Protofy/assets/templates/ecomerce/neck-warmer.png',
        priceRange: [18.00],
    },
    {
        id: '9',
        name: 'Saleor Cushion',
        category: 'Accessories',
        image: 'https://raw.githubusercontent.com/Protofy-xyz/Protofy/assets/templates/ecomerce/cushion.png',
        priceRange: [18.00],
    }
]

const PageComponent = (props) => {
    const router = useRouter();
    context.onRender(() => {

    });
    return (
    <Page>
        <DefaultLayout headerTitle="Protofy-Store" title="ProtofyStore" description="Made with love from Barcelona"
            footer={<Footer />}
        >
        <ContainerLarge paddingBottom="$20" paddingTop="$6">
            <YStack mx="$5">
                <Grid gap={"2rem"} itemMinWidth={280}>
                    {
                    products.map((product) => (
                    <ProductGridElement id={product.id} name={product.name} category={product.category}
                        image={product.image} priceRange={product.priceRange} />
                    ))
                    }
                </Grid>
            </YStack>
        </ContainerLarge>
        </DefaultLayout>
    </Page>
    )
}

const ProductGridElement = ({ id, name, category, image, priceRange }) => {
    return (
    <YStack id={id} cursor="pointer">
        <YStack bg="$background" alignItems="center" marginBottom={12}>
            <Image width={330} aspectRatio={"1/1"} url={image} />
        </YStack>
        <XStack display="flex">
            <YStack display="flex" flex={1} space="$2">
                <Text fontSize={14} fontWeight={"600"}>{name}</Text>
                <Text theme="alt2" fontSize={14}>{category}</Text>
            </YStack>
            <YStack>
                <Text fontSize={14} fontWeight={"500"}>{priceRange.length > 1 ?
                    (`${CURRENCY}${priceRange[0]}-${CURRENCY}${priceRange[1]}`) : (CURRENCY + priceRange[0])}</Text>
            </YStack>
        </XStack>
    </YStack>
    );
}

const Footer = () => (
    <ProtoFooter>
        <FooterElement flex={2} marginTop="$-1" marginBottom="$2" space="$4">
            <NextLink href="/" aria-label="Homepage">
                <H4><strong>Protofy-Store</strong></H4>
            </NextLink>
            <Paragraph marginTop="$2" size="$3">
                Made with love
            </Paragraph>
        </FooterElement>

        <FooterElement title=" " links={[ { href: '#' , caption: 'About' }, { href: '#' , caption: 'Documentation' }, ]} />

        <FooterElement title="Collections" links={[ { href: '#' , caption: 'Featured Products' }, { href: '#' ,
            caption: 'Summer Picks' }, ]} />
    </ProtoFooter>
)

export default {
    route: Protofy("route", "{{route}}"),
    component: (props) => PageComponent(props),
    getServerSideProps: SSR(async (context) => withSession(context, isProtected?Protofy("permissions",
    {{{permissions}}}):undefined))
}