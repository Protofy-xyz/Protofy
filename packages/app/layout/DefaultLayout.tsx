import { Footer } from './Footer'
import { HeaderContents } from './HeaderContents'
import { DefaultLayout as ProtoDefaultLayout } from 'protolib'
import { AppBar } from 'protolib'
import React from 'react'
import { StackProps } from 'tamagui'
import { HeaderMenu } from './HeaderMenu'
import { HeaderMenuContent } from './HeaderMenuContent'

export const DefaultLayout = React.forwardRef((props: {
  sideMenu?: React.ReactNode | null;
  children: React.ReactNode;
  footer?: React.ReactNode;
  header?: React.ReactNode;
  headerTitle?: string;
  seoProps?: any;
  title?: string;
  description?: string;
  openGraph?: any;
  tintSwitcher?: boolean;
  themeSwitcher?: boolean;
} & StackProps, ref: any) => <ProtoDefaultLayout
    ref={ref}
    sideMenu={null}
    footer={<Footer />}
    header={<AppBar>
      <HeaderContents tintSwitcher={props.tintSwitcher} themeSwitcher={props.themeSwitcher} headerTitle={props.headerTitle} menu={<HeaderMenu menuPlacement={'bottom'}>
        <HeaderMenuContent />
      </HeaderMenu>} />
    </AppBar>}
    title="Protofy"
    description="Protofy"
    openGraph={{
      type: 'website',
      locale: 'en_US',
      url: 'https://protofy.xyz',
      siteName: 'Protofy',
      images: [
        {
          url: 'https://protofy.xyz/social.png',
        },
      ],
    }} {...props}>{props.children}</ProtoDefaultLayout>
)