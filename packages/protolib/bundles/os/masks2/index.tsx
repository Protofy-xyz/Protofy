import ReadFile from "./ReadFile";
import WriteFile from './WriteFile';
import RunCommand from "./RunCommand";
import ListDir from "./ListDir";
import MakeDir from "./MakeDir";
import FileExists from "./FileExists";
import DeleteFile from "./DeleteFile";
import DeleteDirectory from "./DeleteDirectory";
import RenameFile from "./RenameFile";
import CopyFile from "./CopyFile";
import MoveFile from "./MoveFile";
import CopyDirectory from "./CopyDirectory";
import AppendToFile from "./AppendToFile";
import CompressDirectory from "./CompressDirectory";
import GetFileMetadata from "./GetFileMetadata";

export default [
    ReadFile,
    WriteFile,
    ListDir,
    RunCommand,
    MakeDir,
    FileExists,
    DeleteFile,
    DeleteDirectory,
    RenameFile,
    CopyFile,
    MoveFile,
    CopyDirectory,
    AppendToFile,
    CompressDirectory,
    GetFileMetadata
]