import { Project, SyntaxKind, ObjectLiteralExpression, PropertyAssignment } from 'ts-morph';
import { promises as fs } from 'fs';
import * as fspath from 'path';
import { getRoot } from './getRoot';

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
        console.warn(`Key "${key}" does not exist on the object.`);
    }
};

export const removeFileWithImports = async (
    root, value, type, indexFilePath, req
) => {

    const localPath = './' + fspath.basename(value.name).toLowerCase();
    const sourceFile = getSourceFile(fspath.join(root, indexFilePath));
    const arg = getDefinition(sourceFile, type);

    if (!arg) {
        throw "No link definition schema marker found for file: " + localPath;
    }

    removeObjectLiteralProperty(arg, value.name);
    removeImportFromSourceFile(sourceFile, localPath);
    sourceFile.saveSync();

    const filePath = getRoot(req) + 'packages/app/bundles/custom/' + type.replace(/"/g, '') + '/' + fspath.basename(value.name) + '.ts';

    try {
        await fs.unlink(filePath);
    } catch (err) {
        console.error(`Error deleting file: ${filePath}`, err);
    }

};

//features functions

export const addFeature = async (sourceFile, key, value) => {
    let arg = getDefinition(sourceFile, '"features"')
    if (arg) {
        console.log('Marker found, writing object')
        arg.addPropertyAssignment({
            name: key,
            initializer: value // Puede ser un string, número, otro objeto, etc.
        });

        await sourceFile.save()
    } else {
        console.error("Not adding api feature to object because of missing features marker")
    }
}

export const removeFeature = async (sourceFile, key) => {
    let arg = getDefinition(sourceFile, '"features"')
    if (arg) {
        console.log('Marker found, removing object property');
        const propertyToRemove = arg.getProperty(key);
        if (propertyToRemove) {
            propertyToRemove.remove();
            await sourceFile.save();
        } else {
            console.error("Property 'AutoAPI' not found, cannot remove.");
        }
    } else {
        console.error("Not removing api feature from object due to missing features marker");
    }
}
