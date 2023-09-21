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
// import { LinkGroup } from '../components/LinkGroup'
import { Logo } from '../components/Logo'
// import { LogoIcon } from '../components/LogoIcon'
// import MainButton from '../components/MainButton'
// import { NextLink } from '../components/NextLink'
import { Notice } from '../components/Notice'
import OverlayCard from '../components/OverlayCard'
import OverlayCardBasic from '../components/OverlayCardBasic'
import Page from '../components/Page'
import { PageGlow } from '../components/PageGlow'
// import { PanelMenuItem } from '../components/PanelMenuItem'
// import { Pre } from '../components/Pre'
import RainbowText from '../components/RainbowText'
// import Section from '../components/Section'
import SectionBlock, { TitleLink } from '../components/SectionBlock'
import SideBySide from '../components/SideBySide'
import SpotLight from '../components/SpotLight'
// import { SubTitle } from '../components/SubTitle'
import TabGroup from '../components/TabGroup'
import { TamaCard } from '../components/TamaCard'
// import { ThemeToggle } from '../components/ThemeToggle'
// import { TintSection } from '../components/TintSection'
// import TooltipContainer from '../components/TooltipContainer'
// import { UL } from '../components/UL'
// import { unwrapText } from '../components/unwrapText'
// import XCenterStack from '../components/XCenterStack'




import componentWrapper from './visualuiWrapper'




const visualUiComponents = {
  ActiveGroup: [ActiveGroup],
  ActiveGroupButton: [ActiveGroupButton],
  ActiveRender: [ActiveRender],
  AnounceBubble: [AnounceBubble, { href: "/hello", children: "hello" }],
  AsyncView: [AsyncView],
  BackgroundGradient: [BackgroundGradient],
  BarChart: [BarChart, {
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
  BigTitle: [BigTitle, { children: "hello" }],
  BlockTitle: [BlockTitle, { title: "hello", subtitle: "world" }],
  ButtonGroup: [ButtonGroup],
  ButtonSimple: [ButtonSimple, { children: "hello" }],
  Center: [Center],
  CheckCircle: [CheckCircle],
  Code: [Code, { children: "helloworld" }],
  CodeInLine: [CodeInline, { children: "helloworld" }],
  ColorToggleButton: [ColorToggleButton],
  Container: [Container],
  ContainerLarge: [ContainerLarge],
  ContainerXL: [ContainerXL],
  CopyBubble: [CopyBubble, { text: "copy" }],
  DataCard: [DataCard, { name: "hello title", maxWidth: "300px", json: { "name": "hello", "surname": "world" } }],
  DataTable: [DataTable, { title: "hello", rows: [['hello', 'world'], ['world', 'hello']] }],
  EditableText: [EditableText, { description: "hello", text: "world" }],
  ElevatedArea: [ElevatedArea],
  ErrorMessage: [ErrorMessage],
  FeatureItem: [FeatureItem, { label: "hello", children: "world" }],
  FancyCard: [FancyCard],
  Grid: [Grid, 'Grid'],
  GridElement: [GridElement, { title: "hello", children: "world" }],
  Head1: [Head1, { children: "hello" }],
  Head2: [Head2, { children: "hello" }],
  Head3: [Head3, { children: "hello" }],
  HeaderLink: [HeaderLink, { href: "/hello", children: "hello" }],
  HorizontalBox: [HorizontalBox],
  HR: [HR],
  IconStack: [IconStack],
  ItemCard: [ItemCard, { children: "hello world!" }],
  ButtonLink: [ButtonLink, { href: "/hello", children: "hello" }],
  Link: [Link, { href: "/hello", children: "hello" }],
  ParagraphLink: [ParagraphLink, { href: "/hello", children: "hello" }],
  Logo: [Logo, { text: "protofy" }],
  Notice: [Notice, { children: "Hello world!" }],
  OverlayCard: [OverlayCard],
  OverlayCardBasic: [OverlayCardBasic, {
    title: "Hello",
    subtitle: "Hello World!",
    caption: "go",
    href: "http://google.com"
  }],
  Page: [Page, {}, {
    canDrag: () => false
  }],
  PageGlow: [PageGlow],
  SectionBlock: [SectionBlock],
  TitleLink: [TitleLink, { href: "/hello", children: "hello" }],
  SideBySide: [SideBySide],
  SpotLight: [SpotLight],
  RainbowText: [RainbowText, { children: "hello world" }]
}

export default Object.keys(visualUiComponents).reduce((total, componentName) => {
  var importInfo = {
    moduleSpecifier: 'protolib',
    namedImports: [{ name: componentName, alias: undefined }]
    // defaultImport: componentName
  }
  return {
    ...total,
    [componentName]: componentWrapper(visualUiComponents[componentName][0], componentName, visualUiComponents[componentName][1], importInfo, visualUiComponents[componentName][2])
  }
}, {})

