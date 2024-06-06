import ActiveGroup from '../components/ActiveGroup'
import ActiveGroupButton from '../components/ActiveGroupButton'
import ActiveRender from '../components/ActiveRender'
import AnounceBubble from '../components/AnounceBubble'
import AppBar from '../components/AppBar'
import AsyncView from '../components/AsyncView'
import BackgroundGradient from '../components/BackgroundGradient'
import BarChart from '../components/BarChart'
import BigTitle from '../components/BigTitle'
import BlockTitle from '../components/BlockTitle'
import ButtonGroup from '../components/ButtonGroup'
import ButtonSimple from '../components/ButtonSimple'
import Center from '../components/Center'
import { CheckCircle } from '../components/CheckCircle'
import { Code, CodeInline } from '../components/Code'
import { ColorToggleButton } from '../components/ColorToggleButton'
import { Container, ContainerLarge, ContainerXL } from '../components/Container'
import { CopyBubble } from '../components/CopyBubble'
import { DataCard } from '../components/DataCard'
import { DataTable } from '../components/DataTable'
import { DataView } from '../components/DataView'
import { DiscordIcon } from '../components/icons/DiscordIcon'
import { GithubIcon } from '../components/icons/GithubIcon'
import EditableText from '../components/EditableText'
import ElevatedArea from '../components/ElevatedArea'
//import { ErrorBoundary } from '../components/ErrorBoundary'
import ErrorMessage from '../components/ErrorMessage'
import FeatureItem from '../components/FeatureItem'
import { FancyCard } from '../components/FancyCard'
import { Grid } from '../components/Grid'
import GridElement from '../components/GridElement'
import { Head1 } from '../components/Head1'
import { Head2 } from '../components/Head2'
import { Head3 } from '../components/Head3'
import { Text } from '../components/Text'
import { HeaderLink } from '../components/HeaderLink'
import HorizontalBox from '../components/HorizontalBox'
import HoveredGroup from '../components/HoveredGroup'
import { HR } from '../components/HR'
import { IconStack } from '../components/IconStack'
import { Input } from '../components/Input'
import Image from '../components/Image'
import { ItemCard } from '../components/ItemCard'
import { ButtonLink, Link, ParagraphLink } from '../components/Link'
import { LinkGroup, LinkGroupItem } from '../components/LinkGroup'
import { Logo } from '../components/Logo'
import { LogoIcon } from '../components/LogoIcon'
import MainButton from '../components/MainButton'
import { NextLink } from '../components/NextLink'
import { Notice } from '../components/Notice'
import OverlayCard from '../components/OverlayCard'
import OverlayCardBasic from '../components/OverlayCardBasic'
import Page from '../components/Page'
import { PageGlow } from '../components/PageGlow'
import { PanelMenuItem } from '../components/PanelMenuItem'
import { Pre } from '../components/Pre'
import RainbowText from '../components/RainbowText'
import { Search } from '../components/Search'
import Section from '../components/Section'
import SectionBox from '../components/SectionBox'
import SectionBlock, { TitleLink } from '../components/SectionBlock'
import SideBySide from '../components/SideBySide'
import SpotLight from '../components/SpotLight'
import { SubTitle } from '../components/SubTitle'
import TabGroup from '../components/TabGroup'
import { TamaCard } from '../components/TamaCard'
import { ThemeTint } from '../lib/Tints'
import { ThemeToggle } from '../components/ThemeToggle'
import { TintSection, HomeSection, useTintSectionIndex } from '../components/TintSection'
import TooltipContainer from '../components/TooltipContainer'
import { TwitterIcon } from '../components/icons/TwitterIcon'

import { UL } from '../components/UL'
import Video from '../components/Video'
//import { unwrapText } from '../components/unwrapText'
import HCenterStack from '../components/HCenterStack'

import { getComponentWrapper, BasicPlaceHolder } from './visualuiWrapper'
import { AlertDialog } from '../components/AlertDialog'

