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