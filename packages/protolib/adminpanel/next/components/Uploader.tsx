import Dropzone from 'react-dropzone-uploader'

export const Uploader = ({path, onUpload, setShowUploadDialog}) => {
    // specify upload params and url for your files
    const getUploadParams = ({ meta }) => { return { url: '/adminapi/v1/files/'+path } }
    
    // called every time a file's `status` changes
    const handleChangeStatus = ({ meta, file }, status) => { 
      if (status=="done") {
        console.log("CHANGE STATUS", status, meta, file) 
        onUpload({ meta, file });
      }
      
    }
    
    // receives array of files that are done uploading when submit button is clicked
    const handleSubmit = (files, allFiles) => {
      console.log(files.map(f => f.meta))
      allFiles.forEach(f => f.remove())
      setShowUploadDialog(false)
    }
  
    return (
      <Dropzone
        styles={{ dropzone: { border: 0, overflow: 'hidden',height: '100%' } }}
        getUploadParams={getUploadParams}
        onChangeStatus={handleChangeStatus}
        onSubmit={handleSubmit}
        submitButtonContent="Close"
      />
    )
  }