import htmlBasicElements from './htmlBasics'
import VStack from '../components/VStack'
import HStack from '../components/HStack'
import VCenterStack from '../components/VCenterStack'
import Spacer from '../components/Spacer'
import { AdminPage } from '../components/AdminPage'
import { alignSelf, fontStyle, textAlign, fontWeight, flexDirection, justifyContent, resizeMode } from './shortcuts'
import { ProtoView } from '../components/ProtoView'
import molecules from './molecules'

const cw = getComponentWrapper('protolib')

const nonDraggable = { custom: { hidden: true } }

const uiDataText = {
  custom: {
    shortcuts: [
      alignSelf,
      textAlign,
      fontStyle,
      fontWeight
    ]
  }
}

export const textPalette = {
  ...cw(Head1, 'Heading1', 'Head1', { children: "hello" }, uiDataText, {}, true),
  ...cw(Head2, 'Heading2', 'Head2', { children: "hello" }, uiDataText, {}, true),
  ...cw(Head3, 'Heading3', 'Head3', { children: "hello" }, uiDataText, {}, true),
  ...cw(Text, 'Type', 'Text', { children: "hello" }, uiDataText, {}, true),
  ...cw(BlockTitle, 'Text', 'BlockTitle', { title: "hello", subtitle: "world" }, { rules: { canMoveIn: () => false } }),
  ...cw(RainbowText, 'Rainbow', 'RainbowText', { children: "hello world", fontWeight: "bold", fontSize:"$16", lineHeight:"$16" }, {}, {}, true),
}

export const layoutPalette = {
  ...cw(VStack, 'ArrowDownSquare', 'VStack', {}, {}, { children: <BasicPlaceHolder /> }),
  ...cw(HStack, 'ArrowRightSquare', 'HStack', {}, {}, { children: <BasicPlaceHolder /> }),
  ...cw(Center, 'AlignVerticalSpaceAround', 'Center', {}, {}, { children: <BasicPlaceHolder /> }),
  ...cw(Spacer, 'Maximize2', 'Spacer', { size: '$8' }),
  ...cw(ProtoView, 'SquareAsterisk', 'ProtoView', { viewId: "default", currentView: { value: "currentView", kind: 'Identifier' } }, {}, { placeholder: <BasicPlaceHolder /> }),
  ...cw(Section, 'BoxSelect', 'Section', {}, {}, { children: <BasicPlaceHolder /> })
}

export const basicPalette = {
  ...cw(BigTitle, 'Type', 'BigTitle', { children: "hello" }, {
    custom: {
      shortcuts: [
        fontStyle
      ]
    }
  }, {}, true),
  ...cw(ButtonSimple, 'MousePointerSquare', 'ButtonSimple', { children: "Press Me" }, {
    custom: {
      shortcuts: [
        alignSelf
      ],
      options: [
        {
          action: ({ dom }) => { dom.focus() },
          name: "Focus element"
        },
        {
          action: ({ dom, metadata, props }) => {
            const funct = new Function(...Object.keys(metadata.context), "return " + (props.onPress?.slice(1, - 1) ?? ""));
            props.onPress ? funct(...Object.values(metadata.context))() : null
          },
          name: "Click element"
        }
      ]
    }
  }, {}, true),
  ...cw(Container, 'SquareAsterisk', 'Container', {}, {
    custom: {
      shortcuts: [
        flexDirection,
        justifyContent
      ]
    }
  }, { children: <BasicPlaceHolder /> }),
  ...cw(Image, 'Image', 'Image', { url: "/images/patterns/pattern-1.png" }, {
    custom: {
      shortcuts: [
        alignSelf,
        resizeMode
      ]
    }
  }, {}, true),
  ...cw(Input, 'TextCursorInput', 'Input', { state: { value: "cs.inputValue", kind: "PropertyAccessExpression" } }),
}

