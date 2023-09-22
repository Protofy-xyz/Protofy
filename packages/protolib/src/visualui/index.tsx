import ActiveGroup from '../components/ActiveGroup'
import ActiveGroupButton from '../components/ActiveGroupButton'
import ActiveRender from '../components/ActiveRender'
import AnounceBubble from '../components/AnounceBubble'
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
import { HeaderLink } from '../components/HeaderLink'
import HorizontalBox from '../components/HorizontalBox'
import { HR } from '../components/HR'
import { IconStack } from '../components/IconStack'
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
import SectionBlock, { TitleLink } from '../components/SectionBlock'
import SideBySide from '../components/SideBySide'
import SpotLight from '../components/SpotLight'
import { SubTitle } from '../components/SubTitle'
import TabGroup from '../components/TabGroup'
import { TamaCard } from '../components/TamaCard'
import { ThemeToggle } from '../components/ThemeToggle'
import { TintSection, HomeSection, useTintSectionIndex } from '../components/TintSection'
import TooltipContainer from '../components/TooltipContainer'
import { UL } from '../components/UL'
//import { unwrapText } from '../components/unwrapText'
import XCenterStack from '../components/XCenterStack'

import getComponentWrapper from './visualuiWrapper'

const cw = getComponentWrapper({
  moduleSpecifier: 'protolib',
  namedImports: [{ alias: undefined }]
  // defaultImport: componentName
})

