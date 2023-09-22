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

import componentWrapper from './visualuiWrapper'


const visualUiComponents = {
  ActiveGroup: [ActiveGroup, 'EyeOff'],
  ActiveGroupButton: [ActiveGroupButton, 'EyeOff'],
  ActiveRender: [ActiveRender, 'EyeOff'],
  AnounceBubble: [AnounceBubble, 'Tv2', { href: "/hello", children: "hello" }],
  AsyncView: [AsyncView, 'EyeOff'],
  BackgroundGradient: [BackgroundGradient, 'Scroll'],
  BarChart: [BarChart, 'BarChartHorizontalBig', {
    data: [
      { color: '$pink9', name: 'one', value: 0.12 },
      { color: '$purple9', name: 'two', value: 0.063 },
      { color: '$blue9', name: 'three', value: 0.108 },
      { color: '$orange9', name: 'four', value: 0.73 }
    ],
    large: true,
    animatedEnter: false,
    selectedElement: 'two'
  }
  ],
  BigTitle: [BigTitle, 'Type', { children: "hello" }],
  BlockTitle: [BlockTitle, 'Text', { title: "hello", subtitle: "world" }],
  ButtonGroup: [ButtonGroup, 'EyeOff'],
  ButtonLink: [ButtonLink, 'ExternalLink', { href: "/hello", children: "hello" }],
  ButtonSimple: [ButtonSimple, 'MousePointerSquare', { children: "hello" }],
  Center: [Center, 'AlignVerticalSpaceAround'],
  CheckCircle: [CheckCircle, 'Check'],
  Code: [Code, 'Code', { children: "helloworld" }],
  CodeInLine: [CodeInline, 'Terminal', { children: "helloworld" }],
  ColorToggleButton: [ColorToggleButton, 'ToggleRight'],
  Container: [Container, 'Box'],
  ContainerLarge: [ContainerLarge, 'Package'],
  ContainerXL: [ContainerXL, 'Container'],
  CopyBubble: [CopyBubble, 'Copy', { text: "copy" }],
  DataCard: [DataCard, 'CreditCard', { name: "hello title", maxWidth: "300px", json: { "name": "hello", "surname": "world" } }],
  DataTable: [DataTable, 'Table2', { title: "hello", rows: [['hello', 'world'], ['world', 'hello']] }],
  EditableText: [EditableText, 'PencilLine', { description: "hello", text: "world" }],
  ElevatedArea: [ElevatedArea, 'GalleryThumbnails'],
  ErrorMessage: [ErrorMessage, 'AlertTriangle'],
  FeatureItem: [FeatureItem, 'CheckCircle2', { label: "hello", children: "world" }],
  FancyCard: [FancyCard, 'SquareAsterisk'],
  Grid: [Grid, 'Grid2X2'],
  GridElement: [GridElement, 'LayoutGrid', { title: "hello", children: "world" }],
  Head1: [Head1, 'Heading1', { children: "hello" }],
  Head2: [Head2, 'Heading2', { children: "hello" }],
  Head3: [Head3, 'Heading3', { children: "hello" }],
  HeaderLink: [HeaderLink, 'Link2', { href: "/hello", children: "hello" }],
  HorizontalBox: [HorizontalBox, 'RectangleHorizontal'],
  HR: [HR, 'MinusSquare'],
  IconStack: [IconStack, 'SquareStack'],
  ItemCard: [ItemCard, 'CreditCard', { children: "hello world!" }],
  Link: [Link, 'Link', { href: "/hello", children: "hello" }],
  LinkGroup: [LinkGroup, 'Group', { href: "/hello", children: "hello" }],
  LinkGroupItem: [LinkGroupItem, 'Puzzle', { href: "/hello", children: "hello" }],
  ParagraphLink: [ParagraphLink, 'Link', { href: "/hello", children: "hello" }],
  Logo: [Logo, 'Cherry', { text: "protofy" }],
  LogoIcon: [LogoIcon, 'Hexagon', { children: "hello world!" }],
  MainButton: [MainButton, 'MousePointerSquare', { children: "hello world!" }],
  NextLink: [NextLink, 'EyeOff', { href: "/hello", children: "hello" }],
  Notice: [Notice, 'Globe2', { children: "Hello world!" }],
  OverlayCard: [OverlayCard, 'CreditCard'],
  OverlayCardBasic: [OverlayCardBasic, 'CreditCard', {
    title: "Hello",
    subtitle: "Hello World!",
    caption: "go",
    href: "http://google.com"
  }],
  Page: [Page, 'EyeOff', {}, {
    canDrag: () => false
  }],
  PageGlow: [PageGlow, 'EyeOff'],
  PanelMenuItem: [PanelMenuItem, 'Puzzle', { text: "hello world" }],
  Pre: [Pre, 'EyeOff'],
  RainbowText: [RainbowText, 'Rainbow', { children: "hello world" }],
  Search: [Search, 'Search'],
  Section: [Section, 'EyeOff'],
  SectionBlock: [SectionBlock, 'BoxSelect'],
  TitleLink: [TitleLink, 'Link', { href: "/hello", children: "hello" }],
  SideBySide: [SideBySide, 'PanelLeftInactive'],
  SpotLight: [SpotLight, 'Sun'],
  SubTitle: [SubTitle, 'Type', { children: "hello world" }],
  TabGroup: [TabGroup, 'Group', { title: "hello" }],
  TamaCard: [TamaCard, 'CreditCard', {
    title: "hello title",
    description: "description",
    children: "Lorem ipsum dolor sit amet"
  }],
  ThemeToggle: [ThemeToggle, 'Palette', { chromeless: true }],
  TintSection: [TintSection, 'BoxSelect'],
  HomeSection: [HomeSection, 'BoxSelect'],
  TooltipContainer: [TooltipContainer, 'BoxSelect', { tooltipText: "Hello" }],
  UL: [UL, 'MessageCircle', { children: "hello world" }],
  XCenterStack: [XCenterStack, 'AlignVerticalSpaceAround']
}

export default Object.keys(visualUiComponents).reduce((total, componentName) => {
  var importInfo = {
    moduleSpecifier: 'protolib',
    namedImports: [{ name: componentName, alias: undefined }]
    // defaultImport: componentName
  }
  return {
    ...total,
    [componentName]: componentWrapper(visualUiComponents[componentName][0], visualUiComponents[componentName][1], componentName, visualUiComponents[componentName][2], importInfo, visualUiComponents[componentName][3])
  }
}, {})

