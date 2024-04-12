import { YStack, Text, XStack, H4 } from "@my/ui";
import { Image, SSR, ContainerLarge, withSession, Page, Grid, NextLink, Logo, FooterElement, Footer as ProtoFooter, API }
from "protolib";
import { DefaultLayout } from "../../../layout/DefaultLayout";
import { Protofy } from "protolib/base";
import { Paragraph } from '@my/ui';
import { context } from "app/bundles/uiContext";

const isProtected = Protofy("protected", {{protected}})

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
    return (
    <Page>
        <DefaultLayout headerTitle="Protofy-Store" title="ProtofyStore" description="Made with love from Barcelona"
            footer={<Footer />}
        >
        <ContainerLarge pb="$20" pt="$6">
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
        <YStack bg="$background" ai="center" mb={12}>
            <Image width={330} aspectRatio={"1/1"} url={image} />
        </YStack>
        <XStack display="flex">
            <YStack display="flex" f={1} space="$2">
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
        <FooterElement flex={2} mt="$-1" mb="$2" space="$4">
            <NextLink href="/" aria-label="Homepage">
                <H4><strong>Protofy-Store</strong></H4>
            </NextLink>
            <Paragraph mt="$2" size="$3">
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