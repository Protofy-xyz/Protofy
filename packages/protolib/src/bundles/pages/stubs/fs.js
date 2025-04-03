export default {
    readFileSync: () => '',
    writeFileSync: () => {},
    existsSync: () => false,
    mkdirSync: () => {},
    readdirSync: () => [],
    unlinkSync: () => {},
    rmdirSync: () => {},
    statSync: () => ({
        isDirectory: () => false,
        isFile: () => false,
    }),
    copyFileSync: () => {},
    createReadStream: () => ({
        pipe: () => {},
    }),
    createWriteStream: () => ({
        on: () => {},
        end: () => {},
    }),
    createWriteStreamSync: () => ({
        on: () => {},
        end: () => {},
    }),
    createReadStreamSync: () => ({
        pipe: () => {},
    }),
    appendFileSync: () => {},
    renameSync: () => {},
    readFile: () => ({
        then: () => {},
    }),
    writeFile: () => ({
        then: () => {},
    }),
    unlink: () => ({
        then: () => {},
    }),
    readdir: () => ({
        then: () => {},
    }),
    mkdir: () => ({
        then: () => {},
    }),
    rmdir: () => ({
        then: () => {},
    }),
    stat: () => ({
        then: () => ({
            isDirectory: () => false,
            isFile: () => false,
        }),
    }),
    copyFile: () => ({
        then: () => {},
    }),
    createReadStream: () => ({
        pipe: () => {},
    }),
    createWriteStream: () => ({
        on: () => {},
        end: () => {},
    }),
    createWriteStreamSync: () => ({
        on: () => {},
        end: () => {},
    }),
    createReadStreamSync: () => ({
        pipe: () => {},
    }),
    appendFile: () => ({
        then: () => {},
    }),
    rename: () => ({
        then: () => {},
    }),
    exists: () => ({
        then: () => {},
    }),
    access: () => ({
        then: () => {},
    }),
    accessSync: () => {},
    readlink: () => ({
        then: () => {},
    }),
    symlink: () => ({
        then: () => {},
    }),
    symlinkSync: () => {},
    readlinkSync: () => {},
    lstat: () => ({
        then: () => ({
            isDirectory: () => false,
            isFile: () => false,
        }),
    }),
    lstatSync: () => ({
        isDirectory: () => false,
        isFile: () => false,
    })
  };