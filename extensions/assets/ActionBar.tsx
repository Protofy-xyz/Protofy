import { Store } from 'lucide-react';
import { Tinted } from 'protolib/components/Tinted';
import { Button, Text, YStack } from "@my/ui"

const getActionBar = (generateEvent) => {

  return [
    <YStack f={1} jc="center" pl="$1.5" mr="$1">
      <Text fos="$3">
        Find or explore new assets for your project?
      </Text>
      <Text fos="$3" color="$gray9">
        Download assets for free.
      </Text>
    </YStack>,
    <Tinted>
      <Button
        bc="$color8"
        hoverStyle={{ bc: '$color7' }}
        onPress={() => generateEvent({ type: "open-store" })}
      >
        Go to the Store
        <Store color='var(--color)' size={20} />
      </Button>
    </Tinted>
  ]
};

export default getActionBar;
