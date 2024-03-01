import CallExpression from './CallExpression'
import BinaryExpression, { BinaryExpressionFactory } from './BinaryExpression'
import VariableDeclarationList, { VariableDeclarationListNodeFactory } from './VariableDeclarationList'
import PropertyAccessExpression from './PropertyAccessExpression'
import Function from './Function'
import Parameter from './Parameter'
import IfStatement from './IfStatement'
import TryStatement from './TryStatement'
import SwitchStatement from './SwitchStatement'
import ConditionalExpression from './ConditionalExpression'
import ElementAccessExpression from './ElementAccessExpression'
import ArrayLiteralExpression from './ArrayLiteralExpression'
import ParenthesizedExpression from './ParenthesizedExpression'
import { LoopFactory } from './Loop'
import { UnaryExpressionFactory } from './UnaryExpression'
import ImportDeclaration from './ImportDeclaration'
import ExportAssignment from './ExportAssignment'
import ExportDeclaration from './ExportDeclaration'
import ReturnStatement from './ReturnStatement'
import BreakStatement from './BreakStatement'
import VariableStatement from './VariableStatement'
import { ClassFactory } from './ClassDeclaration'
import { MethodFactory } from './MethodDeclaration'
import NewExpression from './NewExpression'
import ContinueStatement from './ContinueStatement'
import AwaitExpression from './AwaitExpression'
import ObjectLiteralExpression, { ObjectFactory } from './ObjectLiteralExpression'
import ComputedPropertyName from './ComputedPropertyName'
import TemplateExpression from './TemplateExpression'
import Block from './Block'
import PhantomBox from './PhantomBox'
import TypeAliasDeclaration from './TypeAliasDeclaration';
import InterfaceDeclaration from './InterfaceDeclaration';
import ObjectBindingPattern from './ObjectBindingPattern';
import { JsxElementFactory } from './JsxElement';
import JsxExpression from './JsxExpression';
import JsxFragment from './JsxFragment';
import { ForXStatementFactory } from './ForXStatement';
import DeleteExpression from './DeleteExpression';
import SpreadAssignment from './SpreadAssignment';
import ExpressionStatement from './ExpressionStatement';
import VisualGroup from './VisualGroup'
import Layer from './Layer'

const UINodeTypes = {
    Block: Block,
    CallExpression: CallExpression,
    BinaryExpression: BinaryExpressionFactory('+'),
    ObjectLiteralExpression: ObjectLiteralExpression,
    ArrayLiteralExpression: ArrayLiteralExpression,
    ArrowFunction: Function,
    FunctionDeclaration: Function,
    ReturnStatement: ReturnStatement,
    ElementAccessExpression: ElementAccessExpression,
    ParenthesizedExpression: ParenthesizedExpression,
    IfStatement: IfStatement,
    ConditionalExpression: ConditionalExpression,
    WhileStatement: LoopFactory('while'),
    DoStatement: LoopFactory('while', 'do-while'),
    ForStatement: LoopFactory('for'),
    ForInStatement: ForXStatementFactory('in'),
    ForOfStatement: ForXStatementFactory('of'),
    SwitchStatement: SwitchStatement,
    BreakStatement: BreakStatement,
    constNode: VariableDeclarationListNodeFactory('const'),
    letNode: VariableDeclarationListNodeFactory('let'),
    varNode: VariableDeclarationListNodeFactory('var'),
    setNode: BinaryExpressionFactory('='),
    PrefixUnaryExpression: UnaryExpressionFactory('pre'),
    PostfixUnaryExpression: UnaryExpressionFactory('post'),
    ClassDeclaration: ClassFactory('declaration'),
    ClassExpression: ClassFactory('expression'),
    MethodDeclaration: MethodFactory('method'),
    Constructor: MethodFactory('constructor'),
    ImportDeclaration: ImportDeclaration,
    ContinueStatement: ContinueStatement,
    TemplateExpression: TemplateExpression,
    ExportAssignment: ExportAssignment,
    ExportDeclaration: ExportDeclaration,
    NewExpression: NewExpression,
    TryStatement: TryStatement,
    AwaitExpression: AwaitExpression,
    PropertyAccessExpression: PropertyAccessExpression,
    TypeLiteral: ObjectFactory('typeLiteral'),
    TypeAliasDeclaration: TypeAliasDeclaration,
    InterfaceDeclaration: InterfaceDeclaration,
    ObjectBindingPattern: ObjectBindingPattern,
    JsxElement: JsxElementFactory('JsxElement'),
    JsxExpression: JsxExpression,
    JsxFragment: JsxFragment,
    JsxSelfClosingElement: JsxElementFactory('JsxSelfClosingElement'),
    DeleteExpression: DeleteExpression,
    SpreadAssignment: SpreadAssignment,
    CaseClause: Block,
}
export const NodeTypes = {
    ...UINodeTypes,
    //real ast-compatible types
    PropertyAccessExpression: PropertyAccessExpression,
    SourceFile: Block,
    Parameter: Parameter,
    VariableDeclarationList: VariableDeclarationList,
    VariableStatement: VariableStatement,
    ComputedPropertyName: ComputedPropertyName,
    SpreadElement: SpreadAssignment,
    PhantomBox: PhantomBox,
    FunctionExpression: Function,
    ExpressionStatement: ExpressionStatement,
    VisualGroup: VisualGroup,
    Layer: Layer,
    DefaultClause: Block,
}
const nodeColorsPalette = [
    '#EF9A9A', '#F48FB1', '#CE93D8', '#B39DDB', '#9FA8DA', '#90CAF9', '#81D4FA', '#80DEEA', '#80CBC4', '#A5D6A7', '#C5E1A5', '#FFF59D', '#FFE082', '#FFCC80', '#FFAB91', '#BCAAA4', '#EEEEEE', '#B0BEC5',
    '#E57373', '#F06292', '#BA68C8', '#9575CD', '#7986CB', '#64B5F6', '#4FC3F7', '#4DD0E1', '#4DB6AC', '#81C784', '#AED581', '#FFF176', '#FFD54F', '#FFB74D', '#FF8A65', '#A1887F', '#E0E0E0', '#90A4AE',
]

export const nodeColors = Object.keys(UINodeTypes).reduce((obj, key, i) => {
    return {
        ...obj,
        [key]: nodeColorsPalette[i % nodeColorsPalette.length]
    }
}, {})

export default UINodeTypes