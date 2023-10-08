import Dropzone from 'react-dropzone-uploader'

export const Uploader = ({path}) => {
    // specify upload params and url for your files
    const getUploadParams = ({ meta }) => { return { url: '/adminapi/v1/files/'+path } }
    
    // called every time a file's `status` changes
    const handleChangeStatus = ({ meta, file }, status) => { console.log(status, meta, file) }
    
    // receives array of files that are done uploading when submit button is clicked
    const handleSubmit = (files, allFiles) => {
      console.log(files.map(f => f.meta))
      allFiles.forEach(f => f.remove())
    }
  
    return (
      <Dropzone
        styles={{ dropzone: { border: 0, overflow: 'hidden',height: '100%' } }}
        getUploadParams={getUploadParams}
        onChangeStatus={handleChangeStatus}
        onSubmit={handleSubmit}
      />
    )
  }