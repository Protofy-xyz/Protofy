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

export const getDefinitions = (sourceFile, def, numParam=1) => {
    const callExpressions = sourceFile.getDescendantsOfKind(SyntaxKind.CallExpression);
    const callsToDef = callExpressions.filter(callExpr => {
        const args = callExpr.getArguments()
        const expression = callExpr.getExpression();
        return expression.getKind() === SyntaxKind.Identifier && expression.getText() === 'Protofy' && args.length && args[0].getText() == def;
    }).map(x => x.getArguments()[numParam])
    return callsToDef
}

export const getDefinition = (sourceFile, def, numParam=1) => {
    const callExpressions = sourceFile.getDescendantsOfKind(SyntaxKind.CallExpression);
    const callToDef = callExpressions.find(callExpr => {
        const args = callExpr.getArguments()
        const expression = callExpr.getExpression();
        return expression.getKind() === SyntaxKind.Identifier && expression.getText() === 'Protofy' && args.length && args[0].getText() == def;
    });
    return callToDef.getArguments()[numParam];
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
        console.warn(`"${key}" is already imported`);
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

export const addObjectLiteralProperty = (
    objectLiteral: ObjectLiteralExpression,
    key: string,
    value: string
  ): void => {
    // Intentar obtener la propiedad por clave como identificador o como una propiedad computada.
    const existingProperty = objectLiteral.getProperty(p =>
      p instanceof PropertyAssignment &&
      ((p.getNameNode().getKind() === SyntaxKind.Identifier && p.getName() === key) ||
      (p.getNameNode().getKind() === SyntaxKind.ComputedPropertyName &&
       p.getNameNode().getText() === `["${key}"]`))
    );
  
    if (existingProperty) {
      console.warn(`Object already has key: "${key}".`);
      return;
    }
  
    // Añadir la propiedad como una propiedad computada si la clave tiene caracteres especiales.
    const isNormalIdentifier = /^[a-zA-Z_$][a-zA-Z\d_$]*$/.test(key);
    const propertyName = isNormalIdentifier ? key : `["${key}"]`;
  
    objectLiteral.addPropertyAssignment({
      name: propertyName,
      initializer: value,
    });
  };