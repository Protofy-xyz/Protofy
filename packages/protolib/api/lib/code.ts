import { Project, SyntaxKind, ObjectLiteralExpression, PropertyAssignment } from 'ts-morph';

export const getImport = (sourceFile, identifier) => {
    const importDeclarations = sourceFile.getImportDeclarations();

    for (const importDeclaration of importDeclarations) {
        const namedImports = importDeclaration.getNamedImports();
        for (const namedImport of namedImports) {
            if (namedImport.getName() === identifier) {
                return importDeclaration.getModuleSpecifierValue();
            }
        }
        const defaultImport = importDeclaration.getDefaultImport();
        if (defaultImport && defaultImport.getText() === identifier) {
            return importDeclaration.getModuleSpecifierValue();
        }
    }
}

export const getDefinitions = (sourceFile, def) => {
    const callExpressions = sourceFile.getDescendantsOfKind(SyntaxKind.CallExpression);
    const callsToDef = callExpressions.filter(callExpr => {
        const args = callExpr.getArguments()
        const expression = callExpr.getExpression();
        return expression.getKind() === SyntaxKind.Identifier && expression.getText() === 'Protofy' && args.length && args[0].getText() == def;
    });
    return callsToDef
}

export const getFirstDefinition = (sourceFile, def) => {
    const callExpressions = sourceFile.getDescendantsOfKind(SyntaxKind.CallExpression);
    const callToDef = callExpressions.find(callExpr => {
        const args = callExpr.getArguments()
        const expression = callExpr.getExpression();
        return expression.getKind() === SyntaxKind.Identifier && expression.getText() === 'Protofy' && args.length && args[0].getText() == def;
    });
    return callToDef;
}

export const getSourceFile = (path) => {
    const project = new Project();
    const sourceFile = project.addSourceFileAtPath(path)
    return sourceFile
}

export const extractChainCalls = (callExpr) => {
    const calls = [];
    let currentExpression = callExpr;
    
    while (currentExpression && currentExpression.getKind() === SyntaxKind.CallExpression) {
        const signature = {
            name: currentExpression.getExpression().getLastChild().getText(),
            params: currentExpression.getArguments().map(arg => arg.getText())
        };
        calls.unshift(signature);
        currentExpression = currentExpression.getExpression().getFirstChildIfKind(SyntaxKind.CallExpression);
    }
    return calls;
}

export enum ImportType {
    DEFAULT,
    NAMED
}

export const addImportToSourceFile = (sourceFile, key: string, type: ImportType, path: string): void => {
    if (getImport(sourceFile, key)) {
        console.warn(`El key "${key}" ya ha sido importado en el archivo.`);
        return;
    }
    switch (type) {
        case ImportType.DEFAULT:
            sourceFile.addImportDeclaration({
                defaultImport: key,
                moduleSpecifier: path
            });
            break;
        case ImportType.NAMED:
            sourceFile.addImportDeclaration({
                namedImports: [key],
                moduleSpecifier: path
            });
            break;
    }
}

export const addObjectLiteralProperty = (objectLiteral: ObjectLiteralExpression, key: string, value: string): void => {
    const property = objectLiteral.getProperty(key);
    if (property) {
        console.warn(`Object already has key: "${key}".`);
        return;
    }
    objectLiteral.addPropertyAssignment({
        name: key,
        initializer: value
    });
  }