export const miscellanyPalette = {
  ...htmlBasicElements,
  ...cw(ActiveGroup, 'EyeOff', 'ActiveGroup', {}, nonDraggable, { children: <BasicPlaceHolder /> }),
  ...cw(ActiveGroupButton, 'EyeOff', 'ActiveGroupButton', {}, nonDraggable),
  ...cw(ActiveRender, 'EyeOff', 'ActiveRender', {}, nonDraggable),
  ...cw(AnounceBubble, 'Tv2', 'AnounceBubble', { href: "/hello", children: "hello" }),
  ...cw(AppBar, 'CreditCard', 'AppBar'),
  ...cw(AsyncView, 'EyeOff', 'AsyncView', {}, nonDraggable),
  ...cw(BackgroundGradient, 'Scroll', 'BackgroundGradient'),
  ...cw(BarChart, 'BarChartHorizontalBig', 'BarChart', {
    data: [
      { color: '$pink9', name: 'one', value: 0.12 },
      { color: '$purple9', name: 'two', value: 0.063 },
      { color: '$blue9', name: 'three', value: 0.108 },
      { color: '$orange9', name: 'four', value: 0.73 }
    ],
    large: true,
    animatedEnter: false,
    selectedElement: 'two'
  }),
  ...cw(ButtonGroup, 'EyeOff', 'ButtonGroup', {}, nonDraggable, { children: <BasicPlaceHolder /> }),
  ...cw(ButtonLink, 'ExternalLink', 'ButtonLink', { href: "/hello", children: "hello" }),
  ...cw(CheckCircle, 'Check', 'CheckCircle'),
  ...cw(Code, 'Code', 'Code', { children: "helloworld" }, {}, {}, true),
  ...cw(CodeInline, 'Terminal', 'CodeInline', { children: "helloworld" }, {}, {}, true),
  ...cw(ContainerLarge, 'Package', 'ContainerLarge', {}, {}, { children: <BasicPlaceHolder /> }),
  ...cw(ContainerXL, 'Container', 'ContainerXL', {}, {}, { children: <BasicPlaceHolder /> }),
  ...cw(ColorToggleButton, 'ToggleRight', 'ColorToggleButton'),
  ...cw(CopyBubble, 'Copy', 'CopyBubble', { text: "copy" }),
  ...cw(HorizontalBox, 'RectangleHorizontal', 'HorizontalBox', {}, {}, { children: <BasicPlaceHolder /> }),
  ...cw(DataCard, 'CreditCard', 'DataCard', { name: "hello title", maxWidth: "300px", json: { "name": "hello", "surname": "world" } }, { rules: { canMoveIn: () => false } }),
  ...cw(DataTable, 'Table2', 'DataTable', { title: "hello", rows: [['hello', 'world'], ['world', 'hello']] }),
  ...cw(DataView, 'EyeOff', 'DataView', {}, {
    custom: {
      hidden: true,
      options: [
        {
          action: ({ dom }) => { dom.querySelector('#tableView-list').click() },
          name: "Change to List View"
        },
        {
          action: ({ dom }) => { dom.querySelector('#tableView-grid')?.click() },
          name: "Change to Grid View"
        },
        {
          action: ({ dom }) => { dom.querySelector('#tableView-raw')?.click() },
          name: "Change to Raw View"
        }
      ]
    }
  }),
  ...cw(DiscordIcon, 'LogoIcon', 'DiscordIcon', { width: 23, plain: true }),
  ...cw(EditableText, 'PencilLine', 'EditableText', { description: "hello", text: "world" }, { rules: { canMoveIn: () => false } }),
  ...cw(ElevatedArea, 'GalleryThumbnails', 'ElevatedArea'),
  ...cw(ErrorMessage, 'AlertTriangle', 'ErrorMessage'),
  ...cw(FeatureItem, 'CheckCircle2', 'FeatureItem', { label: "hello", children: "world" }),
  ...cw(FancyCard, 'SquareAsterisk', 'FancyCard'),
  ...cw(GithubIcon, 'LogoIcon', 'GithubIcon', { width: 23, plain: true }),
  ...cw(Grid, 'LayoutGrid', 'Grid'),
  ...cw(GridElement, 'LayoutGrid', 'GridElement', { title: "hello", children: "world" }),
  ...cw(HeaderLink, 'Link2', 'HeaderLink', { href: "/hello", children: "hello" }),
  ...cw(HoveredGroup, 'RectangleHorizontal', 'HoveredGroup', {}, {}, { children: <BasicPlaceHolder /> }),
  ...cw(HR, 'MinusSquare', 'HR'),
  ...cw(IconStack, 'SquareStack', 'IconStack'),
  ...cw(ItemCard, 'CreditCard', 'ItemCard', { children: "hello world!" }, {}, {}, true),
  ...cw(Link, 'Link', 'Link', { href: "/hello", children: "hello" }),
  ...cw(LinkGroup, 'Group', 'LinkGroup', { href: "/hello", children: "hello" }),
  ...cw(LinkGroupItem, 'Puzzle', 'LinkGroupItem', { href: "/hello", children: "hello" }),
  ...cw(ParagraphLink, 'Link', 'ParagraphLink', { href: "/hello", children: "hello" }),
  ...cw(Logo, 'Cherry', 'Logo', { text: "protofy" }),
  ...cw(LogoIcon, 'Hexagon', 'LogoIcon', { children: "hello world!" }, {}, {}, true),
  ...cw(MainButton, 'MousePointerSquare', 'MainButton', { children: "hello world!" }, {}, {}, true),
  ...cw(NextLink, 'EyeOff', 'NextLink', { href: "/hello", children: "hello" }, nonDraggable),
  ...cw(Notice, 'Globe2', 'Notice', { children: "Hello world!" }, {}, {}, true),
  ...cw(OverlayCard, 'CreditCard', 'OverlayCard', {}, {}, { children: <BasicPlaceHolder /> }),
  ...cw(OverlayCardBasic, 'CreditCard', 'OverlayCardBasic', {
    title: "Hello",
    subtitle: "Hello World!",
    caption: "go",
    href: "http://google.com"
  }),
  ...cw(Page, 'EyeOff', 'Page', {}, nonDraggable, { children: <BasicPlaceHolder /> }),
  ...cw(AdminPage, 'EyeOff', 'AdminPage', {}, nonDraggable),
  ...cw(PageGlow, 'EyeOff', 'PageGlow'),
  ...cw(PanelMenuItem, 'Puzzle', 'PanelMenuItem', { text: "hello world" }),
  ...cw(Pre, 'EyeOff', 'Pre', {}, nonDraggable),
  ...cw(Search, 'Search', 'Search'),
  ...cw(SectionBox, 'RectangleHorizontal', 'SectionBox', {}, {}, { children: <BasicPlaceHolder /> }),
  ...cw(SectionBlock, 'BoxSelect', 'SectionBlock'),
  ...cw(TitleLink, 'Link', 'TitleLink', { href: "/hello", children: "hello" }),
  ...cw(SideBySide, 'PanelLeftInactive', 'SideBySide'),
  ...cw(SpotLight, 'Sun', 'SpotLight'),
  // ...cw(SubTitle, 'Type', 'SubTitle', { children: "hello world" }),
  ...cw(TabGroup, 'Group', 'TabGroup', { title: "hello" }),
  ...cw(TamaCard, 'CreditCard', 'TamaCard', {
    title: "hello title",
    description: "description",
    children: "Lorem ipsum dolor sit amet"
  }),
  ...cw(ThemeTint, 'Palette', 'ThemeTint'),
  ...cw(ThemeToggle, 'Palette', 'ThemeToggle', { chromeless: true }),
  ...cw(TintSection, 'BoxSelect', 'TintSection'),
  ...cw(HomeSection, 'BoxSelect', 'HomeSection'),
  ...cw(TooltipContainer, 'BoxSelect', 'TooltipContainer', { tooltipText: "Hello" }),
  ...cw(TwitterIcon, 'LogoIcon', 'TwitterIcon', { width: 23 }),
  ...cw(UL, 'MessageCircle', 'UL', { children: "hello world" }, {}, {}, true),
  ...cw(Video, 'Video', 'Video', {}, {}, {}, true),
  ...cw(HCenterStack, 'AlignVerticalSpaceAround', 'HCenterStack'),
  ...cw(VCenterStack, 'AlignVerticalSpaceAround', 'VCenterStack'),
  ...cw(AlertDialog, 'Group', 'AlertDialog', {}, nonDraggable)
}

export default {
  atoms: {
    basic: basicPalette,
    text: textPalette,
    layout: layoutPalette,
    miscellany: miscellanyPalette,
  },
  molecules,
}
