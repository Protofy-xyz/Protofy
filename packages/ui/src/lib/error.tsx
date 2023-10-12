import { YStack, Text, Spacer } from "tamagui"

export const getErrorMessage = (err) => {
  console.log('error: ', err)
  return (
    <YStack>
      {typeof err == 'string' ? <Text color="$red9" fontWeight={"bold"}>Error: {err}</Text> : <>
        <Text>Error:</Text>
        <Spacer />
        {Object.keys(err.fieldErrors).map((field) => {
          return <Text>
            - [<Text color="$red9" fontWeight={"bold"}>{field}</Text>] {err.fieldErrors[field]}
          </Text>
        })}</>
      }
    </YStack>
  )
}

export const getValidation = (field: string, state: any) => {
  const isError = state?.error?.fieldErrors ? state?.error?.fieldErrors[field] : false
  const props = isError ? {
    boc: "$red9"
  } : {}
  return {
    ...props,
    hoverStyle: {
      ...props
    }
  }
}