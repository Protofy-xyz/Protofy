import { Project, SyntaxKind, ObjectLiteralExpression, PropertyAssignment } from 'ts-morph';
import * as fspath from 'path';
import { getRoot } from './getRoot';
import { getLogger } from 'protobase';

const logger = getLogger()

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

export const getDefinitions = (sourceFile, def, numParam = 1) => {
    const callExpressions = sourceFile.getDescendantsOfKind(SyntaxKind.CallExpression);
    const callsToDef = callExpressions.filter(callExpr => {
        const args = callExpr.getArguments()
        const expression = callExpr.getExpression();
        return expression.getKind() === SyntaxKind.Identifier && expression.getText() === 'Protofy' && args.length && args[0].getText() == def;
    }).map(x => x.getArguments()[numParam])
    return callsToDef
}

export const getDefinition = (sourceFile, def, numParam = 1) => {
    const callExpressions = sourceFile.getDescendantsOfKind(SyntaxKind.CallExpression);
    const callToDef = callExpressions.find(callExpr => {
        const args = callExpr.getArguments()
        const expression = callExpr.getExpression();
        return expression.getKind() === SyntaxKind.Identifier && expression.getText() === 'Protofy' && args.length && args[0].getText() == def;
    });
    return callToDef ? callToDef.getArguments()[numParam] : undefined;
}

export const getSourceFile = (path) => {
    const project = new Project();
    const sourceFile = project.addSourceFileAtPath(path)
    return sourceFile
}

export const toSourceFile = (code: string) => {
    const project = new Project({useInMemoryFileSystem: true});
    let source = project.createSourceFile('_temp1.tsx', code, { overwrite: true })
    return source
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
        logger.warn(`"${key}" is already imported`);
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

export const removeImportFromSourceFile = (sourceFile, path: string): void => {
    const importDeclarations = sourceFile.getImportDeclarations();

    for (const importDeclaration of importDeclarations) {
        if (importDeclaration.getModuleSpecifierValue() === path) {
            importDeclaration.remove();
            break;
        }
    }
}

export const addObjectLiteralProperty = (
    objectLiteral: ObjectLiteralExpression,
    key: string,
    value: string
): void => {
    const existingProperty = objectLiteral.getProperty(p =>
        p instanceof PropertyAssignment &&
        ((p.getNameNode().getKind() === SyntaxKind.Identifier && p.getName() === key) ||
            (p.getNameNode().getKind() === SyntaxKind.ComputedPropertyName &&
                p.getNameNode().getText() === `["${key}"]`))
    );

    if (existingProperty) {
        logger.warn(`Object already has key: "${key}".`);
        return;
    }

    const isNormalIdentifier = /^[a-zA-Z_$][a-zA-Z\d_$]*$/.test(key);
    const propertyName = isNormalIdentifier ? key : `["${key}"]`;

    objectLiteral.addPropertyAssignment({
        name: propertyName,
        initializer: value,
    });
};

export const removeObjectLiteralProperty = (
    objectLiteral: ObjectLiteralExpression,
    key: string
): void => {
    const existingProperty = objectLiteral.getProperty(p =>
        p instanceof PropertyAssignment &&
        ((p.getNameNode().getKind() === SyntaxKind.Identifier && p.getName() === key) ||
            (p.getNameNode().getKind() === SyntaxKind.ComputedPropertyName &&
                p.getNameNode().getText() === `["${key}"]`))
    );

    if (existingProperty) {
        existingProperty.remove();
    } else {
        logger.warn(`Key "${key}" does not exist on the object.`);
    }
};

export const removeFileWithImports = async (
    root, value, type, indexFilePath, req, fs
) => {
    const name = value.name
    const localPath = './' + fspath.basename(name)

    const sourceFile = getSourceFile(fspath.join(root, indexFilePath));
    const arg = getDefinition(sourceFile, type);

    if (!arg) {
        throw "No link definition schema marker found for file: " + localPath;
    }

    removeObjectLiteralProperty(arg, name);
    removeImportFromSourceFile(sourceFile, localPath);
    sourceFile.saveSync();

    const filePath = getRoot(req) + 'packages/app/bundles/custom/' + type.replace(/"/g, '') + '/' + fspath.basename(value.name) + '.ts';

    try {
        await fs.unlink(filePath);
    } catch (error) {
        logger.error({ error, filePath }, "Error deleting file")
    }

};

//features functions

export const hasFeature = (sourceFile, key) => {
    let arg = getDefinition(sourceFile, '"features"')
    if (arg) {
        const property = arg.getProperty(key);
        return property !== undefined;
    } else {
        logger.info("Cannot check for feature due to missing features marker")
        return false;
    }
}

export const addFeature = async (sourceFile, key, value) => {
    if (hasFeature(sourceFile, key)) {
        logger.info({ feature: key }, "Feature already exists, not adding")
        return;
    }

    logger.debug('Marker found, writing object');
    let arg = getDefinition(sourceFile, '"features"')
    arg.addPropertyAssignment({
        name: key,
        initializer: value
    });
    await sourceFile.save()
}

export const removeFeature = async (sourceFile, key) => {
    if (!hasFeature(sourceFile, key)) {
        logger.error({ feature: key }, "Feature not found, cannot remove")
        return;
    }

    logger.debug('Marker found, removing object property')
    let arg = getDefinition(sourceFile, '"features"')
    const propertyToRemove = arg.getProperty(key)
    propertyToRemove.remove()
    await sourceFile.save()
}
