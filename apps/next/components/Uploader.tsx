import React, { useState } from "react";
import { FileUploader } from "react-drag-drop-files";

export function Uploader() {
  const [file, setFile] = useState(null);
  const handleChange = (file:any) => {
    console.log('file: ', file)
    setFile(file);
  };

  return (
    <FileUploader multiple={true} handleChange={handleChange} name="file">
        lol
    </FileUploader>
  );
}