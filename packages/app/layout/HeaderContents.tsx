import { HeaderContents as ProtoHeaderContents, HeaderContentsProps } from 'protolib/components/layout/HeaderContents'
import { XStack } from '@my/ui';

export const HeaderContents = (props: HeaderContentsProps & { headerTitle?: string }) => {

  return <ProtoHeaderContents
    rightArea={<XStack ai="center">
      {props.topBar}
      {/* <XStack>
          <ConnectionIndicator />
        </XStack> */}
    </XStack>}
    {...props}
  />
}