export default {
  ActiveGroup: cw(ActiveGroup, 'EyeOff', 'ActiveGroup'),
  ActiveGroupButton: cw(ActiveGroupButton, 'EyeOff', 'ActiveGroupButton'),
  ActiveRender: cw(ActiveRender, 'EyeOff', 'ActiveRender'),
  AnounceBubble: cw(AnounceBubble, 'Tv2', 'AnounceBubble', { href: "/hello", children: "hello" }),
  AsyncView: cw(AsyncView, 'EyeOff', 'AsyncView'),
  BackgroundGradient: cw(BackgroundGradient, 'Scroll', 'BackgroundGradient'),
  BarChart: cw(BarChart, 'BarChartHorizontalBig', 'BarChart', {
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
  BigTitle: cw(BigTitle, 'Type', 'BigTitle', { children: "hello" }),
  BlockTitle: cw(BlockTitle, 'Text', 'BlockTitle', { title: "hello", subtitle: "world" }),
  ButtonGroup: cw(ButtonGroup, 'EyeOff', ButtonGroup),
  ButtonLink: cw(ButtonLink, 'ExternalLink', 'ButtonLink', { href: "/hello", children: "hello" }),
  ButtonSimple: cw(ButtonSimple, 'MousePointerSquare', 'ButtonSimple', { children: "hello" }),
  Center: cw(Center, 'AlignVerticalSpaceAround', 'Center'),
  CheckCircle: cw(CheckCircle, 'Check', 'CheckCircle'),
  Code: cw(Code, 'Code', 'Code', { children: "helloworld" }),
  CodeInLine: cw(CodeInline, 'Terminal', 'CodeInLine', { children: "helloworld" }),
  ColorToggleButton: cw(ColorToggleButton, 'ToggleRight', 'ColorToggleButton'),
  Container: cw(Container, 'Box', 'Container'),
  ContainerLarge: cw(ContainerLarge, 'Package', 'ContainerLarge'),
  ContainerXL: cw(ContainerXL, 'Container', 'ContainerXL'),
  CopyBubble: cw(CopyBubble, 'Copy', 'CopyBubble', { text: "copy" }),
  DataCard: cw(DataCard, 'CreditCard', 'DataCard', { name: "hello title", maxWidth: "300px", json: { "name": "hello", "surname": "world" } }),
  DataTable: cw(DataTable, 'Table2', 'DataTable', { title: "hello", rows: [['hello', 'world'], ['world', 'hello']] }),
  EditableText: cw(EditableText, 'PencilLine', 'EditableText', { description: "hello", text: "world" }),
  ElevatedArea: cw(ElevatedArea, 'GalleryThumbnails', 'ElevatedArea'),
  ErrorMessage: cw(ErrorMessage, 'AlertTriangle', 'ErrorMessage'),
  FeatureItem: cw(FeatureItem, 'CheckCircle2', 'FeatureItem', { label: "hello", children: "world" }),
  FancyCard: cw(FancyCard, 'SquareAsterisk', 'FancyCard'),
  Grid: cw(Grid, 'LayoutGrid', 'Grid'),
  GridElement: cw(GridElement, 'LayoutGrid', 'GridElement', { title: "hello", children: "world" }),
  Head1: cw(Head1, 'Heading1', 'Head1', { children: "hello" }),
  Head2: cw(Head2, 'Heading2', 'Head2', { children: "hello" }),
  Head3: cw(Head3, 'Heading3', 'Head3', { children: "hello" }),
  HeaderLink: cw(HeaderLink, 'Link2', 'HeaderLink', { href: "/hello", children: "hello" }),
  HorizontalBox: cw(HorizontalBox, 'RectangleHorizontal', 'HorizontalBox'),
  HR: cw(HR, 'MinusSquare', 'HR'),
  IconStack: cw(IconStack, 'SquareStack', 'IconStack'),
  ItemCard: cw(ItemCard, 'CreditCard', 'ItemCard', { children: "hello world!" }),
  Link: cw(Link, 'Link', 'Link', { href: "/hello", children: "hello" }),
  LinkGroup: cw(LinkGroup, 'Group', 'LinkGroup', { href: "/hello", children: "hello" }),
  LinkGroupItem: cw(LinkGroupItem, 'Puzzle', 'LinkGroupItem', { href: "/hello", children: "hello" }),
  ParagraphLink: cw(ParagraphLink, 'Link', 'ParagraphLink', { href: "/hello", children: "hello" }),
  Logo: cw(Logo, 'Cherry', 'Logo', { text: "protofy" }),
  LogoIcon: cw(LogoIcon, 'Hexagon', 'LogoIcon', { children: "hello world!" }),
  MainButton: cw(MainButton, 'MousePointerSquare', 'MainButton', { children: "hello world!" }),
  NextLink: cw(NextLink, 'EyeOff', 'NextLink', { href: "/hello", children: "hello" }),
  Notice: cw(Notice, 'Globe2', 'Notice', { children: "Hello world!" }),
  OverlayCard: cw(OverlayCard, 'CreditCard', 'OverlayCard'),
  OverlayCardBasic: cw(OverlayCardBasic, 'CreditCard', 'OverlayCardBasic', {
    title: "Hello",
    subtitle: "Hello World!",
    caption: "go",
    href: "http://google.com"
  }),
  Page: cw(Page, 'EyeOff', 'Page', {}, {
    canDrag: () => false
  }),
  PageGlow: cw(PageGlow, 'EyeOff', 'PageGlow'),
  PanelMenuItem: cw(PanelMenuItem, 'Puzzle', 'PanelMenuItem',{ text: "hello world" }),
  Pre: cw(Pre, 'EyeOff', 'Pre'),
  RainbowText: cw(RainbowText, 'Rainbow', 'RainbowText', { children: "hello world" }),
  Search: cw(Search, 'Search', 'Search'),
  Section: cw(Section, 'EyeOff', 'Section'),
  SectionBlock: cw(SectionBlock, 'BoxSelect', 'SectionBlock'),
  TitleLink: cw(TitleLink, 'Link', 'TitleLink', { href: "/hello", children: "hello" }),
  SideBySide: cw(SideBySide, 'PanelLeftInactive', 'SideBySide'),
  SpotLight: cw(SpotLight, 'Sun', 'SpotLight'),
  SubTitle: cw(SubTitle, 'Type', 'SubTitle', { children: "hello world" }),
  TabGroup: cw(TabGroup, 'Group', 'TabGroup', { title: "hello" }),
  TamaCard: cw(TamaCard, 'CreditCard', 'TamaCard', {
    title: "hello title",
    description: "description",
    children: "Lorem ipsum dolor sit amet"
  }),
  ThemeToggle: cw(ThemeToggle, 'Palette', 'ThemeToggle', { chromeless: true }),
  TintSection: cw(TintSection, 'BoxSelect', 'TintSection'),
  HomeSection: cw(HomeSection, 'BoxSelect', 'HomeSection'),
  TooltipContainer: cw(TooltipContainer, 'BoxSelect', 'TooltipContainer', { tooltipText: "Hello" }),
  UL: cw(UL, 'MessageCircle', 'UL', { children: "hello world" }),
  XCenterStack: cw(XCenterStack, 'AlignVerticalSpaceAround', 'XCenterStack')
}

