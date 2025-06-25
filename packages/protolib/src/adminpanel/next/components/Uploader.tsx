import Dropzone from 'react-dropzone-uploader'
import { Box, File, FileAudio, FileBarChart, FileUp, FileVideo, Trash } from "@tamagui/lucide-icons"
import { XStack, Text, Button, YStack, Progress } from 'tamagui'
import { Tinted } from '../../../components/Tinted'

const Input = ({ accept, onFiles, files, getFilesFromEvent }) => {
  const anyFileSelected = files.length <= 0

  return <YStack borderRadius="$4" ai="center" jc="center" w="100%" h={"100%"}>
    <FileUp color="$color8" size={60} mb="$4" />
    <Text >Drop your files here or</Text>
    <Text
      color="$blue8"
      textDecorationLine="underline"
      cursor="pointer"
      fow="600"
      onPress={() => {
        const input = document.createElement('input')
        input.type = 'file'
        input.accept = accept
        input.multiple = true
        input.style.display = 'none'

        input.onchange = e => {
          const chosenFiles = getFilesFromEvent(e)
          onFiles(chosenFiles)
          document.body.removeChild(input)
        }

        document.body.appendChild(input)
        input.click()
      }}
    >Click to browse</Text>
  </YStack>
}

const Controls = ({ files, onSubmit }) => {
  const onUpload = () => files.forEach(f => f.restart())
  const onCancel = () => {
    files.forEach(f => f.remove())
    onSubmit(files);
  }

  return (
    <XStack gap="$4">
      <Tinted tint="red">
        <Button bc="transparent" px="$6" onPress={onCancel}>
          Cancel
        </Button>
      </Tinted>
      <Button bc="$color7" px="$6" disabled={!files.length} onPress={onUpload}>
        Upload
      </Button>
    </XStack>
  );
};

const FilePreview = ({ meta, fileWithMeta }: any) => {
  const { percent, status } = meta
  const isImg = meta.type?.startsWith('image/')

  const FileTypeIcons = [
    { type: 'audio/', icon: FileAudio },
    { type: 'video/', icon: FileVideo },
    { type: 'application/x-zip', icon: Box },
    { type: 'application/json', icon: FileBarChart },
  ]

  return (
    <XStack  w="100%" gap="$4" key={meta.name} jc='space-between' p="$4" br="$6" bc="$bgContent" ai="center">
      <XStack gap="$4" ai="center" jc="center">
        {isImg ? (
          <img
            src={meta.previewUrl}
            alt={meta.name}
            style={{
              width: 40,
              height: 40,
              objectFit: "cover",
              display: "block",
            }}
          />
        ) : FileTypeIcons.find(icon => meta.type?.startsWith(icon.type)) ? (
          (() => {
            const IconComponent = FileTypeIcons.find(icon => meta.type?.startsWith(icon.type) || meta.type === icon.type)?.icon;
            return IconComponent ? <IconComponent color="$color8" size={30} margin={5} /> : null;
          })()
        ) : (
          <File color="$color8" size={30} margin={5} />
        )}
        <YStack w={380} f={1} gap="$2" ai="flex-start">
          <Text
            flex={1}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {meta.name}
          </Text>
          <Progress bw={0} w="100%" value={percent} bc="$gray6">
            <Progress.Indicator bc="$color8" />
          </Progress>
        </YStack>
      </XStack>
      <Tinted tint="red">
        <Button icon={Trash} onPress={() => fileWithMeta.remove()} />
      </Tinted>
    </XStack>
  )
}

const Layout = ({ input, previews, submitButton, dropzoneProps, files }) => {
  const { style, className, ...handlers } = dropzoneProps

  return <YStack f={1} p="$5" gap="$4" w="100%" bc="$bgPanel">
    <YStack
      {...handlers}
      borderStyle="dashed"
      bw={2}
      p="$4"
      height={files.length > 0 ? 180 : "100%"}
      borderColor="$color8" br="$6" ai="center" gap="$2"
    >
      {input}
    </YStack>
    {
      files.length > 0
      && <YStack ai="center" f={1} gap="$2"  overflow='auto' >
        {previews}
      </YStack>
    }
    <YStack jc="center" ai="center" w="100%">
      {files.length > 0 && submitButton}
    </YStack>
  </YStack>
}




export const Uploader = ({ path, onUpload, setShowUploadDialog, accept = "image/*,audio/*,video/*,.zip" }) => {
  // specify upload params and url for your files
  const getUploadParams = ({ meta }) => { return { url: '/api/core/v1/files/' + path } }

  // called every time a file's `status` changes
  const handleChangeStatus = ({ meta, file }, status, all) => {
    if (status === "done") onUpload({ meta, file });
    if (all.every(f => ["done", "headers_received"].includes(f.meta.status))) {
      setShowUploadDialog(false);
    }
  };

  // receives array of files that are done uploading when submit button is clicked
  const handleSubmit = (files, allFiles) => {
    console.log(files.map(f => f.meta))
    allFiles.forEach(f => f.remove())
    setShowUploadDialog(false)
  }

  return (
    <Dropzone
      autoUpload={false}
      InputComponent={Input}
      SubmitButtonComponent={Controls}
      LayoutComponent={Layout}
      styles={{
        dropzoneActive: { background: '#F1FCF4' },
      }}
      getUploadParams={getUploadParams}
      onChangeStatus={handleChangeStatus}
      onSubmit={handleSubmit}
      accept={accept}
      PreviewComponent={FilePreview}
    />
  )
}